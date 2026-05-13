import { useEffect, useRef, useState } from "react";
import { useAudioEngine } from "../hooks/useAudioEngine";
import { audioEngine } from "../utils/audioEngine";
import { FluentPlay32Filled, FluentPause32Filled } from "./ListeAudio";
import { FluentMusicNote124Filled } from "./SectionAudio";

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function StickyPlayer() {
  const engine = useAudioEngine();
  const [showPaywall, setShowPaywall] = useState(false);
  const paywallShownRef = useRef(false);

  // Reset paywall when a new track is loaded
  useEffect(() => {
    paywallShownRef.current = false;
    setShowPaywall(false);
  }, [engine.currentAudioUrl]);

  // Show paywall after first preview loop completes
  useEffect(() => {
    if (engine.previewDidComplete && !paywallShownRef.current) {
      paywallShownRef.current = true;
      setShowPaywall(true);
    }
  }, [engine.previewDidComplete]);

  if (!engine.currentTrack) return null;

  const { titre, artiste, coverUrl, id: trackId } = engine.currentTrack;
  const { playing, progress, currentTime, duration, previewStart, previewEnd } = engine;

  const ps = previewStart ?? 0;
  const pe = previewEnd ?? duration;
  const previewDuration = pe - ps;
  const previewCurrentTime = Math.max(0, currentTime - ps);
  const hasPreview = previewStart != null || previewEnd != null;
  const displayProgress = hasPreview && previewDuration > 0
    ? Math.min(1, previewCurrentTime / previewDuration)
    : progress;
  const displayTime = formatTime(previewCurrentTime);
  const displayDuration = formatTime(hasPreview && previewDuration > 0 ? previewDuration : duration);

  const handleReplay = () => {
    setShowPaywall(false);
    paywallShownRef.current = false;
    const ratio = previewStart != null && duration > 0 ? previewStart / duration : 0;
    audioEngine.seek(ratio);
    audioEngine.play();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1c1c1c] border-t border-white/10 shadow-2xl">
      <div className="flex items-center gap-4 px-4 py-3 max-w-screen-xl mx-auto">

        {/* Cover */}
        <div className="w-10 h-10 bg-[#111] flex items-center justify-center shrink-0 overflow-hidden">
          {coverUrl
            ? <img src={coverUrl} alt={titre} className="w-full h-full object-cover" />
            : <FluentMusicNote124Filled className="w-5 h-5 text-gray-600" />
          }
        </div>

        {showPaywall ? (
          /* Paywall mode */
          <div className="flex-1 flex items-center justify-between gap-3 min-w-0">
            <div className="min-w-0">
              <p className="text-white text-[13px] font-semibold truncate">{titre}</p>
              <p className="text-[#00bcd4] text-[11px] truncate">Achetez pour écouter la version complète</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`/paiement?type=audio&id=${trackId}`}
                className="bg-[#00c853] hover:bg-[#00b548] text-white text-[12px] font-bold px-3 py-1.5 transition-colors whitespace-nowrap"
              >
                Acheter
              </a>
              <button
                onClick={handleReplay}
                className="bg-white/10 hover:bg-white/20 text-white text-[12px] font-medium px-3 py-1.5 transition-colors whitespace-nowrap"
              >
                Réécouter
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Track info */}
            <div className="min-w-0 w-40 shrink-0">
              <p className="text-white text-[13px] font-semibold truncate">{titre}</p>
              {artiste && <p className="text-gray-400 text-[11px] truncate">{artiste}</p>}
            </div>

            {/* Progress bar */}
            <div className="hidden sm:flex flex-col gap-1 flex-1">
              <div
                className="w-full h-1 bg-gray-700 rounded-full cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  audioEngine.seek((e.clientX - rect.left) / rect.width);
                }}
              >
                <div
                  className="h-full bg-[#00bcd4] rounded-full transition-all"
                  style={{ width: `${displayProgress * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-gray-500 text-[10px]">
                <span>{displayTime}</span>
                <span>{displayDuration}</span>
              </div>
            </div>

            {/* Play/Pause */}
            <button
              onClick={() => audioEngine.toggle()}
              className="w-10 h-10 rounded-full bg-[#00bcd4] hover:bg-[#00acc1] transition-colors flex items-center justify-center text-white shrink-0 ml-auto sm:ml-0"
              aria-label={playing ? "Pause" : "Lecture"}
            >
              {playing
                ? <FluentPause32Filled className="h-5 w-5" />
                : <FluentPlay32Filled className="h-5 w-5" />
              }
            </button>
          </>
        )}

        {/* Fermer */}
        <button
          onClick={() => audioEngine.close()}
          className="w-8 h-8 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center text-gray-400 hover:text-white shrink-0"
          aria-label="Fermer le lecteur"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

      </div>
    </div>
  );
}
