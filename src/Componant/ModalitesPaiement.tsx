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

const paymentMethods = [
  {
    id: 1,
    title: "Mobile Money",
    description: "Le moyen le plus rapide au Cameroun",
    icon: "📱",
    details: [
      "MTN Mobile Money & Orange Money",
      "Numéro : +237 698 944 443",
      "Titulaire : TCHINDA DAGUEKO Raymond",
      "Indiquez le motif du paiement (Nom + Objet)"
    ]
  },
  {
    id: 2,
    title: "Virement bancaire",
    description: "Pour les entreprises et paiements internationaux",
    icon: "🏦",
    details: [
      "Coordonnées bancaires sur demande par email",
      "Envoyées après établissement du devis/facture",
      "Banque basée au Cameroun",
      "XAF et devises acceptées"
    ]
  },
  {
    id: 3,
    title: "Espèces / Paiement physique",
    description: "Paiement direct à notre bureau",
    icon: "💵",
    details: [
      "Uniquement sur rendez-vous à Douala",
      "Reçu officiel remis sur place",
      "Pour les petits montants",
      "Très sécurisé"
    ]
  },
  {
    id: 4,
    title: "Paiement en ligne",
    description: "Bientôt disponible",
    icon: "💳",
    details: [
      "Disponible pour ebooks",
      "Abonnements Mangwa Magazine",
      "Lien de paiement sécurisé",
      "Contactez-nous pour accès anticipé"
    ]
  }
];

const processSteps = [
  { step: "1", title: "Devis", description: "Nous vous envoyons un devis détaillé après validation de votre demande" },
  { step: "2", title: "Validation", description: "Vous confirmez par retour de mail" },
  { step: "3", title: "Facture proforma", description: "Envoyée avec les coordonnées de paiement" },
  { step: "4", title: "Paiement", description: "Selon le mode choisi" },
  { step: "5", title: "Facturation & Livraison", description: "Facture acquittée et lancement de la prestation" }
];

const notes = [
  {
    label: "Délai production",
    text: "La production démarre après réception de 50% d'acompte minimum, sauf accord contraire"
  },
  {
    label: "Validité devis",
    text: "Les devis sont valables 7 jours. Les tarifs peuvent être révisés au-delà"
  },
  {
    label: "Factures",
    text: "Tous les paiements donnent lieu à une facture conforme au RCCM CM-DLA-01-2025-A10-01934 et NIU P018217230860M"
  },
  {
    label: "Litiges",
    text: "Pour toute question sur un paiement, contactez-nous sous 48h"
  }
];

export default function ModalitesPaiement() {
  return (
    <section className="w-full py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50">
      <Container>
        <AnimatedSection>
          <div className="flex flex-col items-center text-center mb-12 lg:mb-16">
            <h1 className="inter text-[36px] sm:text-[52px] font-bold text-gray-900 uppercase mb-8 text-center">
              Informations de Paiement
            </h1>
            <p className="text-gray-600 text-[14px] sm:text-[18px] lg:text-[20px] max-w-3xl">
              Pour régler vos commandes, prestations ou partenariats avec Mangwa Corpus, voici les moyens de paiement disponibles. Tous les paiements font l'objet d'une facture officielle.
            </p>
          </div>
        </AnimatedSection>

        {/* Moyens de paiement */}
        <AnimatedSection delay={100}>
          <div className="mt-16 mb-12">
            <h2 className="text-[24px] sm:text-[30px] font-extrabold text-gray-900 uppercase mb-8">
              Moyens de Paiement Disponibles
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8">
              {paymentMethods.map((method) => (
                <div key={method.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 lg:p-8 flex flex-col gap-4">
                  <div className="text-5xl lg:text-6xl">{method.icon}</div>
                  <h3 className="text-[18px] sm:text-[20px] lg:text-[22px] font-bold text-gray-900">
                    {method.title}
                  </h3>
                  <p className="text-[14px] sm:text-[15px] lg:text-[16px] text-gray-600">
                    {method.description}
                  </p>
                  <ul className="space-y-2 pt-4 border-t border-gray-200">
                    {method.details.map((detail, idx) => (
                      <li key={idx} className="text-[13px] sm:text-[14px] text-gray-600 flex items-start gap-2">
                        <span className="text-[#00bcd4] font-bold mt-0.5">•</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Processus de facturation */}
        <AnimatedSection delay={200}>
          <div className="mt-16 mb-12">
            <h2 className="text-[24px] sm:text-[30px] font-extrabold text-gray-900 uppercase mb-8">
              Processus de Facturation
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {processSteps.map((item, idx) => (
                <div key={idx} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="w-10 h-10 rounded-full bg-[#00bcd4] text-white flex items-center justify-center font-bold text-lg mb-4">
                    {item.step}
                  </div>
                  <h4 className="text-[16px] font-bold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-[13px] sm:text-[14px] text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Notes importantes */}
        <AnimatedSection delay={300}>
          <div className="mt-16 mb-12">
            <h2 className="text-[24px] sm:text-[30px] font-extrabold text-gray-900 uppercase mb-8">
              Notes Importantes
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {notes.map((note, idx) => (
                <div key={idx} className="bg-[#f8f9fa] rounded-lg p-6 border border-gray-200">
                  <h4 className="text-[16px] font-bold text-gray-900 mb-3">{note.label}</h4>
                  <p className="text-[13px] sm:text-[14px] text-gray-600 leading-relaxed">{note.text}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Contact */}
        <AnimatedSection delay={400}>
          <div className="bg-[#f8f9fa] rounded-lg border border-gray-200 p-8 lg:p-12 mt-16">
            <h2 className="text-[24px] sm:text-[30px] font-extrabold text-gray-900 uppercase mb-6 text-center">
              Questions sur le Paiement ?
            </h2>

            <p className="text-[16px] lg:text-lg text-gray-700 leading-relaxed text-center mb-8 max-w-2xl mx-auto">
              Besoin d'un RIB ou d'un lien de paiement ? Écris-nous, on te répond sous 24h.
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
                  <p className="text-[13px] font-semibold text-gray-600 uppercase tracking-wide mb-2">Téléphone Pro</p>
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

        {/* CTA */}
        <AnimatedSection delay={500}>
          <div className="bg-white rounded-lg border border-gray-200 p-8 lg:p-12 mt-16 text-center">
            <h2 className="text-[24px] sm:text-[30px] font-extrabold text-gray-900 uppercase mb-6">
              Prêt à Procéder au Paiement ?
            </h2>
            <p className="text-[16px] lg:text-lg text-gray-700 leading-relaxed mb-8 max-w-2xl mx-auto">
              Contactez-nous dès maintenant pour valider votre demande et recevoir les coordonnées de paiement adaptées.
            </p>
            <a
              href="mailto:daguekotr@gmail.com"
              className="inline-block bg-[#00bcd4] hover:bg-[#00acc1] transition-colors text-white font-bold px-8 py-3 rounded-lg text-[14px] sm:text-[16px]"
            >
              Contacter la Facturation
            </a>
          </div>
        </AnimatedSection>
      </Container>
    </section>
  );
}
