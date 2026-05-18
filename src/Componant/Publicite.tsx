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

const formats = [
  {
    id: 1,
    title: "Visibilité",
    description: "Bannières, posts sponsorisés, encarts magazine",
    icon: "👁️"
  },
  {
    id: 2,
    title: "Influence",
    description: "Interviews, articles sponsorisés, placements vidéo",
    icon: "⭐"
  },
  {
    id: 3,
    title: "Partenariat sur mesure",
    description: "Pack 360° print, digital, événementiel et production",
    icon: "🎯"
  }
];

const audiences = [
  { label: "Âge", value: "18-40 ans en majorité" },
  { label: "Zone géographique", value: "Cameroun, Afrique francophone, diaspora" },
  { label: "Centres d'intérêt", value: "Musique, culture, littérature, entrepreneuriat, panafricanisme" },
  { label: "Type d'audience", value: "Qualifiée et engagée, passionnée de contenu de fond" }
];

const process = [
  { step: "1", title: "Brief", description: "Vous nous décrivez votre objectif, budget et cible" },
  { step: "2", title: "Proposition", description: "Nous proposons un plan média adapté à vos besoins" },
  { step: "3", title: "Production & diffusion", description: "Création des visuels/contenus + mise en ligne" },
  { step: "4", title: "Reporting", description: "Chiffres de diffusion, engagement et retombées" }
];

