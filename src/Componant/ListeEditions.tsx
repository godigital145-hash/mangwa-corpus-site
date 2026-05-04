import Container from "./Container";
import livre from "../assets/livre_1.jpg";

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 16l-5-5 1.41-1.41L11 13.17V4h2v9.17l2.59-2.58L17 11l-5 5zm-7 4h14v-2H5v2z" />
  </svg>
);

interface EditionItem {
  couvertureUrl: string;
  titre: string;
  description: string;
  resume: string;
  autres: { nom: string; description: string }[];
}

const editions: EditionItem[] = [
  {
    couvertureUrl: livre.src,
    titre: "Samuel ETO'O",
    description: "Un homme, une histoire, une légende vivante !",
    resume:
      "Retour sur la carrière du joueur africain le plus titré de tous les temps : l'un des meilleurs attaquants de l'histoire du football !",
    autres: [
      { nom: "Indira Baboke", description: "La jeune prodige de la musique gospel" },
      { nom: "Interview avec", description: "La talentieuse LAURA DAVE CEO de Laura Dave Media" },
      { nom: "Thierry NYAMEN CEO de NTFoods-Tanty", description: "Un entrepreneur perspicace et tenace" },
    ],
  },
  {
    couvertureUrl: livre.src,
    titre: "Samuel ETO'O",
    description: "Un homme, une histoire, une légende vivante !",
    resume:
      "Retour sur la carrière du joueur africain le plus titré de tous les temps : l'un des meilleurs attaquants de l'histoire du football !",
    autres: [
      { nom: "Indira Baboke", description: "La jeune prodige de la musique gospel" },
      { nom: "Interview avec", description: "La talentieuse LAURA DAVE CEO de Laura Dave Media" },
      { nom: "Thierry NYAMEN CEO de NTFoods-Tanty", description: "Un entrepreneur perspicace et tenace" },
    ],
  },
];

export default function ListeEditions() {
  return (
    <section className="w-full mt-10">
      <Container>
        <div className="flex flex-col divide-y divide-gray-200">
          {editions.map((edition, i) => (
            <div
              key={i}
              className="grid grid-cols-1 sm:grid-cols-4 sm:gap-6 py-6 items-start"
            >
              {/* Couverture */}
              <div className="shrink-0 w-full sm:w-full h-[341px] flex justify-center items-center bg-gray-100">
                <img
                  src={edition.couvertureUrl}
                  alt={edition.titre}
                  className="w-[55%] object-contain "
                />
              </div>

              <div className="col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6 p-4 sm:p-6 bg-gray-100 h-full">
                {/* La UNE */}
                <div className="flex-1 min-w-0 karma">
                  <p className="text-[16px] inter text-gray-400 uppercase tracking-widest font-medium mb-1">
                    La UNE
                  </p>
                  <h3 className="font-extrabold text-[18px] inter sm:text-[24px] text-gray-900 uppercase leading-tight mb-4">
                    {edition.titre}
                  </h3>
                  <p className="text-[20px] text-gray-600 mt-0.5">{edition.description}</p>
                  <p className="text-[20px] text-gray-500 mt-2  line-clamp-4">
                    {edition.resume}
                  </p>
                </div>

                {/* Autres */}
                <div className="flex-1 min-w-0">
                  <p className="text-[20px] text-gray-400 uppercase tracking-widest font-medium mb-2">
                    Autres
                  </p>
                  <ul className="flex flex-col gap-2.5">
                    {edition.autres.map((a, j) => (
                      <li key={j}>
                        <p className="text-[20px] font-bold text-gray-800 leading-snug">{a.nom}</p>
                        <p className="text-[20px] karma text-gray-500 leading-snug">{a.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="shrink-0 flex flex-col gap-2 w-full sm:w-auto justify-end">
                  <a
                    href="#"
                    className="flex items-center justify-center gap-2 bg-[#00bcd4] hover:bg-[#00acc1] transition-colors text-white text-[16px] font-bold px-4 py-2.5 whitespace-nowrap"
                  >
                    Lire les quelques pages
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-center gap-2 bg-[#6dbe6d] hover:bg-[#5cb85c] transition-colors text-white text-[16px] font-bold px-4 py-2.5 whitespace-nowrap"
                  >
                    Télécharger <DownloadIcon />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
