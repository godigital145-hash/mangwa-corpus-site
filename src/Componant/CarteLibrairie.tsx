interface CarteLibrairieProps {
  imageUrl: string;
  titre: string;
  auteur?: string;
}

export default function CarteLibrairie({ imageUrl, titre, auteur }: CarteLibrairieProps) {
  return (
    <div className="flex flex-col gap-3 cursor-pointer group">
      {/* Vignette */}
      <div className="w-full aspect-[4/5] bg-[#efefef] flex items-center justify-center overflow-hidden px-6 py-8">
        <img
          src={imageUrl}
          alt={titre}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-102"
        />
      </div>

      {/* Infos */}
      <div className="flex flex-col gap-0.5">
        <p className="text-[16px] sm:text-[20px] font-bold text-gray-900 uppercase leading-snug group-hover:text-[#00bcd4] transition-colors">
          {titre}
        </p>
        {auteur && (
          <p className="text-[16px] sm:text-[20px] text-gray-600">
            {auteur}
          </p>
        )}
      </div>
    </div>
  );
}
