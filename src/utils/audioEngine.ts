type Listener = () => void;

interface TrackMeta {
  id: string;
  titre: string;
  artiste: string;
  coverUrl?: string;
  previewStart?: number | null;
  previewEnd?: number | null;
  isPaid?: boolean;
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
  previewStart: number | null = null;
  previewEnd: number | null = null;
  previewDidComplete = false;

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
    if (this.currentAudioUrl === audioUrl) return;

    this.stopSource();
    this.playing = false;
    this.progress = 0;
    this.currentTime = 0;
    this.currentAudioUrl = audioUrl;
    this.currentTrack = meta;
    this.previewStart = meta.previewStart ?? null;
    this.previewEnd = meta.previewEnd ?? null;
    this.previewDidComplete = false;
    this._offset = this.previewStart ?? 0;
    this.notify();

    const ctx = this.getCtx();
    if (!this.bufferCache.has(audioUrl)) {
      const res = await fetch(audioUrl);
      const arrayBuffer = await res.arrayBuffer();
      const decoded = await ctx.decodeAudioData(arrayBuffer);
      this.bufferCache.set(audioUrl, decoded);
    }
    this.duration = this.bufferCache.get(audioUrl)!.duration;
    this.currentTime = this._offset;
    this.progress = this._offset / this.duration;
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
    this.previewDidComplete = false;
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

  close() {
    this.stopSource();
    this.playing = false;
    this.currentTrack = null;
    this.currentAudioUrl = null;
    this.progress = 0;
    this.currentTime = 0;
    this.duration = 0;
    this._offset = 0;
    this.previewStart = null;
    this.previewEnd = null;
    this.previewDidComplete = false;
    this.notify();
  }

  seek(ratio: number) {
    const url = this.currentAudioUrl;
    if (!url) return;
    const buf = this.bufferCache.get(url);
    if (!buf) return;
    const ps = this.previewStart ?? 0;
    const pe = this.previewEnd ?? buf.duration;
    const newTime = Math.max(ps, Math.min(pe, ratio * buf.duration));
    this._offset = newTime;
    this.progress = newTime / buf.duration;
    this.currentTime = newTime;
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

  // Restart source for looping without resetting previewDidComplete
  private _restartForLoop() {
    const url = this.currentAudioUrl;
    const ctx = this.ctx;
    const buf = url ? this.bufferCache.get(url) : null;
    if (!ctx || !buf) return;

    this.stopSource();
    const source = ctx.createBufferSource();
    source.buffer = buf;
    source.connect(ctx.destination);
    source.start(0, this._offset);
    this.sourceNode = source;
    this.startTime = ctx.currentTime;
    this.playing = true;
    this.tick();
  }

  private tick = () => {
    const url = this.currentAudioUrl;
    const ctx = this.ctx;
    const buf = url ? this.bufferCache.get(url) : null;
    if (!ctx || !buf) return;

    const elapsed = this._offset + (ctx.currentTime - this.startTime);
    const end = this.previewEnd ?? buf.duration;
    const clamped = Math.min(elapsed, end);
    this.currentTime = clamped;
    this.progress = clamped / buf.duration;
    this.notify();

    if (clamped < end) {
      this.rafId = requestAnimationFrame(this.tick);
    } else if (this.previewEnd != null) {
      // Preview window defined — loop back and signal completion
      this._offset = this.previewStart ?? 0;
      this.currentTime = this._offset;
      this.progress = this._offset / buf.duration;
      this.previewDidComplete = true;
      this.notify();
      this._restartForLoop();
    } else {
      // No preview — natural end
      this.playing = false;
      this.progress = end / buf.duration;
      this._offset = 0;
      this.currentTime = 0;
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
  previewStart: null,
  previewEnd: null,
  previewDidComplete: false,
  subscribe: (_: () => void) => () => {},
  loadTrack: async (_url: string, _meta: TrackMeta) => {},
  play: () => {},
  pause: () => {},
  toggle: () => {},
  seek: (_ratio: number) => {},
  close: () => {},
} as unknown as AudioEngine;

export const audioEngine = typeof window !== "undefined" ? new AudioEngine() : ssrStub;
