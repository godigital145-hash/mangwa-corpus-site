import { useState, useEffect, useRef, useCallback } from "react";
import { useAudioEngine } from "../hooks/useAudioEngine";
import { audioEngine } from "../utils/audioEngine";
import { useAudioWaveform } from "../hooks/useAudioWaveform";
import { FluentMusicNote124Filled } from "./SectionAudio";
import { FluentPlay32Filled, FluentPause32Filled } from "./ListeAudio";
import { api, mediaUrl, type Audio, type Album } from "../lib/api";

const BAR_COUNT = typeof window !== "undefined" && window.innerWidth < 640 ? 500 : 2000;

type LyricLine = { time: number; text: string };

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function Waveform({
  audioUrl, progress, onSeek, previewStart, previewEnd, totalDuration,
}: {
  audioUrl: string; progress: number; onSeek: (r: number) => void;
  previewStart?: number | null; previewEnd?: number | null; totalDuration?: number;
}) {
  const { bars, loading } = useAudioWaveform(audioUrl, BAR_COUNT);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !bars) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);
    const count = bars.length;
    const playedCount = Math.floor(progress * count);
    const barW = w / count;

    const dur = totalDuration ?? 0;
    const previewStartBar = dur > 0 && previewStart != null ? Math.floor((previewStart / dur) * count) : 0;
    const previewEndBar = dur > 0 && previewEnd != null ? Math.floor((previewEnd / dur) * count) : count;
    const hasPreview = dur > 0 && (previewStart != null || previewEnd != null);

    for (let i = 0; i < count; i++) {
      const barH = Math.max(2, (bars[i] / 100) * h);
      const x = i * barW;
      const y = (h - barH) / 2;
      const inPreview = !hasPreview || (i >= previewStartBar && i < previewEndBar);
      const played = i < playedCount;

      if (played && inPreview) {
        ctx.fillStyle = "#00bcd4"; ctx.globalAlpha = 1;
      } else if (inPreview) {
        ctx.fillStyle = "#a0aec0"; ctx.globalAlpha = 0.55;
      } else {
        ctx.fillStyle = "#6b7280"; ctx.globalAlpha = 0.3;
      }

      ctx.beginPath();
      const r = Math.min(barW / 2, 2);
      if (ctx.roundRect) ctx.roundRect(x, y, barW, barH, r);
      else ctx.rect(x, y, barW, barH);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }, [bars, progress, previewStart, previewEnd, totalDuration]);

  useEffect(() => {
    draw();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [draw]);

  if (loading || !bars) {
    return (
      <div className="flex items-center gap-[1.5px] h-16 w-full">
        {Array.from({ length: 60 }).map((_, i) => (
          <div key={i} className="flex-1 bg-gray-700 animate-pulse" style={{ height: "30%", borderRadius: 2 }} />
        ))}
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-16 cursor-pointer block"
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        onSeek(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
      }}
      title="Cliquer pour se positionner"
    />
  );
}

function LyricsPanel({ lyrics, currentTime }: { lyrics: LyricLine[]; currentTime: number }) {
  const timed = lyrics.some((l) => l.time > 0);
  const activeIndex = timed
    ? lyrics.reduce((acc, line, i) => (currentTime >= line.time ? i : acc), 0)
    : -1;
  const activeRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [activeIndex]);

  if (lyrics.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        Aucune parole disponible
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto flex flex-col gap-3 py-4 pr-2 scrollbar-thin scrollbar-thumb-gray-300">
      {lyrics.map((line, i) => {
        const isActive = i === activeIndex;
        if (!line.text) return <div key={i} className="h-3" />;
        return (
          <p
            key={i}
            ref={isActive ? activeRef : null}
            className="text-[15px] sm:text-[17px] leading-relaxed transition-all duration-300 karma"
            style={{
              color: isActive ? "#111111" : "#9ca3af",
              fontWeight: isActive ? 700 : 400,
              fontSize: isActive ? "18px" : undefined,
            }}
          >
            {line.text}
          </p>
        );
      })}
    </div>
  );
}

