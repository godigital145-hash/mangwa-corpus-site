interface CarteEditionProps {
  imageUrl: string;
  nom: string;
  description: string;
  tag?: string;
}

export default function CarteEdition({ imageUrl, nom, description, tag }: CarteEditionProps) {
  return (
    <div className="relative w-full h-full overflow-hidden cursor-pointer group">
      {/* Image de fond */}
      <img
        src={imageUrl}
        alt={nom}
        className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500"
      />

      {/* Dégradé bas */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

      {/* Tag optionnel */}
      {tag && (
        <span className="absolute top-3 left-3 text-white/70 text-[11px] uppercase tracking-widest z-10">
          {tag}
        </span>
      )}

      {/* Texte bas-gauche */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-6 flex flex-col gap-1.5">
        <h3 className="text-white font-extrabold text-[20px] sm:text-[24px] lg:text-[28px] leading-tight uppercase">
          {nom}
        </h3>
        <p className="text-white/90 text-[12px] sm:text-[14px] lg:text-[16px] karma leading-snug line-clamp-3">
          {description}
        </p>
      </div>
    </div>
  );
}
