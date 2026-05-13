import { useState, useEffect, useRef, useCallback } from "react";
import type { SVGProps } from "react";
import Container from "./Container";
import { FluentMusicNote124Filled } from "./SectionAudio";
import { useAudioWaveform } from "../hooks/useAudioWaveform";
import { useAudioEngine } from "../hooks/useAudioEngine";
import { audioEngine } from "../utils/audioEngine";
import { api, mediaUrl, type Audio } from "../lib/api";
import Titre from "./Titre";
import { Waveform } from "./AudioItemPlayer";

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

const BAR_COUNT = typeof window !== "undefined" && window.innerWidth < 640 ? 1000 : 2000;

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}



function TrackRow({ id, titre, artiste, album, albumId, audioUrl, coverUrl, previewStart, previewEnd, price, free }: { id: string; titre: string; artiste: string; album?: string | null; albumId?: number | null; audioUrl: string; coverUrl?: string | null; previewStart?: number | null; previewEnd?: number | null; price?: number | null; free?: number }) {
  const engine = useAudioEngine();
  const isThisTrack = engine.currentAudioUrl === audioUrl;
  const playing = isThisTrack && engine.playing;
  const progress = isThisTrack ? engine.progress : 0;
  const currentTime = isThisTrack ? engine.currentTime : 0;
  const duration = isThisTrack ? engine.duration : 0;

  const isPaid = (price ?? 0) > 0 && (free ?? 0) !== 1;
  const [showPaywall, setShowPaywall] = useState(false);
  const paywallShownRef = useRef(false);

  // Show paywall after first preview loop completes
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
    if (!isThisTrack) {
      setShowPaywall(false);
      paywallShownRef.current = false;
    }
  }, [isThisTrack]);

  // Times relative to the preview window
  const ps = previewStart ?? 0;
  const pe = previewEnd ?? duration;
  const previewDuration = pe - ps;
  const previewCurrentTime = Math.max(0, currentTime - ps);
  const previewProgress = previewDuration > 0 && isThisTrack ? Math.min(1, previewCurrentTime / previewDuration) : 0;

  const handlePlay = () => {
    if (isPaid && previewStart == null && previewEnd == null) {
      window.location.href = `/paiement?type=audio&id=${id}`;
      return;
    }
    setShowPaywall(false);
    paywallShownRef.current = false;
    if (!isThisTrack) {
      audioEngine.loadTrack(audioUrl, { id, titre, artiste, previewStart, previewEnd, isPaid }).then(() => audioEngine.play());
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

  const seek = (ratio: number) => {
    if (isThisTrack) audioEngine.seek(ratio);
  };

  return (
    <div className="relative bg-[#1c1c1c] overflow-hidden flex items-stretch">

      {/* Paywall overlay */}
      {showPaywall && isPaid && (
        <div className="absolute inset-0 bg-black/85 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 z-10 px-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#00bcd4" className="shrink-0">
            <path d="M12 1C8.676 1 6 3.676 6 7v1H4v15h16V8h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v1H8V7c0-2.276 1.724-4 4-4zm0 9a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
          </svg>
          <div className="text-center sm:text-left">
            <p className="text-white text-[13px] font-semibold">Prévisualisation terminée</p>
            <p className="text-gray-400 text-[12px]">Achetez pour accéder à la version complète</p>
          </div>
          <div className="flex gap-2">
            <a href={`/paiement?type=audio&id=${id}`} className="bg-[#00c853] hover:bg-[#00b548] text-white text-[12px] font-bold px-4 py-2 transition-colors">
              Acheter
            </a>
            <button onClick={handleReplay} className="bg-white/10 hover:bg-white/20 text-white text-[12px] font-bold px-4 py-2 transition-colors">
              Réécouter
            </button>
          </div>
        </div>
      )}

      {/* Thumbnail */}
      <div className="w-20 sm:w-[146.75px] shrink-0 aspect-square bg-[#111] flex items-center justify-center overflow-hidden">
        {coverUrl
          ? <img src={coverUrl} alt={titre} className="w-20 lg:w-23.5 h-20 lg:h-23.5 object-cover" />
          : <FluentMusicNote124Filled className="w-8 h-8 text-gray-600" />
        }
      </div>

      {/* Centre : info + play + waveform */}
      <div className="flex flex-1 flex-col justify-center gap-2 px-4 py-4">
        {/* Titre + play + temps */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePlay}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white shrink-0"
            aria-label={playing ? "Pause" : "Lecture"}
          >
            {playing ? <FluentPause32Filled className="h-5 w-5" /> : <FluentPlay32Filled className="h-5 w-5" />}
          </button>
          <div className="min-w-0">
            <p className="text-white font-semibold text-[13px] sm:text-[14px] lg:text-[15px] truncate leading-tight">{titre}</p>
            {album && albumId
              ? <a href={`/album/${albumId}`} className="text-[#00bcd4] text-[11px] sm:text-[12px] hover:underline font-medium">{album}</a>
              : <p className="text-gray-500 text-[11px] sm:text-[12px]">{artiste}</p>
            }
          </div>
          <p className="text-gray-500 text-[11px] sm:text-[12px] shrink-0 ml-auto">
            {formatTime(previewCurrentTime)} / {formatTime(previewDuration > 0 ? previewDuration : duration)}
          </p>
        </div>

        {/* Waveform — masquée sur mobile */}
        <div className="hidden sm:flex flex-1 min-h-12">
          <Waveform
            audioUrl={audioUrl}
            progress={progress}
            onSeek={seek}
            previewStart={previewStart}
            previewEnd={previewEnd}
            totalDuration={duration || undefined}
          />
        </div>

        {/* Barre de progression simple sur mobile */}
        <div
          className="block sm:hidden w-full h-1 bg-gray-700 rounded-full cursor-pointer"
          onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); seek((e.clientX - r.left) / r.width); }}
        >
          <div className="h-full bg-[#00bcd4] rounded-full" style={{ width: `${previewProgress * 100}%` }} />
        </div>
      </div>

      {/* Boutons action — masqués sur mobile */}
      <div className="hidden sm:flex flex-col gap-2 justify-center p-4 w-36 lg:w-44 shrink-0">
        <a href={`/audioitem/${id}`} className="flex items-center justify-center bg-[#1b3a5c] hover:bg-[#163150] transition-colors text-white text-[12px] lg:text-[13px] font-bold px-4 py-2 whitespace-nowrap">
          Lyrics
        </a>
        <a href={`/paiement?type=audio&id=${id}`} className="flex items-center justify-center gap-1.5 bg-[#00c853] hover:bg-[#00b548] transition-colors text-white text-[12px] lg:text-[13px] font-bold px-4 py-2 whitespace-nowrap">
          Télécharger <DownloadIcon />
        </a>
      </div>

    </div>
  );
}

const INITIAL_COUNT = 10;
const PAGE_SIZE = 10;

export default function ListeAudio() {
  const [audios, setAudios] = useState<Audio[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  useEffect(() => {
    api.audios()
      .then(setAudios)
      .catch(console.error)
      .finally(() => {
        setLoading(false);
        window.dispatchEvent(new CustomEvent("mangwa:component-ready"));
      });
  }, []);

  const visible = audios.slice(0, visibleCount);
  const hasMore = visibleCount < audios.length;

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
          {visible.map((audio) => (
            <TrackRow
              key={audio.id}
              id={String(audio.id)}
              titre={audio.title}
              artiste={audio.artist}
              album={audio.album}
              albumId={audio.album_id}
              audioUrl={mediaUrl(audio.audio_file) ?? ''}
              coverUrl={mediaUrl(audio.cover)}
              previewStart={audio.preview_start}
              previewEnd={audio.preview_end}
              price={audio.price}
              free={audio.free}
            />
          ))}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="bg-white/10 hover:bg-white/20 text-white text-[14px] font-semibold px-8 py-3 transition-colors"
            >
              Voir plus ({audios.length - visibleCount} restants)
            </button>
          </div>
        )}
      </Container>
    </section>
  );
}
