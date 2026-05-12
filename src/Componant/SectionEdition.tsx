import CarteEdition from "./CarteEdition";
import Container from "./Container";
import mangwaCover from "../assets/decouvert.png";
import Titre from "./Titre";
import type { SVGProps } from "react";
import image_1 from '../assets/image_1.png';
import image_2 from '../assets/image_2.png';
import image_3 from '../assets/image_3.png';


const articles = [
  {
    imageUrl: image_1.src,
    nom: "Indira Baboke",
    description: "La jeune prodige de la musique gospel",
    tag: "gospel",
  },
  {
    imageUrl: image_2.src,
    nom: "Laura Dave",
    description: "Interview avec La talentueuse LAURA DAVE CEO de Laura Dave Media",
  },
  {
    imageUrl: image_3.src,
    nom: "Léopold Boukeu",
    description: "Un maître de la cuisine… Un as culinaire !",
  },


];


export function FluentArrowRight32Regular(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32" {...props}>{/* Icon from Fluent UI System Icons by Microsoft Corporation - https://github.com/microsoft/fluentui-system-icons/blob/main/LICENSE */}<path fill="currentColor" d="M3 16a1 1 0 0 1 1-1h21.586l-8.293-8.293a1 1 0 0 1 1.414-1.414l10 10a1 1 0 0 1 0 1.414l-10 10a1 1 0 0 1-1.414-1.414L25.586 17H4a1 1 0 0 1-1-1" /></svg>
  )
}

export default function SectionEdition() {
  return (
    <section className="w-full">
      <Container>
        {/* Titre */}
        <Titre titre="Dans cette édition" />

        {/* Séparateur */}

        {/* Grille 4 colonnes — 1 col mobile, 2 col tablette, 4 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[300px] sm:auto-rows-[380px] lg:auto-rows-[420px]">
          {articles.map((article) => (
            <CarteEdition
              key={article.nom}
              imageUrl={article.imageUrl}
              nom={article.nom}
              description={article.description}
              tag={article.tag}
            />
          ))}

          {/* 4e carte — CTA Magazine */}
          <div className="relative w-full h-full bg-[#6dbe6d] flex flex-col items-center justify-between overflow-hidden cursor-pointer px-5 pt-6 pb-7">
            {/* Cover magazine */}
            <div className="absolute left-0 top-0 flex-1 flex items-center justify-center w-full z-0">
              <img
                src={mangwaCover.src}
                alt="Mangwa Magazine cover"
                className="h-full w-auto object-contain "
              />
            </div>
            {/* CTA bas */}
            <a
              href="#"
              className="px-6 absolute flex bottom-0 left-0 right-0 z-10 h-[20%] w-full items-center justify-content gap-3 text-black font-bold text-[18px] leading-tight mt-4"
            >
              <span>Decouvrez<br />plus de magazine</span>
              <FluentArrowRight32Regular className="h-8 w-8" />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
