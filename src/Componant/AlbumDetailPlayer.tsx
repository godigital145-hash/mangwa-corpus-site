import { useState, useEffect, useRef, useCallback } from "react";
import { useAudioEngine } from "../hooks/useAudioEngine";
import { audioEngine } from "../utils/audioEngine";
import { useAudioWaveform } from "../hooks/useAudioWaveform";
import { FluentMusicNote124Filled } from "./SectionAudio";
import { FluentPlay32Filled, FluentPause32Filled } from "./ListeAudio";
import { api, mediaUrl, type Album, type AlbumTrack } from "../lib/api";

const BAR_COUNT = typeof window !== "undefined" && window.innerWidth < 640 ? 500 : 2000;

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 16l-5-5 1.41-1.41L11 13.17V4h2v9.17l2.59-2.58L17 11l-5 5zm-7 4h14v-2H5v2z" />
  </svg>
);

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

export default function AlbumDetailPlayer({ id }: { id: string }) {
  const [album, setAlbum] = useState<(Album & { tracks: AlbumTrack[] }) | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileTab, setMobileTab] = useState<"player" | "tracklist">("player");
  const [showPaywall, setShowPaywall] = useState(false);
  const paywallShownRef = useRef(false);
  const isFirstMount = useRef(true);
  const engine = useAudioEngine();

  useEffect(() => {
    api.album(id)
      .then((alb) => setAlbum(alb))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const activeTrack = album?.tracks[activeIndex] ?? null;
  const audioUrl = activeTrack?.audio_file ? (mediaUrl(activeTrack.audio_file) ?? "") : "";
  const coverUrl = activeTrack?.cover
    ? mediaUrl(activeTrack.cover)
    : album?.cover ? mediaUrl(album.cover) : null;

  const trackIsPaid = (activeTrack?.price ?? 0) > 0 && (activeTrack?.free ?? 0) !== 1;
  const previewStart = activeTrack?.preview_start ?? null;
  const previewEnd = activeTrack?.preview_end ?? null;

  const trackMeta = activeTrack ? {
    id: String(activeTrack.audio_id),
    titre: activeTrack.title,
    artiste: activeTrack.artist ?? "",
    previewStart,
    previewEnd,
    isPaid: trackIsPaid,
  } : null;

  // Load track when active index changes
  useEffect(() => {
    if (!activeTrack || !audioUrl || !trackMeta) return;
    setShowPaywall(false);
    paywallShownRef.current = false;
    if (isFirstMount.current) {
      isFirstMount.current = false;
      audioEngine.loadTrack(audioUrl, trackMeta);
    } else {
      audioEngine.loadTrack(audioUrl, trackMeta).then(() => audioEngine.play());
    }
  }, [activeIndex, activeTrack?.audio_id]);

  const isThisTrack = engine.currentAudioUrl === audioUrl;
  const playing = isThisTrack && engine.playing;
  const progress = isThisTrack ? engine.progress : 0;
  const currentTime = isThisTrack ? engine.currentTime : 0;
  const duration = isThisTrack ? engine.duration : 0;

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
    if (!trackIsPaid || !isThisTrack) {
      paywallShownRef.current = false;
      return;
    }
    if (engine.previewDidComplete && !paywallShownRef.current) {
      paywallShownRef.current = true;
      setShowPaywall(true);
    }
  }, [engine.previewDidComplete, trackIsPaid, isThisTrack]);

  useEffect(() => {
    if (!isThisTrack) { setShowPaywall(false); paywallShownRef.current = false; }
  }, [isThisTrack]);

  const handleToggle = () => {
    if (!audioUrl || !trackMeta) return;
    if (trackIsPaid && previewStart == null && previewEnd == null) {
      window.location.href = `/paiement?type=audio&id=${activeTrack!.audio_id}`;
      return;
    }
    setShowPaywall(false);
    paywallShownRef.current = false;
    if (!isThisTrack) {
      audioEngine.loadTrack(audioUrl, trackMeta).then(() => audioEngine.play());
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

  const handleTrackSelect = (index: number) => {
    if (index === activeIndex) { audioEngine.toggle(); }
    else { setActiveIndex(index); }
  };

  const seek = (ratio: number) => { if (isThisTrack) audioEngine.seek(ratio); };

  if (loading || !album) {
    return <div className="flex flex-col gap-4"><div className="h-100 bg-[#1c1c1c] animate-pulse" /></div>;
  }

  const tabBtn = (tab: "player" | "tracklist", label: string) => (
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
        {tabBtn("tracklist", "Pistes")}
      </div>

      <div className="flex flex-col lg:flex-row gap-0 w-full lg:min-h-[600px]">

        {/* Panneau gauche — Player */}
        <div className={`relative lg:w-[55%] bg-[#1c1c1c] flex-col p-6 sm:p-8 gap-5 ${mobileTab === "tracklist" ? "hidden lg:flex" : "flex"}`}>

          {/* Paywall overlay */}
          {showPaywall && trackIsPaid && (
            <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-4 z-10 px-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#00bcd4">
                <path d="M12 1C8.676 1 6 3.676 6 7v1H4v15h16V8h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v1H8V7c0-2.276 1.724-4 4-4zm0 9a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/>
              </svg>
              <div className="text-center">
                <p className="text-white text-[16px] font-bold">Prévisualisation terminée</p>
                <p className="text-gray-400 text-[13px] mt-1">Achetez l'album pour accéder à toutes les pistes</p>
              </div>
              <div className="flex gap-3 mt-2">
                <a
                  href={`/paiement?type=album&id=${album.id}`}
                  className="bg-[#00c853] hover:bg-[#00b548] text-white text-[13px] font-bold px-6 py-2.5 transition-colors"
                >
                  Acheter l'album
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

          {/* Album cover + info */}
          <div className="flex items-start gap-4">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-[#111] flex items-center justify-center shrink-0 overflow-hidden">
              {coverUrl
                ? <img src={coverUrl} alt={album.title} className="w-full h-full object-cover" />
                : <FluentMusicNote124Filled className="w-12 h-12 text-gray-600" />
              }
            </div>
            <div className="min-w-0 flex flex-col gap-1 pt-1">
              <p className="text-[11px] text-gray-500 uppercase tracking-widest font-medium">Album</p>
              <h2 className="text-white font-extrabold text-[20px] sm:text-[26px] leading-tight truncate">{album.title}</h2>
              {album.artist && <p className="text-gray-400 text-[13px]">{album.artist}</p>}
              {album.genre && <p className="text-[11px] text-gray-600 uppercase tracking-wider">{album.genre}</p>}
              <p className="text-[11px] text-gray-600 mt-0.5">{album.tracks.length} piste{album.tracks.length !== 1 ? "s" : ""}</p>
            </div>
          </div>

          {/* Active track name */}
          {activeTrack && (
            <div className="border-l-2 border-[#00bcd4] pl-3">
              <p className="text-[11px] text-gray-500 uppercase tracking-widest">En lecture</p>
              <p className="text-white font-semibold text-[15px] truncate">{activeTrack.title}</p>
              {activeTrack.artist && <p className="text-gray-500 text-[12px]">{activeTrack.artist}</p>}
            </div>
          )}

          {/* Waveform */}
          {audioUrl && (
            <Waveform
              audioUrl={audioUrl}
              progress={progress}
              onSeek={seek}
              previewStart={previewStart}
              previewEnd={previewEnd}
              totalDuration={duration || undefined}
            />
          )}

          {/* Progress bar + temps */}
          <div className="flex flex-col gap-1.5">
            <div
              className="w-full h-1.5 bg-gray-700 rounded-full cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                seek((e.clientX - rect.left) / rect.width);
              }}
            >
              <div className="h-full bg-[#00bcd4] rounded-full transition-all" style={{ width: `${displayProgress * 100}%` }} />
            </div>
            <div className="flex justify-between text-gray-500 text-[11px]">
              <span>{displayTime}</span>
              <span>{displayDuration}</span>
            </div>
          </div>

          {/* Contrôles */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleTrackSelect(Math.max(0, activeIndex - 1))}
                disabled={activeIndex === 0}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white disabled:opacity-30"
                aria-label="Piste précédente"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" /></svg>
              </button>

              <button
                onClick={handleToggle}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#00bcd4] hover:bg-[#00acc1] transition-colors flex items-center justify-center text-white"
                aria-label={playing ? "Pause" : "Lecture"}
              >
                {playing
                  ? <FluentPause32Filled className="h-6 w-6 sm:h-7 sm:w-7" />
                  : <FluentPlay32Filled className="h-6 w-6 sm:h-7 sm:w-7" />
                }
              </button>

              <button
                onClick={() => handleTrackSelect(Math.min(album.tracks.length - 1, activeIndex + 1))}
                disabled={activeIndex === album.tracks.length - 1}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white disabled:opacity-30"
                aria-label="Piste suivante"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zm2.5-6 6-4.5v9L8.5 12zM16 6h2v12h-2z" /></svg>
              </button>
            </div>

            <a
              href={`/paiement?type=album&id=${album.id}`}
              className="flex items-center gap-2 bg-[#00c853] hover:bg-[#00b548] transition-colors text-white text-[12px] sm:text-[13px] font-bold px-4 sm:px-5 py-2.5"
            >
              Acheter l'album <DownloadIcon />
            </a>
          </div>

          {album.description && (
            <p className="text-gray-500 text-[13px] leading-relaxed border-t border-white/10 pt-4">
              {album.description}
            </p>
          )}
        </div>

        {/* Panneau droit — Tracklist */}
        <div className={`lg:w-[45%] bg-[#161616] border-t lg:border-t-0 lg:border-l border-white/10 flex-col px-4 sm:px-6 py-4 overflow-y-auto max-h-[60vh] lg:max-h-150 ${mobileTab === "player" ? "hidden lg:flex" : "flex"}`}>
          <p className="text-[11px] text-gray-500 uppercase tracking-widest font-medium mb-3 shrink-0">Pistes de l'album</p>
          <div className="flex flex-col gap-0.5">
            {album.tracks.map((track, i) => {
              const isActive = i === activeIndex;
              const trackAudioUrl = track.audio_file ? (mediaUrl(track.audio_file) ?? "") : "";
              const isEngineActive = engine.currentAudioUrl === trackAudioUrl;
              const trackPlaying = isEngineActive && engine.playing;

              return (
                <button
                  key={track.audio_id}
                  onClick={() => handleTrackSelect(i)}
                  className="flex items-center gap-4 px-3 py-2.5 rounded transition-colors text-left w-full group"
                  style={{ backgroundColor: isActive ? "rgba(255,255,255,0.07)" : "transparent" }}
                  onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.04)"; }}
                  onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                >
                  <div className="w-9 h-9 bg-[#111] shrink-0 overflow-hidden flex items-center justify-center">
                    {track.cover
                      ? <img src={mediaUrl(track.cover)!} alt={track.title} className="w-full h-full object-cover" />
                      : <FluentMusicNote124Filled className="w-4 h-4 text-gray-600" />
                    }
                  </div>

                  <span className="w-4 text-center text-[12px] shrink-0">
                    {isActive && trackPlaying
                      ? <FluentPause32Filled className="h-3 w-3 text-[#00bcd4] inline" />
                      : isActive
                        ? <FluentPlay32Filled className="h-3 w-3 text-[#00bcd4] inline" />
                        : <span className="text-gray-600">{track.track_order ?? i + 1}</span>
                    }
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium truncate transition-colors" style={{ color: isActive ? "#00bcd4" : "#d1d5db" }}>
                      {track.title}
                    </p>
                    {track.artist && <p className="text-[11px] text-gray-500 truncate">{track.artist}</p>}
                  </div>

                  {track.duration != null && (
                    <span className="text-[11px] text-gray-600 shrink-0">{formatTime(track.duration)}</span>
                  )}

                  <a
                    href={`/audioitem/${track.audio_id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-[10px] text-gray-600 hover:text-[#00bcd4] uppercase tracking-wider shrink-0 transition-colors"
                  >
                    Lyrics
                  </a>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
