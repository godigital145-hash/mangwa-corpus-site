import type { SVGProps } from "react";
import audioBg from "../assets/audio.png";
import Container from "./Container";
import Titre from "./Titre";

const MusicNote = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 text-gray-600">
    <path
      d="M24 48V18l28-6v30"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="16" cy="48" r="8" stroke="currentColor" strokeWidth="3" />
    <circle cx="44" cy="42" r="8" stroke="currentColor" strokeWidth="3" />
  </svg>
);


export function FluentMusicNote124Filled(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>{/* Icon from Fluent UI System Icons by Microsoft Corporation - https://github.com/microsoft/fluentui-system-icons/blob/main/LICENSE */}<path fill="currentColor" d="M11.513 2.048a.75.75 0 0 0-1.013.702v12.127a4 4 0 1 0 1.476 3.56a.8.8 0 0 0 .024-.187V8.832l6.987 2.62A.75.75 0 0 0 20 10.75V7.483a3.25 3.25 0 0 0-2.109-3.044z" /></svg>
  )
}

const albums = [
  { titre: "Titre du livre" },
  { titre: "Titre du livre" },
  { titre: "Titre du livre" },
  { titre: "Titre du livre" },
  { titre: "Titre du livre" },
];

export default function SectionAudio() {
  return (
    <section className="w-full lg:mt-[100px]">
      <Container>
        {/* Titre section */}
        <Titre titre="Nos Albums Audio" />

        {/* Bannière hero */}
        <div className="relative w-full h-60 sm:h-[340px] lg:h-[425px] overflow-hidden bg-black mb-4">
          {/* Image à droite */}
          <img
            src={audioBg.src}
            alt="Audio"
            className="h-full w-auto object-contain object-center"
          />

          {/* Dégradé noir → transparent de gauche à droite */}
          {/* <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent" /> */}

          {/* Texte à gauche */}
          <div className="absolute top-0 left-0 right-0 z-10 h-full flex flex-col justify-center px-8 sm:px-12 max-w-[60%] sm:max-w-[55%] gap-4">
            <h3 className="text-white font-bold text-[32px] sm:text-[28px] lg:text-[34px] leading-tight">
              Plongez dans nos audios accompagnés de leurs paroles.
            </h3>
            <p className="text-white/80 text-[14px] sm:text-[16px] leading-relaxed hidden sm:block">
              Chaque contenu est une expérience complète où le son et les mots se rencontrent pour
              transmettre émotion, message et inspiration. Écoutez, suivez les lyrics et laissez-vous
              porter par chaque détail.
            </p>
          </div>
        </div>

        {/* Grille 5 albums — 2 col mobile, 3 col tablette, 5 col desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {albums.map((album, i) => (
            <div key={i} className="flex flex-col gap-2 cursor-pointer group">
              {/* Vignette */}
              <div className="relative w-full aspect-square bg-[#1c1c1c] flex items-center justify-center overflow-hidden">
                <FluentMusicNote124Filled className="h-20 w-20 text-white" />
              </div>
              {/* Titre */}
              <p className="text-[13px] sm:text-[14px] font-semibold text-gray-900 group-hover:text-[#00bcd4] transition-colors">
                {album.titre}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
