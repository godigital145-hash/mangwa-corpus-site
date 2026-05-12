import { useState, useEffect, useRef, useCallback } from "react";
import type { SVGProps } from "react";
import Container from "./Container";
import { FluentMusicNote124Filled } from "./SectionAudio";
import { useAudioWaveform } from "../hooks/useAudioWaveform";
import { useAudioEngine } from "../hooks/useAudioEngine";
import { audioEngine } from "../utils/audioEngine";
import { api, mediaUrl, type Audio } from "../lib/api";
import Titre from "./Titre";

export function FluentPlay32Filled(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32" {...props}>
      <path fill="currentColor" d="M12.225 4.462C9.89 3.142 7 4.827 7 7.508V24.5c0 2.682 2.892 4.368 5.226 3.045l14.997-8.498c2.367-1.341 2.366-4.751 0-6.091z" />
    </svg>
  );
}

export function FluentPause32Filled(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32" {...props}>
      <path fill="currentColor" d="M7.25 3A3.25 3.25 0 0 0 4 6.25v18.5A3.25 3.25 0 0 0 7.25 28h3.5A3.25 3.25 0 0 0 14 24.75V6.25A3.25 3.25 0 0 0 10.75 3zm14 0A3.25 3.25 0 0 0 18 6.25v18.5A3.25 3.25 0 0 0 21.25 28h3.5A3.25 3.25 0 0 0 28 24.75V6.25A3.25 3.25 0 0 0 24.75 3z" />
    </svg>
  );
}

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 16l-5-5 1.41-1.41L11 13.17V4h2v9.17l2.59-2.58L17 11l-5 5zm-7 4h14v-2H5v2z" />
  </svg>
);

const BAR_COUNT = typeof window !== "undefined" && window.innerWidth < 640 ? 120 : 237;

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function Waveform({
  audioUrl,
  progress,
  onSeek,
  precomputed,
  previewStart,
  previewEnd,
  totalDuration,
}: {
  audioUrl: string;
  progress: number;
  onSeek: (ratio: number) => void;
  precomputed?: number[] | null;
  previewStart?: number | null;
  previewEnd?: number | null;
  totalDuration?: number;
}) {
  const { bars, loading } = useAudioWaveform(audioUrl, BAR_COUNT, precomputed);
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

    // Compute preview region as bar indices
    const dur = totalDuration ?? 0;
    const previewStartBar = dur > 0 && previewStart != null ? Math.floor((previewStart / dur) * count) : 0;
    const previewEndBar = dur > 0 && previewEnd != null ? Math.floor((previewEnd / dur) * count) : count;
    const hasPreview = dur > 0 && (previewStart != null || previewEnd != null);

    for (let i = 0; i < count; i++) {
      const barH = Math.max(2, (bars[i] / 100) * h);
      const x = i * barW;
      const y = h - barH;
      const inPreview = !hasPreview || (i >= previewStartBar && i < previewEndBar);
      const played = i < playedCount;

      if (played && inPreview) {
        ctx.fillStyle = "#00bcd4";
        ctx.globalAlpha = 1;
      } else if (inPreview) {
        ctx.fillStyle = "#a0aec0";
        ctx.globalAlpha = 0.85;
      } else {
        ctx.fillStyle = "#6b7280";
        ctx.globalAlpha = 0.3;
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
      <div className="flex items-end gap-[1.5px] h-[90px] w-full">
        {Array.from({ length: BAR_COUNT }).map((_, i) => (
          <div key={i} className="flex-1 bg-gray-700 animate-pulse" style={{ height: "30%", borderRadius: 2 }} />
        ))}
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-[90px] cursor-pointer block"
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        onSeek(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
      }}
      title="Cliquer pour se positionner"
    />
  );
}