export default function Publicite() {
  return (
    <section className="w-full py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50">
      <Container>
        <AnimatedSection>
          <div className="flex flex-col items-center text-center mb-12 lg:mb-16">
            <h1 className="inter text-[36px] sm:text-[52px] font-bold text-gray-900 uppercase mb-8 text-center">
              Publicité & Partenariats Média
            </h1>
            <p className="text-gray-600 text-[14px] sm:text-[18px] lg:text-[20px] max-w-3xl">
              Mangwa Magazine et les canaux digitaux de Mangwa Corpus touchent une audience engagée : artistes, acteurs culturels, entrepreneurs et passionnés de culture africaine au Cameroun et dans la diaspora.
            </p>
          </div>
        </AnimatedSection>

        {/* Espaces publicitaires */}
        <AnimatedSection delay={100}>
          <div className="mt-16 mb-12">
            <h2 className="text-[24px] sm:text-[30px] font-extrabold text-gray-900 uppercase mb-8">
              1. Espaces publicitaires disponibles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Mangwa Magazine */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 lg:p-8">
                <h3 className="text-[18px] sm:text-[20px] lg:text-[22px] font-bold text-gray-900 mb-4">
                  📰 Mangwa Magazine
                </h3>
                <p className="text-[13px] sm:text-[14px] lg:text-[15px] text-gray-600 mb-4 font-semibold">
                  Bimestriel print & digital
                </p>
                <ul className="space-y-2">
                  <li className="text-[13px] sm:text-[14px] text-gray-600 flex items-start gap-2">
                    <span className="text-[#00bcd4] font-bold mt-0.5">•</span>
                    <span>Page pleine / 1/2 page / 1/4 page : placement dans l'édition print et PDF</span>
                  </li>
                  <li className="text-[13px] sm:text-[14px] text-gray-600 flex items-start gap-2">
                    <span className="text-[#00bcd4] font-bold mt-0.5">•</span>
                    <span>Encart éditorial sponsorisé : article rédigé par nos soins</span>
                  </li>
                  <li className="text-[13px] sm:text-[14px] text-gray-600 flex items-start gap-2">
                    <span className="text-[#00bcd4] font-bold mt-0.5">•</span>
                    <span>Couverture arrière / 2e de couverture : visibilité premium</span>
                  </li>
                </ul>
              </div>

              {/* Site & Réseaux */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 lg:p-8">
                <h3 className="text-[18px] sm:text-[20px] lg:text-[22px] font-bold text-gray-900 mb-4">
                  💻 Site Web & Réseaux Sociaux
                </h3>
                <ul className="space-y-2">
                  <li className="text-[13px] sm:text-[14px] text-gray-600 flex items-start gap-2">
                    <span className="text-[#00bcd4] font-bold mt-0.5">•</span>
                    <span>Bannières web : header, sidebar, articles</span>
                  </li>
                  <li className="text-[13px] sm:text-[14px] text-gray-600 flex items-start gap-2">
                    <span className="text-[#00bcd4] font-bold mt-0.5">•</span>
                    <span>Posts sponsorisés : Instagram, Facebook, TikTok, X</span>
                  </li>
                  <li className="text-[13px] sm:text-[14px] text-gray-600 flex items-start gap-2">
                    <span className="text-[#00bcd4] font-bold mt-0.5">•</span>
                    <span>Stories & Reels sponsorisés : formats vidéo courts</span>
                  </li>
                  <li className="text-[13px] sm:text-[14px] text-gray-600 flex items-start gap-2">
                    <span className="text-[#00bcd4] font-bold mt-0.5">•</span>
                    <span>Newsletter : placement dans notre mailing bimestriel</span>
                  </li>
                </ul>
              </div>

              {/* Contenus vidéo */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 lg:p-8 md:col-span-2">
                <h3 className="text-[18px] sm:text-[20px] lg:text-[22px] font-bold text-gray-900 mb-4">
                  🎥 Contenus Vidéo
                </h3>
                <p className="text-[13px] sm:text-[14px] lg:text-[15px] text-gray-600 mb-4 font-semibold">
                  Podcast, Émissions, Documentaires
                </p>
                <ul className="space-y-2">
                  <li className="text-[13px] sm:text-[14px] text-gray-600 flex items-start gap-2">
                    <span className="text-[#00bcd4] font-bold mt-0.5">•</span>
                    <span>Pre-roll / Mid-roll sur nos vidéos YouTube et podcasts</span>
                  </li>
                  <li className="text-[13px] sm:text-[14px] text-gray-600 flex items-start gap-2">
                    <span className="text-[#00bcd4] font-bold mt-0.5">•</span>
                    <span>Placement produit et mention dans les émissions</span>
                  </li>
                  <li className="text-[13px] sm:text-[14px] text-gray-600 flex items-start gap-2">
                    <span className="text-[#00bcd4] font-bold mt-0.5">•</span>
                    <span>Émissions dédiées "Partenaire" : format interview ou débat</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Audiences */}
        <AnimatedSection delay={200}>
          <div className="mt-16 mb-12">
            <h2 className="text-[24px] sm:text-[30px] font-extrabold text-gray-900 uppercase mb-8">
              2. Nos Audiences
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {audiences.map((item, idx) => (
                <div key={idx} className="bg-white rounded-lg border border-gray-200 p-6">
                  <p className="text-[12px] font-bold text-[#00bcd4] uppercase tracking-wide mb-2">
                    {item.label}
                  </p>
                  <p className="text-[14px] sm:text-[15px] text-gray-700 font-medium">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-[14px] text-gray-600 mt-6 italic">
              Les chiffres précis d'audience sont disponibles sur demande via notre media kit.
            </p>
          </div>
        </AnimatedSection>

        {/* Formats & Tarification */}
        <AnimatedSection delay={300}>
          <div className="mt-16 mb-12">
            <h2 className="text-[24px] sm:text-[30px] font-extrabold text-gray-900 uppercase mb-8">
              3. Formats & Tarification
            </h2>

            <p className="text-[14px] sm:text-[16px] text-gray-600 mb-8">
              On propose 3 formules pour s'adapter à votre budget et objectif :
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {formats.map((format, idx) => (
                <div key={format.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col">
                  <div className="text-4xl mb-4">{format.icon}</div>
                  <h3 className="text-[18px] sm:text-[20px] font-bold text-gray-900 mb-2">
                    {format.title}
                  </h3>
                  <p className="text-[14px] sm:text-[15px] text-gray-600">
                    {format.description}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-[14px] font-bold text-gray-900 mt-8 text-center">
              Tarifs sur demande. Devis gratuit sous 24h.
            </p>
          </div>
        </AnimatedSection>

        {/* Avantages */}
        <AnimatedSection delay={400}>
          <div className="mt-16 mb-12">
            <h2 className="text-[24px] sm:text-[30px] font-extrabold text-gray-900 uppercase mb-8">
              4. Pourquoi choisir Mangwa Corpus ?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#f8f9fa] rounded-lg p-6 flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <div>
                  <p className="font-bold text-gray-900 mb-1">Audience ciblée et qualifiée</p>
                  <p className="text-[13px] sm:text-[14px] text-gray-600">Pas de trafic générique, que des passionnés de culture</p>
                </div>
              </div>
              <div className="bg-[#f8f9fa] rounded-lg p-6 flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <div>
                  <p className="font-bold text-gray-900 mb-1">Crédibilité éditoriale</p>
                  <p className="text-[13px] sm:text-[14px] text-gray-600">Un environnement de confiance pour votre marque</p>
                </div>
              </div>
              <div className="bg-[#f8f9fa] rounded-lg p-6 flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <div>
                  <p className="font-bold text-gray-900 mb-1">Production intégrée</p>
                  <p className="text-[13px] sm:text-[14px] text-gray-600">On crée la pub, le visuel, la vidéo et la diffusons</p>
                </div>
              </div>
              <div className="bg-[#f8f9fa] rounded-lg p-6 flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <div>
                  <p className="font-bold text-gray-900 mb-1">Indépendance éditoriale</p>
                  <p className="text-[13px] sm:text-[14px] text-gray-600">Pas de placement sans cohérence avec nos valeurs</p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Processus */}
        <AnimatedSection delay={500}>
          <div className="mt-16 mb-12">
            <h2 className="text-[24px] sm:text-[30px] font-extrabold text-gray-900 uppercase mb-8">
              5. Processus
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {process.map((item, idx) => (
                <div key={idx} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="w-10 h-10 rounded-full bg-[#00bcd4] text-white flex items-center justify-center font-bold text-lg mb-4">
                    {item.step}
                  </div>
                  <h4 className="text-[16px] font-bold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-[13px] sm:text-[14px] text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Contact */}
        <AnimatedSection delay={600}>
          <div className="bg-[#f8f9fa] rounded-lg border border-gray-200 p-8 lg:p-12 mt-16">
            <h2 className="text-[24px] sm:text-[30px] font-extrabold text-gray-900 uppercase mb-6 text-center">
              Parlons de votre projet
            </h2>

            <p className="text-[16px] lg:text-lg text-gray-700 leading-relaxed text-center mb-8 max-w-2xl mx-auto">
              Pour recevoir le media kit complet et les tarifs de publicité :
            </p>

            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg p-6 border border-[#00bcd4]/20 space-y-4">
                <div>
                  <p className="text-[13px] font-semibold text-gray-600 uppercase tracking-wide mb-2">Email</p>
                  <div className="flex flex-col gap-2">
                    <a href="mailto:daguekotr@gmail.com" className="text-[16px] text-[#00bcd4] hover:underline font-medium">
                      daguekotr@gmail.com
                    </a>
                    <a href="mailto:rtdagueko@yahoo.fr" className="text-[16px] text-[#00bcd4] hover:underline font-medium">
                      rtdagueko@yahoo.fr
                    </a>
                  </div>
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-gray-600 uppercase tracking-wide mb-2">Téléphone</p>
                  <a href="tel:+237698944443" className="text-[16px] text-[#00bcd4] hover:underline font-medium block">
                    +237 698 944 443
                  </a>
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-gray-600 uppercase tracking-wide mb-2">Localisation</p>
                  <p className="text-[16px] text-gray-700 font-medium">Douala, Cameroun</p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection delay={700}>
          <div className="bg-white rounded-lg border border-gray-200 p-8 lg:p-12 mt-16 text-center">
            <h2 className="text-[24px] sm:text-[30px] font-extrabold text-gray-900 uppercase mb-6">
              Prêt à promouvoir votre marque ?
            </h2>
            <p className="text-[16px] lg:text-lg text-gray-700 leading-relaxed mb-8 max-w-2xl mx-auto">
              Contactez-nous dès maintenant pour discuter de vos besoins en publicité et découvrir nos solutions adaptées.
            </p>
            <a
              href="mailto:daguekotr@gmail.com"
              className="inline-block bg-[#00bcd4] hover:bg-[#00acc1] transition-colors text-white font-bold px-8 py-3 rounded-lg text-[14px] sm:text-[16px]"
            >
              Demander le Media Kit
            </a>
          </div>
        </AnimatedSection>
      </Container>
    </section>
  );
}
