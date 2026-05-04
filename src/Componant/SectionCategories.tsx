import CarteCategorie from "./CarteCategorie";
import Container from "./Container";


const categories = [
  {
    titre: "Découvrez\nnon Livres",
    description:
      "In maximus quis lorem id tincidunt. Integer vestibulum sed turpis et fermentum.",
    couleur: "#3ec6d0",
    backgroundImage: "/Affiche_livre.png",
  },
  {
    titre: "Télécharger\nune Magazine",
    description:
      "In maximus quis lorem id tincidunt. Integer vestibulum sed turpis et fermentum.",
    couleur: "#6dbe6d",
    backgroundImage: "/Affiche_mag.png",
  },
  {
    titre: "Ecoutez\nnos Audios",
    description:
      "In maximus quis lorem id tincidunt. Integer vestibulum sed turpis et fermentum.",
    couleur: "#e07070",
    backgroundImage: "/Affiche_audio.png",
  },
];

export default function SectionCategories() {
  return (
    <Container className="py-0 mt-6">
      <div className="flex flex-col sm:flex-row gap-6">
        {categories.map((cat) => (
          <CarteCategorie
            key={cat.titre}
            titre={cat.titre}
            description={cat.description}
            couleur={cat.couleur}
            backgroundImage={cat.backgroundImage}
          />
        ))}
      </div>
    </Container>
  );
}