function TrackRow({ id, titre, artiste, album, albumId, audioUrl, coverUrl, waveformData, previewStart, previewEnd }: { id: string; titre: string; artiste: string; album?: string | null; albumId?: number | null; audioUrl: string; coverUrl?: string | null; waveformData?: number[] | null; previewStart?: number | null; previewEnd?: number | null }) {
  const engine = useAudioEngine();
  const isThisTrack = engine.currentAudioUrl === audioUrl;
  const playing = isThisTrack && engine.playing;
  const progress = isThisTrack ? engine.progress : 0;
  const currentTime = isThisTrack ? engine.currentTime : 0;
  const duration = isThisTrack ? engine.duration : 0;

  // Times relative to the preview window
  const ps = previewStart ?? 0;
  const pe = previewEnd ?? duration;
  const previewDuration = pe - ps;
  const previewCurrentTime = Math.max(0, currentTime - ps);
  const previewProgress = previewDuration > 0 && isThisTrack ? Math.min(1, previewCurrentTime / previewDuration) : 0;

  const handlePlay = () => {
    if (!isThisTrack) {
      audioEngine.loadTrack(audioUrl, { id, titre, artiste, previewStart, previewEnd }).then(() => audioEngine.play());
    } else {
      audioEngine.toggle();
    }
  };

  const seek = (ratio: number) => {
    if (isThisTrack) audioEngine.seek(ratio);
  };

  return (
    <div className="bg-[#1c1c1c] overflow-hidden flex sm:grid sm:grid-cols-5">
      {/* Thumbnail */}
      <div className="w-24 sm:w-auto shrink-0 bg-[#111] flex items-center justify-center aspect-square overflow-hidden">
        {coverUrl
          ? <img src={coverUrl} alt={titre} className="w-full h-full object-cover" />
          : <FluentMusicNote124Filled className="w-25 h-25 text-gray-600" />
        }
      </div>

      <div className="col-span-4 flex">
        {/* Infos + waveform */}
        <div className="flex-1 flex flex-col justify-end px-4 sm:px-6 py-6 gap-2 min-w-0">
          {/* Title + play */}
          <div className="flex items-center gap-3 mb-2">
            <div>
              <p className="text-white font-semibold text-[14px] sm:text-[16px] lg:text-[18px] leading-tight">{titre}</p>
              {album && albumId ? (
                <a href={`/album/${albumId}`} className="text-[#00bcd4] text-[12px] sm:text-[13px] hover:underline font-medium">
                  {album}
                </a>
              ) : (
                <p className="text-gray-500 text-[13px]">
                  {isThisTrack && duration > 0
                    ? `${formatTime(previewCurrentTime)} / ${formatTime(previewDuration > 0 ? previewDuration : duration)}`
                    : artiste}
                </p>
              )}
            </div>
            <button
              onClick={handlePlay}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white ml-1"
              aria-label={playing ? "Pause" : "Lecture"}
            >
              {playing
                ? <FluentPause32Filled className="h-6 w-6" />
                : <FluentPlay32Filled className="h-6 w-6" />
              }
            </button>
          </div>

          {/* Waveform cliquable */}
          <Waveform
            audioUrl={audioUrl}
            progress={progress}
            onSeek={seek}
            precomputed={waveformData}
            previewStart={previewStart}
            previewEnd={previewEnd}
            totalDuration={duration || undefined}
          />

          {/* Barre de progression */}
          <div
            className="w-full h-1 bg-gray-700 rounded-full cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              seek((e.clientX - rect.left) / rect.width);
            }}
          >
            <div
              className="h-full bg-[#00bcd4] rounded-full transition-all"
              style={{ width: `${previewProgress * 100}%` }}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="hidden sm:flex w-36 lg:w-48 h-full p-4 flex-col justify-end">
          <div className="flex flex-col gap-4">
            <a
              href={`/audioitem/${id}`}
              className="flex items-center justify-center bg-[#1b3a5c] hover:bg-[#163150] transition-colors text-white text-[12px] sm:text-[16px] font-bold px-5 sm:px-8 whitespace-nowrap py-2"
            >
              Lyrics
            </a>
            <a
              href={`/paiement?type=audio&id=${id}`}
              className="flex items-center justify-center gap-1.5 bg-[#00c853] hover:bg-[#00b548] transition-colors text-white text-[12px] sm:text-[16px] font-bold px-5 sm:px-8 whitespace-nowrap py-2"
            >
              Télécharger <DownloadIcon />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ListeAudio() {
  const [audios, setAudios] = useState<Audio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.audios()
      .then(setAudios)
      .catch(console.error)
      .finally(() => {
        setLoading(false);
        window.dispatchEvent(new CustomEvent("mangwa:component-ready"));
      });
  }, []);

  return (
    <section className="w-full mt-8">
      <Container>
        <Titre titre="Dernière sortie" />

        {loading && (
          <div className="flex flex-col gap-3">
            {[1, 2].map((i) => (
              <div key={i} className="bg-[#1c1c1c] h-40 animate-pulse" />
            ))}
          </div>
        )}
        <div className="flex flex-col gap-3">
          {audios.slice(0, 5).map((audio) => (
            <TrackRow
              key={audio.id}
              id={String(audio.id)}
              titre={audio.title}
              artiste={audio.artist}
              album={audio.album}
              albumId={audio.album_id}
              audioUrl={mediaUrl(audio.audio_file) ?? ''}
              coverUrl={mediaUrl(audio.cover)}
              waveformData={audio.waveform ? (JSON.parse(audio.waveform) as number[]) : null}
              previewStart={audio.preview_start}
              previewEnd={audio.preview_end}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
