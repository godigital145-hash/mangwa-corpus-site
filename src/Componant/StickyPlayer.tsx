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

  if (!engine.currentTrack) return null;

  const { titre, artiste, coverUrl } = engine.currentTrack;
  const { playing, progress, currentTime, duration } = engine;


  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1c1c1c] border-t border-white/10 shadow-2xl">
      <div className="flex items-center gap-4 px-4 py-3 max-w-screen-xl mx-auto">
        {/* Cover */}
        <div className="w-10 h-10 bg-[#111] flex items-center justify-center shrink-0">
          {engine.currentAudioUrl
            ? <img src={engine.currentAudioUrl as string} alt={titre} className="w-full h-full object-cover" />
            : <FluentMusicNote124Filled className="w-5 h-5 text-gray-600" />
          }
        </div>

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
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-gray-500 text-[10px]">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
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