function AlbumTracklist({
  tracks, activeId, playing, onSelect,
}: {
  tracks: Audio[]; activeId: string; playing: boolean; onSelect: (id: string) => void;
}) {
  return (
    <div className="w-full bg-transparent">
      <div className="py-5">
        <p className="text-[11px] text-gray-500 uppercase tracking-widest font-medium mb-3">
          Pistes de l'album
        </p>
        <div className="flex flex-col gap-0.5">
          {tracks.map((track, i) => {
            const isActive = String(track.id) === activeId;
            return (
              <button
                key={track.id}
                onClick={() => onSelect(String(track.id))}
                className="flex items-center gap-4 px-3 py-2.5 rounded transition-colors text-left w-full group"
                style={{ backgroundColor: isActive ? "rgba(255,255,255,0.07)" : "transparent" }}
                onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
              >
                <span className="w-5 text-center text-[12px] shrink-0">
                  {isActive && playing
                    ? <FluentPause32Filled className="h-3 w-3 text-[#00bcd4] inline" />
                    : isActive
                      ? <FluentPlay32Filled className="h-3 w-3 text-[#00bcd4] inline" />
                      : <span className="text-gray-600">{i + 1}</span>
                  }
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium truncate transition-colors" style={{ color: isActive ? "#00bcd4" : "#d1d5db" }}>
                    {track.title}
                  </p>
                  {track.artist && <p className="text-[11px] text-gray-500 truncate">{track.artist}</p>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CollapsibleDescription({ description }: { description: string | null }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  if (!description) return null;

  return (
    <div className="border-t border-white/10 pt-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full text-left group"
      >
        <span className="text-[11px] text-gray-400 uppercase tracking-widest font-medium">Description</span>
        <span className="text-gray-500 transition-transform duration-300" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z" /></svg>
        </span>
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? (contentRef.current?.scrollHeight ?? 400) + "px" : "25px", opacity: open ? 1 : 0.5 }}
      >
        <p className="text-gray-400 text-[13px] leading-relaxed mt-3 whitespace-pre-line">{description}</p>
      </div>
    </div>
  );
}

async function fetchLyrics(lyricsKey: string | null): Promise<LyricLine[]> {
  if (!lyricsKey) return [];
  const url = mediaUrl(lyricsKey);
  if (!url) return [];
  try {
    const text = await fetch(url).then((r) => r.text());
    try { return JSON.parse(text); }
    catch { return text.split("\n").filter(Boolean).map((line) => ({ time: 0, text: line })); }
  } catch { return []; }
}

export default function AudioItemPlayer({ id }: { id: string }) {
  const [audio, setAudio] = useState<Audio | null>(null);
  const [album, setAlbum] = useState<(Album & { tracks: Audio[] }) | null>(null);
  const [activeId, setActiveId] = useState(id);
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileTab, setMobileTab] = useState<"player" | "lyrics">("player");
  const [showPaywall, setShowPaywall] = useState(false);
  const paywallShownRef = useRef(false);
  const isFirstMount = useRef(true);
  const engine = useAudioEngine();

  const audioUrl = audio?.audio_file ? (mediaUrl(audio.audio_file) ?? "") : "";
  const coverUrl = audio?.cover ? mediaUrl(audio.cover) : null;

  useEffect(() => {
    setLoading(true);
    Promise.all([api.audio(activeId), api.audioAlbum(activeId)])
      .then(([a, alb]) => { setAudio(a); setAlbum(alb); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeId]);

  useEffect(() => {
    if (!audio || !audioUrl) return;
    const isPaid = (audio.price ?? 0) > 0 && (audio.free ?? 0) !== 1;
    const meta = {
      id: String(audio.id),
      titre: audio.title,
      artiste: audio.artist,
      previewStart: audio.preview_start,
      previewEnd: audio.preview_end,
      isPaid,
    };
    if (isFirstMount.current) {
      isFirstMount.current = false;
      audioEngine.loadTrack(audioUrl, meta);
    } else {
      audioEngine.loadTrack(audioUrl, meta).then(() => audioEngine.play());
      window.history.pushState(null, "", `/audioitem/${audio.id}`);
    }
    setShowPaywall(false);
    paywallShownRef.current = false;
    fetchLyrics(audio.lyrics).then(setLyrics);
  }, [audio?.id]);

  const isThisTrack = engine.currentAudioUrl === audioUrl;
  const playing = isThisTrack && engine.playing;
  const progress = isThisTrack ? engine.progress : 0;
  const currentTime = isThisTrack ? engine.currentTime : 0;
  const duration = isThisTrack ? engine.duration : 0;

  const isPaid = (audio?.price ?? 0) > 0 && (audio?.free ?? 0) !== 1;
  const previewStart = audio?.preview_start ?? null;
  const previewEnd = audio?.preview_end ?? null;

  // Preview-relative time and progress
  const ps = previewStart ?? 0;
  const pe = previewEnd ?? duration;
  const previewDuration = pe - ps;
  const previewCurrentTime = Math.max(0, currentTime - ps);
  const hasPreview = previewStart != null || previewEnd != null;
  const displayProgress = hasPreview && previewDuration > 0 && isThisTrack
    ? Math.min(1, previewCurrentTime / previewDuration)
    : progress;
  const displayTime = formatTime(hasPreview && isThisTrack ? previewCurrentTime : currentTime);
  const displayDuration = formatTime(hasPreview && previewDuration > 0 ? previewDuration : duration);

  // Show paywall after first preview loop
  useEffect(() => {
    if (!isPaid || !isThisTrack) {
      paywallShownRef.current = false;
      return;
    }
    if (engine.previewDidComplete && !paywallShownRef.current) {
      paywallShownRef.current = true;
      setShowPaywall(true);
    }
  }, [engine.previewDidComplete, isPaid, isThisTrack]);

  useEffect(() => {
    if (!isThisTrack) { setShowPaywall(false); paywallShownRef.current = false; }
  }, [isThisTrack]);

  const handleToggle = () => {
    if (!audioUrl || !audio) return;
    if (isPaid && previewStart == null && previewEnd == null) {
      window.location.href = `/paiement?type=audio&id=${audio.id}`;
      return;
    }
    setShowPaywall(false);
    paywallShownRef.current = false;
    if (!isThisTrack) {
      audioEngine.loadTrack(audioUrl, {
        id: String(audio.id), titre: audio.title, artiste: audio.artist,
        previewStart, previewEnd, isPaid,
      }).then(() => audioEngine.play());
    } else {
      audioEngine.toggle();
    }
  };

  const handleReplay = () => {
    setShowPaywall(false);
    paywallShownRef.current = false;
    const ratio = previewStart != null && duration > 0 ? previewStart / duration : 0;
    audioEngine.seek(ratio);
    audioEngine.play();
  };

  const handleTrackSelect = (newId: string) => {
    if (newId === activeId) { audioEngine.toggle(); }
    else { setActiveId(newId); setAudio(null); }
  };

  const seek = (ratio: number) => { if (isThisTrack) audioEngine.seek(ratio); };

  if (loading || !audio) {
    return <div className="flex flex-col gap-4"><div className="h-100 bg-[#1c1c1c] animate-pulse" /></div>;
  }

  const tabBtn = (tab: "player" | "lyrics", label: string) => (
    <button
      onClick={() => setMobileTab(tab)}
      className="flex-1 py-3 text-[13px] font-semibold uppercase tracking-widest transition-colors"
      style={{
        color: mobileTab === tab ? "#00bcd4" : "#6b7280",
        borderBottom: mobileTab === tab ? "2px solid #00bcd4" : "2px solid transparent",
      }}
    >{label}</button>
  );

  return (
    <div className="flex flex-col w-full">

      {/* Tab bar — mobile only */}
      <div className="flex lg:hidden bg-[#1c1c1c] border-b border-white/10">
        {tabBtn("player", "Lecteur")}
        {tabBtn("lyrics", "Paroles")}
      </div>

      <div className="flex flex-col lg:flex-row gap-0 w-full lg:min-h-150">

        {/* Panneau gauche — Player */}
        <div className={`relative lg:w-[55%] bg-[#1c1c1c] flex-col p-6 sm:p-8 gap-4 ${mobileTab === "lyrics" ? "hidden lg:flex" : "flex"}`}>

          {/* Paywall overlay */}
          {showPaywall && isPaid && (
            <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-4 z-10 px-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#00bcd4">
                <path d="M12 1C8.676 1 6 3.676 6 7v1H4v15h16V8h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v1H8V7c0-2.276 1.724-4 4-4zm0 9a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/>
              </svg>
              <div className="text-center">
                <p className="text-white text-[16px] font-bold">Prévisualisation terminée</p>
                <p className="text-gray-400 text-[13px] mt-1">Achetez pour accéder à la version complète</p>
              </div>
              <div className="flex gap-3 mt-2">
                <a
                  href={`/paiement?type=audio&id=${audio.id}`}
                  className="bg-[#00c853] hover:bg-[#00b548] text-white text-[13px] font-bold px-6 py-2.5 transition-colors"
                >
                  Acheter — {Intl.NumberFormat("fr-FR", { style: "currency", currency: "XAF" }).format(Number(audio.price))}
                </a>
                <button
                  onClick={handleReplay}
                  className="bg-white/10 hover:bg-white/20 text-white text-[13px] font-medium px-5 py-2.5 transition-colors"
                >
                  Réécouter
                </button>
              </div>
            </div>
          )}

          {/* Thumbnail + infos */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#111] flex items-center justify-center shrink-0 overflow-hidden">
                {coverUrl
                  ? <img src={coverUrl} alt={audio.title} className="w-full h-full object-cover" />
                  : <FluentMusicNote124Filled className="w-10 h-10 text-gray-600" />
                }
              </div>
              <div className="min-w-0">
                <h2 className="text-white font-extrabold text-[18px] sm:text-[22px] leading-tight truncate">{audio.title}</h2>
                {audio.artist && <p className="text-gray-400 text-[13px] mt-0.5">{audio.artist}</p>}
              </div>
            </div>
            <button
              onClick={handleToggle}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#00bcd4] hover:bg-[#00acc1] transition-colors flex items-center justify-center text-white shrink-0"
              aria-label={playing ? "Pause" : "Lecture"}
            >
              {playing
                ? <FluentPause32Filled className="h-6 w-6 sm:h-7 sm:w-7" />
                : <FluentPlay32Filled className="h-6 w-6 sm:h-7 sm:w-7" />
              }
            </button>
          </div>

          {/* Waveform + temps */}
          {audioUrl && (
            <div className="flex items-center gap-3 text-gray-400 text-[12px]">
              <span className="shrink-0">{displayTime}</span>
              <Waveform
                audioUrl={audioUrl}
                progress={progress}
                onSeek={seek}
                previewStart={previewStart}
                previewEnd={previewEnd}
                totalDuration={duration || undefined}
              />
              <span className="shrink-0">{displayDuration}</span>
            </div>
          )}

          {/* Bouton d'achat */}
          {audioUrl && (
            <div className="flex items-center justify-between">
              <a
                href={`/paiement?type=audio&id=${audio.id}`}
                className="flex items-center gap-2 bg-[#00c853] hover:bg-[#00b548] transition-colors text-white text-[12px] sm:text-[13px] font-bold"
              >
                <span className="px-4 inter sm:px-5 py-2.5">Télécharger</span>
                <span className="px-4 inter sm:px-5 py-2.5 bg-black/20">
                  {Intl.NumberFormat("fr-FR", { style: "currency", currency: "XAF" }).format(Number(audio.price))}
                </span>
              </a>
            </div>
          )}

          <CollapsibleDescription description={audio.description} />

          {album && album.tracks.length > 0 && (
            <AlbumTracklist tracks={album.tracks} activeId={activeId} playing={playing} onSelect={handleTrackSelect} />
          )}
        </div>

        {/* Panneau droit — Lyrics */}
        <div className={`lg:w-[45%] bg-white border-t lg:border-t-0 lg:border-l border-gray-100 flex-col px-6 sm:px-8 py-6 overflow-hidden max-h-[60vh] lg:max-h-150 ${mobileTab === "player" ? "hidden lg:flex" : "flex"}`}>
          <h3 className="text-[13px] text-gray-400 uppercase tracking-widest font-medium mb-4 shrink-0">Paroles</h3>
          <LyricsPanel lyrics={lyrics} currentTime={currentTime} />
        </div>

      </div>
    </div>
  );
}
