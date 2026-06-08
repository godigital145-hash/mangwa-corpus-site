import { useState, useEffect } from "react";
import Container from "./Container";
import Titre from "./Titre";
import { api, mediaUrl, type Audio } from "../lib/api";
import { FluentMusicNote124Filled } from "./SectionAudio";

function formatDuration(seconds: number | null): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function ListePodcasts() {
  const [podcasts, setPodcasts] = useState<Audio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.podcasts()
      .then(setPodcasts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="w-full mt-8 mb-12">
      <Container>
        <Titre titre="Tous les podcasts" />

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square bg-gray-100 animate-pulse rounded" />
            ))}
          </div>
        )}

        {!loading && podcasts.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-16">
            Aucun podcast disponible pour le moment.
          </p>
        )}

        {!loading && podcasts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {podcasts.map((p) => (
              <a
                key={p.id}
                href={`/podcasts/${p.id}`}
                className="group flex gap-4 items-center bg-[#fafafa] hover:bg-[#f0f0f0] transition-colors p-3 rounded-sm"
              >
                <div className="w-24 sm:w-28 shrink-0 aspect-square bg-[#1c1c1c] overflow-hidden flex items-center justify-center">
                  {mediaUrl(p.cover)
                    ? <img src={mediaUrl(p.cover)!} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    : <FluentMusicNote124Filled className="h-10 w-10 text-white/40" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[14px] sm:text-[15px] lg:text-[17px] text-gray-900 line-clamp-2 group-hover:text-[#00bcd4] transition-colors">
                    {p.title}
                  </h3>
                  {p.artist && (
                    <p className="text-[12px] sm:text-[13px] text-gray-500 truncate mt-1">{p.artist}</p>
                  )}
                  {p.duration != null && (
                    <p className="text-[11px] text-gray-400 mt-1">{formatDuration(p.duration)}</p>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
