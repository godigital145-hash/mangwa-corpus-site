type Listener = () => void;

interface TrackMeta {
  id: string;
  titre: string;
  artiste: string;
  coverUrl?: string;
}

class AudioEngine {
  private ctx: AudioContext | null = null;
  private bufferCache = new Map<string, AudioBuffer>();
  private sourceNode: AudioBufferSourceNode | null = null;
  private startTime = 0;
  private _offset = 0;
  private rafId = 0;
  private listeners = new Set<Listener>();

  playing = false;
  progress = 0;
  currentTime = 0;
  duration = 0;
  currentTrack: TrackMeta | null = null;
  currentAudioUrl: string | null = null;

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  private getCtx(): AudioContext {
    if (!this.ctx) this.ctx = new AudioContext();
    return this.ctx;
  }

  async loadTrack(audioUrl: string, meta: TrackMeta) {
    console.log("loadTrack", audioUrl);
    if (this.currentAudioUrl === audioUrl) return;

    this.stopSource();
    this.playing = false;
    this._offset = 0;
    this.progress = 0;
    this.currentTime = 0;
    this.currentAudioUrl = audioUrl;
    this.currentTrack = meta;
    this.notify();

    const ctx = this.getCtx();
    if (!this.bufferCache.has(audioUrl)) {
      const res = await fetch(audioUrl);
      const arrayBuffer = await res.arrayBuffer();
      const decoded = await ctx.decodeAudioData(arrayBuffer);
      this.bufferCache.set(audioUrl, decoded);
    }
    this.duration = this.bufferCache.get(audioUrl)!.duration;
    this.notify();
  }

  play() {
    const url = this.currentAudioUrl;
    if (!url) return;
    const ctx = this.getCtx();
    const buf = this.bufferCache.get(url);
    if (!buf) return;

    if (ctx.state === "suspended") ctx.resume();
    this.stopSource();

    const source = ctx.createBufferSource();
    source.buffer = buf;
    source.connect(ctx.destination);
    source.start(0, this._offset);
    this.sourceNode = source;
    this.startTime = ctx.currentTime;
    this.playing = true;
    this.tick();
    this.notify();
  }

  pause() {
    const ctx = this.ctx;
    if (ctx && this.playing) {
      this._offset += ctx.currentTime - this.startTime;
    }
    this.stopSource();
    this.playing = false;
    this.notify();
  }

  toggle() {
    if (this.playing) this.pause();
    else this.play();
  }

  seek(ratio: number) {
    const url = this.currentAudioUrl;
    if (!url) return;
    const buf = this.bufferCache.get(url);
    if (!buf) return;
    this._offset = ratio * buf.duration;
    this.progress = ratio;
    this.currentTime = this._offset;
    if (this.playing) this.play();
    else this.notify();
  }

  private stopSource() {
    if (this.sourceNode) {
      this.sourceNode.onended = null;
      try { this.sourceNode.stop(); } catch (_) {}
      this.sourceNode = null;
    }
    cancelAnimationFrame(this.rafId);
  }

  private tick = () => {
    const url = this.currentAudioUrl;
    const ctx = this.ctx;
    const buf = url ? this.bufferCache.get(url) : null;
    if (!ctx || !buf) return;

    const elapsed = this._offset + (ctx.currentTime - this.startTime);
    const clamped = Math.min(elapsed, buf.duration);
    this.currentTime = clamped;
    this.progress = clamped / buf.duration;
    this.notify();

    if (clamped < buf.duration) {
      this.rafId = requestAnimationFrame(this.tick);
    } else {
      this.playing = false;
      this.progress = 1;
      this._offset = 0;
      this.notify();
    }
  };
}

const ssrStub = {
  playing: false,
  progress: 0,
  currentTime: 0,
  duration: 0,
  currentTrack: null,
  currentAudioUrl: null,
  subscribe: (_: () => void) => () => {},
  loadTrack: async (_url: string, _meta: TrackMeta) => {},
  play: () => {},
  pause: () => {},
  toggle: () => {},
  seek: (_ratio: number) => {},
} as unknown as AudioEngine;

export const audioEngine = typeof window !== "undefined" ? new AudioEngine() : ssrStub;
