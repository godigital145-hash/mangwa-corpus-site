import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import Container from "./Container";

function AnimatedSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, isVisible } = useIntersectionObserver();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
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
      className={`transition-all duration-700 ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      {children}
    </div>
  );
}

const partners = [
  {
    id: 1,
    title: "Partenaires médias & éditoriaux",
    description: "Collaborations avec des médias en ligne, radios et plateformes digitales pour la diffusion de contenus, d'interviews et de chroniques.",
    actions: [
      "Co-production de contenus éditoriaux",
      "Relais d'événements et de sorties musicales",
      "Interviews croisées et dossiers thématiques"
    ],
    icon: "📡"
  },
  {
    id: 2,
    title: "Partenaires artistiques & labels",
    description: "Artistes, producteurs, beatmakers et studios avec qui on co-produit des projets musicaux, des clips et des spectacles.",
    actions: [
      "Co-production d'albums et de singles",
      "Mise à disposition de studios et de matériel",
      "Tournées et showcases communs"
    ],
    icon: "🎵"
  },
  {
    id: 3,
    title: "Partenaires institutionnels & culturels",
    description: "Institutions culturelles, ONG, collectivités et organisations qui soutiennent la promotion de la culture africaine.",
    actions: [
      "Organisation de festivals et d'événements publics",
      "Ateliers, formations et résidences artistiques",
      "Montage de dossiers de subvention et appels à projets"
    ],
    icon: "🏛️"
  },
  {
    id: 4,
    title: "Partenaires techniques & logistiques",
    description: "Prestataires techniques, imprimeurs, agences de com, plateformes de distribution digitale qui assurent la mise en œuvre opérationnelle.",
    actions: [
      "Distribution digitale sur Spotify, Apple Music, Boomplay",
      "Impression du Mangwa Magazine",
      "Régie son/lumière pour nos événements"
    ],
    icon: "⚙️"
  }
];

export default function Partenaires() {
  return (
    <section className="w-full py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50">
      <Container>
        <AnimatedSection>
          <div className="flex flex-col items-center text-center mb-12 lg:mb-16">
            <h1 className="inter text-[36px] sm:text-[52px] font-bold text-gray-900 uppercase mb-8 text-center">
              Nos Partenaires – Mangwa Corpus
            </h1>
            <p className="text-gray-600 text-[14px] sm:text-[18px] lg:text-[20px] max-w-2xl">
              Chez Mangwa Corpus, on construit des projets solides avec des partenaires qui partagent la même exigence : qualité, indépendance et impact culturel durable.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8 mt-12">
          {partners.map((partner, index) => (
            <AnimatedCard key={partner.id} index={index}>
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-6 lg:p-8 flex flex-col gap-4">
                <div className="text-5xl lg:text-6xl">{partner.icon}</div>
                <h3 className="text-[18px] sm:text-[20px] lg:text-[22px] font-bold text-gray-900">
                  {partner.title}
                </h3>
                <p className="text-[14px] sm:text-[15px] lg:text-[16px] text-gray-600 leading-relaxed">
                  {partner.description}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-[13px] sm:text-[14px] font-semibold text-gray-800 mb-3">Exemples d'actions :</h4>
                  <ul className="space-y-2">
                    {partner.actions.map((action, idx) => (
                      <li key={idx} className="text-[13px] sm:text-[14px] text-gray-600 flex items-start gap-2">
                        <span className="text-[#00bcd4] font-bold mt-0.5">•</span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>

        <AnimatedSection delay={400}>
          <div className="bg-[#f8f9fa] rounded-lg border border-gray-200 p-8 lg:p-12 mt-16">
            <h2 className="text-[24px] sm:text-[30px] font-extrabold text-gray-900 uppercase mb-6 text-center">
              Vous voulez devenir partenaire ?
            </h2>

            <p className="text-[16px] lg:text-lg text-gray-700 leading-relaxed text-center mb-8 max-w-2xl mx-auto">
              Mangwa Corpus est ouvert à toute collaboration qui valorise la création africaine, l'innovation culturelle et l'indépendance éditoriale.
            </p>

            <div className="max-w-2xl mx-auto">
              <h3 className="text-[18px] sm:text-[20px] font-bold text-gray-900 mb-4">Ce qu'on propose :</h3>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-[#00bcd4] font-bold text-lg mt-0.5">✓</span>
                  <span className="text-[14px] sm:text-[16px] text-gray-700">Visibilité sur nos canaux : site, Mangwa Magazine, réseaux sociaux</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00bcd4] font-bold text-lg mt-0.5">✓</span>
                  <span className="text-[14px] sm:text-[16px] text-gray-700">Co-création de contenus et d'événements</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#00bcd4] font-bold text-lg mt-0.5">✓</span>
                  <span className="text-[14px] sm:text-[16px] text-gray-700">Accès à notre réseau d'artistes et d'acteurs culturels</span>
                </li>
              </ul>

              <div className="bg-white rounded-lg p-6 border border-[#00bcd4]/20">
                <h3 className="text-[18px] sm:text-[20px] font-bold text-gray-900 mb-4">Contact partenariats</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-[13px] font-semibold text-gray-600 uppercase tracking-wide">Email</p>
                    <a href="mailto:daguekotr@gmail.com" className="text-[16px] text-[#00bcd4] hover:underline font-medium">
                      daguekotr@gmail.com
                    </a>
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-gray-600 uppercase tracking-wide">Téléphone</p>
                    <div className="space-y-1">
                      <a href="tel:+237698944443" className="text-[16px] text-[#00bcd4] hover:underline font-medium block">
                        +237 698 944 443
                      </a>
                      <a href="tel:+237672666503" className="text-[16px] text-[#00bcd4] hover:underline font-medium block">
                        +237 672 666 503
                      </a>
                      <a href="tel:+237620114868" className="text-[16px] text-[#00bcd4] hover:underline font-medium block">
                        +237 620 114 868
                      </a>
                      <a href="tel:+237242978847" className="text-[16px] text-[#00bcd4] hover:underline font-medium block">
                        +237 242 978 847
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </Container>
    </section>
  );
}
