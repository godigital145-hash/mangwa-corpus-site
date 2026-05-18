import Container from "./Container";
import Titre from "./Titre";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";

const services = [


  {
    id: 3,
    title: "Édition & Vente d’Ebooks",
    description: "On publie, promeut et vend des ouvrages d’auteurs camerounais et africains.",
    icon: "📚",
  },
  {
    id: 2,
    title: "Mangwa Magazine",
    description: "Le Magazine de référence – Bimestriel généraliste indépendant.",
    icon: "📰",
  },
  {
    id: 1,
    title: "Écriture & Production musicale",
    description: "On crée et produisons de la musique avec une identité forte.",
    icon: "🎵",
  },
  {
    id: 4,
    title: "Création de Contenus Vidéo",
    description: "On produit du contenu vidéo pour artistes, médias et entreprises.",
    icon: "🎬",
  },
  {
    id: 5,
    title: "Organisation de Festivals & Événementiel",
    description: "On conçoit et produisons des événements culturels à fort impact",
    icon: "🎪",
  }
];

const images = {
  hero: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&q=80",
  mission: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=80",
  gallery1: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80",
  gallery2: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
  gallery3: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80",
  histoire: "https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&w=900&q=80",
};

function AnimatedSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, isVisible } = useIntersectionObserver();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
    >
      {children}
    </div>
  );
}

function AnimatedCard({ children, index }: { children: React.ReactNode; index: number }) {
  const { ref, isVisible } = useIntersectionObserver();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 100}ms` }}
      className={`transition-all duration-700 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
    >
      {children}
    </div>
  );
}

