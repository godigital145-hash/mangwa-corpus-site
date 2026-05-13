import { useState, useEffect } from "react";
import Container from "./Container";
import Titre from "./Titre";
import { api, mediaUrl, type Album } from "../lib/api";
import { FluentMusicNote124Filled } from "./SectionAudio";

export default function SectionAlbums() {
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    api.albums().then(setAlbums).catch(console.error);
  }, []);

  if (albums.length === 0) return null;

  return (
    <section className="w-full mt-12 mb-8">
      <Container>
        <Titre titre="Albums" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
          {albums.map((album) => (
            <a
              key={album.id}
              href={`/album/${album.id}`}
              className="flex flex-col gap-2 cursor-pointer group"
            >
              <div className="relative w-full aspect-square bg-[#1c1c1c] flex items-center justify-center overflow-hidden">
                {mediaUrl(album.cover)
                  ? <img src={mediaUrl(album.cover)!} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  : <FluentMusicNote124Filled className="h-16 w-16 text-white/40" />
                }
              </div>
              <p className="text-[13px] sm:text-[15px] lg:text-[17px] font-semibold text-gray-900 group-hover:text-[#00bcd4] transition-colors line-clamp-2">
                {album.title}
              </p>
              {album.artist && (
                <p className="text-[12px] sm:text-[13px] text-gray-500 truncate">{album.artist}</p>
              )}
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
