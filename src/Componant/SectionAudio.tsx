import { useState, useEffect } from "react";
import type { SVGProps } from "react";
import audioBg from "../assets/audio.png";
import Container from "./Container";
import Titre from "./Titre";
import { api, mediaUrl, type Audio } from "../lib/api";
import HeroSection from "./HeroSection";
import Banniere from "./Banniere";

export function FluentMusicNote124Filled(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>{/* Icon from Fluent UI System Icons by Microsoft Corporation - https://github.com/microsoft/fluentui-system-icons/blob/main/LICENSE */}<path fill="currentColor" d="M11.513 2.048a.75.75 0 0 0-1.013.702v12.127a4 4 0 1 0 1.476 3.56a.8.8 0 0 0 .024-.187V8.832l6.987 2.62A.75.75 0 0 0 20 10.75V7.483a3.25 3.25 0 0 0-2.109-3.044z" /></svg>
  )
}

export default function SectionAudio() {
  const [audios, setAudios] = useState<Audio[]>([]);

  useEffect(() => {
    api.audios().then(setAudios).catch(console.error);
  }, []);
  return (
    <section className="w-full lg:mt-[100px]">

      <Container>
        {/* Titre section */}
        <Titre titre="Nos Albums Audio" />

        {/* Bannière hero */}
        <Banniere page="audio" />
        {/* Grille audios — 2 col mobile, 3 col tablette, 5 col desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {audios.map((audio) => (
            <a key={audio.id} href={`/audioitem/${audio.id}`} className="flex flex-col gap-2 cursor-pointer group">
              <div className="relative w-full aspect-square bg-[#1c1c1c] flex items-center justify-center overflow-hidden">
                {mediaUrl(audio.cover)
                  ? <img src={mediaUrl(audio.cover)!} alt={audio.title} className="w-full h-full object-cover" />
                  : <FluentMusicNote124Filled className="h-20 w-20 text-white" />
                }
              </div>
              <p className="text-[13px] sm:text-[20px] font-semibold text-gray-900 group-hover:text-[#00bcd4] transition-colors">
                {audio.title}
              </p>
              <p className="text-[14px] text-gray-500">{audio.artist}</p>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}