export default function Services() {
  return (
    <section className="w-full py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50">
      <Container>
        <AnimatedSection>
          <div className="flex flex-col items-center text-center mb-12 lg:mb-16">
            {/* <Titre titre="Nos Services" /> */}
            {/* ── Titre ── */}
            <h1 className="inter text-[36px] sm:text-[52px] font-bold text-gray-900 uppercase mb-8 text-center">
              Nos Services – Mangwa Corpus
            </h1>
            <div className="max-w-2xl mx-auto text-center py-14">
              <p className="text-[24px] sm:text-[40px] text-gray-700 leading-relaxed karma italic">
                Productions artistiques, culturelles, éditoriales & événementielles – Douala, Cameroun
              </p>
            </div>

            <p className="text-gray-600 text-[14px] sm:text-[18px] lg:text-[20px] max-w-2xl mt-4">
              Mangwa Corpus accompagne la création africaine de l’idée à la diffusion. Voici nos 5 pôles d’activité :
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <AnimatedCard key={service.id} index={index}>
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-6 lg:p-8 flex flex-col gap-4">
                <div className="text-4xl lg:text-5xl">{service.icon}</div>
                <h3 className="text-[18px] sm:text-[20px] lg:text-[22px] font-bold text-gray-900">
                  {service.title}
                </h3>
                <p className="text-[14px] sm:text-[15px] lg:text-[16px] text-gray-600 leading-relaxed flex-1">
                  {service.description}
                </p>
              </div>
            </AnimatedCard>
          ))}
        </div>
        <Main>


          {/* ── Texte gauche / Image droite ── */}
          <AnimatedSection delay={300}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start mt-10">
              <div className="flex flex-col gap-5">
                <h2 className="text-[24px] sm:text-[30px] font-extrabold text-gray-900 uppercase leading-tight">
                  Édition & Vente d’Ebooks
                </h2>
                <div className="karma ">
                  <p className="text-[16px] lg:text-xl text-gray-600 leading-relaxed mb-3">
                    On publie, promeut et vend des ouvrages d’auteurs camerounais et africains.
                  </p>
                  <p className="text-[16px] lg:text-xl text-gray-600 leading-relaxed mb-3">
                    Ce qu’on fait :
                    <ul className="list-disc list-inside">
                      <li>Mise en forme et publication numérique des livres</li>
                      <li>Présentation d’auteurs : biographie, interview, extraits</li>
                      <li>Distribution et vente sur nos canaux et plateformes partenaires</li>
                      <li>Stratégie de lancement et promotion digitale</li>
                    </ul>
                  </p>
                  <p className="text-[16px] lg:text-xl text-gray-600 leading-relaxed mb-3">
                    <b className="font-bold">Exemple :</b> Plateforme de vente directe d’ebooks engagés sur la mémoire, l’identité et le panafricanisme. Chaque auteur bénéficie d’une fiche auteur et d’une mise en avant éditoriale.
                  </p>
                </div>
              </div>
              <div className="w-full aspect-square overflow-hidden">
                <img
                  src={'/books.png'}
                  alt="Notre équipe"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </AnimatedSection>
        </Main>

        {/* ── Galerie 4 images ── */}
        <AnimatedSection delay={200}>
          <div className="w-full max-w-7xl mx-auto flex sm:grid sm:grid-cols-4 gap-4 overflow-x-auto snap-x snap-mandatory">
            <AnimatedCard index={0}>
              <div className="w-[80vw] sm:w-full shrink-0 aspect-square overflow-hidden snap-center snap-always">
                <img
                  src={'/press.avif'}
                  alt="Édition & Presse"
                  className="w-full h-full object-cover"
                />
              </div>
            </AnimatedCard>
            <AnimatedCard index={1}>
              <div className="w-[80vw] sm:w-full shrink-0 aspect-square overflow-hidden snap-center snap-always">
                <img
                  src={'/micro.avif'}
                  alt="Musique & Audio"
                  className="w-full h-full object-cover"
                />
              </div>
            </AnimatedCard>
            <AnimatedCard index={2}>
              <div className="w-[80vw] sm:w-full shrink-0 aspect-square overflow-hidden snap-center snap-always">
                <img
                  src={'/album.jpg'}
                  alt="Librairie & Savoir"
                  className="w-full h-full object-cover"
                />
              </div>
            </AnimatedCard>
            <AnimatedCard index={3}>
              <div className="w-[80vw] sm:w-full shrink-0 aspect-square overflow-hidden snap-center snap-always">
                <img
                  src={'/exempl_mag.jpg'}
                  alt="Librairie & Savoir"
                  className="w-full h-full object-cover"
                />
              </div>
            </AnimatedCard>
          </div>
        </AnimatedSection>

        {/* ── Image gauche / Texte droite ── */}
        <Main>
          <AnimatedSection delay={400}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start mt-10">
              <div className="w-full aspect-square overflow-hidden">
                <img
                  src={'/mag.jpg'}
                  alt="Notre histoire"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col gap-5">
                <h2 className="text-[24px] sm:text-[30px] font-extrabold text-gray-900 uppercase leading-tight">
                  Mangwa Magazine
                </h2>
                <div className="karma">
                  <p className="text-[16px] lg:text-xl text-gray-600 leading-relaxed mb-3">
                    <b>Le Magazine de référence</b> – Bimestriel généraliste indépendant.
                  </p>
                  <p className="text-[16px] lg:text-xl text-gray-600 leading-relaxed mb-3">
                    <b>Contenu :</b>
                    <ul className="list-disc list-inside">
                      <li>Portraits d’artistes, entrepreneurs et acteurs culturels</li>
                      <li>Dossiers société, culture, histoire, panafricanisme</li>
                      <li>Critiques musique, cinéma, littérature, arts visuels</li>
                      <li>SReportages terrain et couverture d’événements</li>
                    </ul>
                  </p>
                  <p className="text-[16px] lg:text-xl text-gray-600 leading-relaxed mb-3">
                    <b>Objectif :</b>
                    Documenter la création africaine actuelle avec exigence éditoriale et sans compromis. Le magazine sert aussi de vitrine aux projets produits par Mangwa Corpus et aux voix émergentes.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={500}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start mt-10">
              <div className="flex flex-col gap-5">
                <h2 className="text-[24px] sm:text-[30px] font-extrabold text-gray-900 uppercase leading-tight">
                  Écriture & Production musicale
                </h2>
                <div className="karma ">
                  <p className="text-[16px] lg:text-xl text-gray-600 leading-relaxed mb-3">
                    On crée et produisons de la musique avec une identité forte.
                  </p>
                  <p className="text-[16px] lg:text-xl text-gray-600 leading-relaxed mb-3">
                    <b>Services :</b>
                    <ul className="list-disc list-inside">
                      <li>Écriture et composition en français et anglais</li>
                      <li>Direction artistique, arrangement, enregistrement, mixage</li>
                      <li>Production d’albums, singles, jingles, bandes originales</li>
                      <li>Distribution digitale et stratégie de sortie</li>
                    </ul>
                  </p>
                  <p className="text-[16px] lg:text-xl text-gray-600 leading-relaxed mb-3">
                    <b className="font-bold">Exemple :</b> Endgame Project – album de 14 titres hybrides mêlant rap, afrobeat, zouk, reggae, gospel, country. Thèmes : authenticité, dénonciation sociale, mémoire, fierté africaine.
                  </p>
                </div>
              </div>
              <div className="w-full aspect-square overflow-hidden">
                <img
                  src={'/music.jpg'}
                  alt="Notre équipe"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={600}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start mt-10">
              <div className="w-full aspect-square overflow-hidden">
                <img
                  src={'/videos.jpg'}
                  alt="Notre histoire"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col gap-5">
                <h2 className="text-[24px] sm:text-[30px] font-extrabold text-gray-900 uppercase leading-tight">
                  Création de Contenus Vidéo
                </h2>
                <div className="karma">
                  <p className="text-[16px] lg:text-xl text-gray-600 leading-relaxed mb-3">
                    On produit du contenu vidéo pour artistes, médias et entreprises.
                  </p>
                  <p className="text-[16px] lg:text-xl text-gray-600 leading-relaxed mb-3">
                    <b>Formats :</b>
                    <ul className="list-disc list-inside">
                      <li><b>Podcasts & émissions : </b>captation multi-cam, montage, habillage</li>
                      <li><b>Documentaires :</b>écriture, tournage, post-production</li>
                      <li><b>Films & séries TV : </b>développement, production exécutive, diffusion</li>
                      <li><b>Clips musicaux et capsules réseaux sociaux</b></li>
                    </ul>
                  </p>
                  <p className="text-[16px] lg:text-xl text-gray-600 leading-relaxed mb-3">
                    <b>Approche :</b>
                    Storytelling ancré dans l’esthétique africaine contemporaine, pensé pour le web et la TV.

                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={700}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start mt-10">
              <div className="flex flex-col gap-5">
                <h2 className="text-[24px] sm:text-[30px] font-extrabold text-gray-900 uppercase leading-tight">
                  Organisation de Festivals & Événementiel
                </h2>
                <div className="karma ">
                  <p className="text-[16px] lg:text-xl text-gray-600 leading-relaxed mb-3">
                    On conçoit et produisons des événements culturels à fort impact.
                  </p>
                  <p className="text-[16px] lg:text-xl text-gray-600 leading-relaxed mb-3">
                    <b>Prestations :</b>
                    <ul className="list-disc list-inside">
                      <li>Direction artistique et programmation</li>
                      <li>Logistique, régie technique, son, lumière, plateau</li>
                      <li>Gestion des partenariats et communication événementielle</li>
                      <li>Festivals, concerts, showcases, soirées corporate à volet culturel</li>
                    </ul>
                  </p>
                  <p className="text-[16px] lg:text-xl text-gray-600 leading-relaxed mb-3">
                    <b className="font-bold">Objectif : </b> Créer des rendez-vous qui fédèrent le public et valorisent la scène locale.
                  </p>
                </div>
              </div>
              <div className="w-full aspect-square overflow-hidden">
                <img
                  src={'/events.jpg'}
                  alt="Notre équipe"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={800}>
            <div className="bg-[#f8f9fa] rounded-lg border border-gray-200 p-8 lg:p-12 mt-16 text-center">
              <h2 className="text-[24px] sm:text-[30px] font-extrabold text-gray-900 uppercase mb-6">
                Vous voulez devenir partenaire ?
              </h2>
              <p className="text-[16px] lg:text-lg text-gray-700 leading-relaxed mb-8 max-w-2xl mx-auto">
                Collaborez avec Mangwa Corpus pour amplifier la création africaine. Découvrez les différents types de partenariats disponibles.
              </p>
              <a
                href="/partenaires"
                className="inline-block bg-[#00bcd4] hover:bg-[#00acc1] transition-colors text-white font-bold px-8 py-3 rounded-lg text-[14px] sm:text-[16px]"
              >
                Découvrir nos Partenariats
              </a>
            </div>
          </AnimatedSection>
        </Main>
      </Container>
    </section>
  );
}

function Main({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full max-w-5xl mx-auto py-10 px-0 sm:px-0 flex flex-col gap-16">{children}</main>
  )
}