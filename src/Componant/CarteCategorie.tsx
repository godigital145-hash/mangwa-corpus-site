interface CarteCategorieProps {
  titre: string;
  description: string;
  couleur: string;
  backgroundImage?: string;
}

export default function CarteCategorie({ titre, description, couleur, backgroundImage }: CarteCategorieProps) {
  return (
    <div
      className="relative flex-1 min-w-0 flex flex-col justify-end px-6 py-8 aspect-3/4 sm:aspect-auto sm:min-h-105 lg:w-114.25 lg:h-125 overflow-hidden cursor-pointer group"
      style={{ backgroundColor: couleur, backgroundImage: `url(${backgroundImage})` }}
    >
      <h2 className="text-white karma font-bold text-[22px] sm:text-[26px] lg:text-[30px] leading-tight mb-3 group-hover:underline transition-all w-[60%]">
        {titre}
      </h2>
      <p className="text-white/90 leading-snug max-w-[260px] text-base">
        {description}
      </p>
    </div>
  );
}
