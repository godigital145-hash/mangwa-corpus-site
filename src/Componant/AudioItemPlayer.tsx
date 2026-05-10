import { useState, useEffect, useRef } from "react";
import { useAudioEngine } from "../hooks/useAudioEngine";
import { audioEngine } from "../utils/audioEngine";
import { useAudioWaveform } from "../hooks/useAudioWaveform";
import { FluentMusicNote124Filled } from "./SectionAudio";
import { FluentPlay32Filled, FluentPause32Filled } from "./ListeAudio";
import { api, mediaUrl, type Audio } from "../lib/api";

const BAR_COUNT = 237;

type LyricLine = { time: number; text: string };

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

function Waveform({ audioUrl, progress, onSeek }: { audioUrl: string; progress: number; onSeek: (r: number) => void }) {
  const { bars, loading } = useAudioWaveform(audioUrl, BAR_COUNT);
  const playedCount = Math.floor(progress * BAR_COUNT);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onSeek(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
  };

  if (loading || !bars) {
    return (
      <div className="flex items-end gap-px h-16 w-full">
        {Array.from({ length: BAR_COUNT }).map((_, i) => (
          <div key={i} className="flex-1 rounded-sm bg-gray-700 animate-pulse" style={{ height: "30%" }} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-end gap-px h-16 w-full cursor-pointer" onClick={handleClick}>
      {Array.from(bars).map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm"
          style={{
            height: `${Math.max(4, h)}%`,
            backgroundColor: i < playedCount ? "#00bcd4" : "#4b5563",
            opacity: i < playedCount ? 1 : 0.7,
          }}
        />
      ))}
    </div>
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
  tracks,
  activeId,
  playing,
  onSelect,
}: {
  tracks: Audio[];
  activeId: number;
  playing: boolean;
  onSelect: (id: number) => void;
}) {
  return (
    <div className="w-full bg-transparent">
      <div className="py-5">
        <p className="text-[11px] text-gray-500 uppercase tracking-widest font-medium mb-3">
          Pistes de l'album
        </p>
        <div className="flex flex-col gap-0.5">
          {tracks.map((track, i) => {
            const isActive = track.id === activeId;
            return (
              <button
                key={track.id}
                onClick={() => onSelect(track.id)}
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
                  <p
                    className="text-[13px] font-medium truncate transition-colors"
                    style={{ color: isActive ? "#00bcd4" : "#d1d5db" }}
                  >
                    {track.title}
                  </p>
                  {track.artist && (
                    <p className="text-[11px] text-gray-500 truncate">{track.artist}</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
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
    try {
      return JSON.parse(text);
    } catch {
      return text.split("\n").filter(Boolean).map((line) => ({ time: 0, text: line }));
    }
  } catch {
    return [];
  }
}

export default function AudioItemPlayer({ id }: { id: string }) {
  const [allAudios, setAllAudios] = useState<Audio[]>([]);
  const [activeId, setActiveId] = useState(Number(id));
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [loading, setLoading] = useState(true);
  const isFirstMount = useRef(true);
  const engine = useAudioEngine();

  const audio = allAudios.find((a) => a.id === activeId) ?? null;
  const audioUrl = audio?.audio_file ? (mediaUrl(audio.audio_file) ?? "") : "";
  const coverUrl = audio?.cover ? mediaUrl(audio.cover) : null;

  // Load all audios once
  useEffect(() => {
    api.audios()
      .then(setAllAudios)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Load audio engine + lyrics when active audio changes
  useEffect(() => {
    if (!audio || !audioUrl) return;
    if (isFirstMount.current) {
      isFirstMount.current = false;
      audioEngine.loadTrack(audioUrl, { id: String(audio.id), titre: audio.title, artiste: audio.artist });
    } else {
      audioEngine.loadTrack(audioUrl, { id: String(audio.id), titre: audio.title, artiste: audio.artist })
        .then(() => audioEngine.play());
      window.history.pushState(null, "", `/audioitem/${activeId}`);
    }
    fetchLyrics(audio.lyrics).then(setLyrics);
  }, [activeId, audio?.id]);

  const isThisTrack = engine.currentAudioUrl === audioUrl;
  const playing = isThisTrack && engine.playing;
  const progress = isThisTrack ? engine.progress : 0;
  const currentTime = isThisTrack ? engine.currentTime : 0;
  const duration = isThisTrack ? engine.duration : 0;

  const handleToggle = () => {
    if (!audioUrl) return;
    if (!isThisTrack) {
      audioEngine.loadTrack(audioUrl, { id: String(audio!.id), titre: audio!.title, artiste: audio!.artist })
        .then(() => audioEngine.play());
    } else {
      audioEngine.toggle();
    }
  };

  const handleTrackSelect = (newId: number) => {
    if (newId === activeId) {
      audioEngine.toggle();
    } else {
      setActiveId(newId);
    }
  };

  const seek = (ratio: number) => {
    if (isThisTrack) audioEngine.seek(ratio);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-[400px] bg-[#1c1c1c] animate-pulse" />
      </div>
    );
  }

  if (!audio) {
    return (
      <div className="py-12 text-center text-gray-400">Audio introuvable.</div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col lg:flex-row gap-0 w-full min-h-150">

        {/* Panneau gauche — Player */}
        <div className="lg:w-[55%] bg-[#1c1c1c] flex flex-col p-6 sm:p-10 gap-6">

          {/* Thumbnail + infos */}
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#111] flex items-center justify-center shrink-0">
              {coverUrl
                ? <img src={coverUrl} alt={audio.title} className="w-full h-full object-cover" />
                : <FluentMusicNote124Filled className="w-12 h-12 text-gray-600" />
              }
            </div>
            <div>
              <h2 className="text-white font-extrabold text-[20px] sm:text-[24px] leading-tight">{audio.title}</h2>
              {audio.artist && <p className="text-gray-400 text-[14px] mt-1">{audio.artist}</p>}
            </div>
          </div>

          {/* Waveform */}
          {audioUrl && <Waveform audioUrl={audioUrl} progress={progress} onSeek={seek} />}

          {/* Progress bar + temps */}
          <div className="flex flex-col gap-2">
            <div
              className="w-full h-1.5 bg-gray-700 rounded-full cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                seek((e.clientX - rect.left) / rect.width);
              }}
            >
              <div
                className="h-full bg-[#00bcd4] rounded-full transition-all"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-gray-500 text-[12px]">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Contrôles */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleToggle}
              className="w-14 h-14 rounded-full bg-[#00bcd4] hover:bg-[#00acc1] transition-colors flex items-center justify-center text-white"
              aria-label={playing ? "Pause" : "Lecture"}
            >
              {playing
                ? <FluentPause32Filled className="h-7 w-7" />
                : <FluentPlay32Filled className="h-7 w-7" />
              }
            </button>

            {audioUrl && (
              <a
                href={audioUrl}
                download
                className="flex items-center gap-2 bg-[#00c853] hover:bg-[#00b548] transition-colors text-white text-[13px] font-bold px-5 py-2.5"
              >
                Télécharger <DownloadIcon />
              </a>
            )}
          </div>
          {/* Album tracklist */}
          <AlbumTracklist tracks={allAudios} activeId={activeId} playing={playing} onSelect={handleTrackSelect} />
        </div>

        {/* Panneau droit — Lyrics */}
        <div
          className="lg:w-[45%] bg-white border-l border-gray-100 flex flex-col px-6 sm:px-10 py-6 overflow-hidden"
          style={{ maxHeight: "600px" }}
        >
          <h3 className="text-[13px] text-gray-400 uppercase tracking-widest font-medium mb-4 shrink-0">
            Paroles
          </h3>
          <LyricsPanel lyrics={lyrics} currentTime={currentTime} />
        </div>
      </div>

      {/* Album tracklist
      <AlbumTracklist tracks={allAudios} activeId={activeId} playing={playing} onSelect={handleTrackSelect} /> */}
    </div>
  );
}
