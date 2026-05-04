import CarteLibrairie from "./CarteLibrairie";
import Container from "./Container";
import mangwaCover from "../assets/Etoo.png";
import Titre from "./Titre";
import livre from "../assets/livre_1.jpg";

const livres = [
  {
    imageUrl: livre.src,
    titre: "Le Dernier Sommeil de l'Ourse",
    auteur: undefined,
  },
  {
    imageUrl: "",
    titre: "La Vie Sur La Colline -",
    auteur: "Jonathan Martin",
  },
  {
    imageUrl: mangwaCover.src,
    titre: "Mangwa Magazine Edition Mars 2026",
    auteur: undefined,
  },
  {
    imageUrl: mangwaCover.src,
    titre: "Mangwa Magazine Edition Mars 2026",
    auteur: undefined,
  },
  {
    imageUrl: mangwaCover.src,
    titre: "Mangwa Magazine Edition Mars 2026",
    auteur: undefined,
  },
  {
    imageUrl: mangwaCover.src,
    titre: "Mangwa Magazine Edition Mars 2026",
    auteur: undefined,
  },
  {
    imageUrl: mangwaCover.src,
    titre: "Mangwa Magazine Edition Mars 2026",
    auteur: undefined,
  },
  {
    imageUrl: mangwaCover.src,
    titre: "Mangwa Magazine Edition Mars 2026",
    auteur: undefined,
  },
];

export default function SectionLibrairie() {
  return (
    <section className="w-full lg:mt-[100px]">
      <Container>
        {/* Titre */}
        <Titre titre="Notre librairie" />

        {/* Grille — 2 col mobile, 3 col tablette, 4 col desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {livres.map((livre, i) => (
            <CarteLibrairie
              key={i}
              imageUrl={livre.imageUrl}
              titre={livre.titre}
              auteur={livre.auteur}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
