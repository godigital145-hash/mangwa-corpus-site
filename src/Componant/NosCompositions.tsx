import { useState, useEffect } from "react";
import Container from "./Container";
import { FluentMusicNote124Filled } from "./SectionAudio";
import Titre from "./Titre";
import { api, mediaUrl, type Audio } from "../lib/api";

const PAGE_SIZE = 10;

export default function NosCompositions() {
  const [audios, setAudios] = useState<Audio[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    api.audios().then(setAudios).catch(console.error);
  }, []);

  const visible = audios.slice(0, visibleCount);
  const hasMore = visibleCount < audios.length;

  return (
    <section className="w-full mt-10">
      <Container>
        <Titre titre="Nos compositions" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {visible.map((item) => (
            <a key={item.id} href={`/audioitem/${item.id}`} className="flex flex-col gap-2 group">
              <div className="relative w-full aspect-square bg-[#1c1c1c] flex items-center justify-center overflow-hidden">
                {item.cover
                  ? <img src={mediaUrl(item.cover) ?? ""} alt={item.title} className="w-full h-full object-cover" />
                  : <FluentMusicNote124Filled className="h-14 w-14 text-gray-600" />
                }
              </div>
              <p className="text-[16px] sm:text-[20px] font-semibold text-gray-900 group-hover:text-[#00bcd4] transition-colors">
                {item.title}
              </p>
              {item.artist && (
                <p className="text-[13px] text-gray-500 -mt-1">{item.artist}</p>
              )}
            </a>
          ))}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="bg-white/10 hover:bg-white/20 text-gray-900 text-[14px] font-semibold px-8 py-3 transition-colors"
            >
              Voir plus ({audios.length - visibleCount} restants)
            </button>
          </div>
        )}
      </Container>
    </section>
  );
}
