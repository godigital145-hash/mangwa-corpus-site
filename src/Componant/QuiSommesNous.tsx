import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import Container from "./Container";


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

function Main({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full max-w-5xl mx-auto py-10 px-6 sm:px-0 flex flex-col gap-16">{children}</main>
  )
}

export default function QuiSommesNous({ images }: { images: typeof images }) {
  return (
    <main className="w-ful flex flex-col gap-16">
      <div className="bg-gray-100 py-6 lg:py-24">
        <Main>
          <AnimatedSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div className="w-full aspect-square overflow-hidden">
              <img
                src={images.src}
                alt="Notre histoire"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col gap-5">
              <h2 className="text-[24px] sm:text-[30px] font-extrabold text-gray-900 uppercase leading-tight">
                Mangwa Corpus
              </h2>
              <div className="karma">
                <p className="text-[16px] lg:text-xl text-gray-600 leading-relaxed">
                  Mangwa Corpus est une entreprise de productions  artistique,  culturel et événementiel basée à Douala au Cameroun. Il a pour Président Directeur Général (CEO)  <b>TCHINDA DAGUEKO Raymond</b>.
                  <br />
                  <br />
                  Mangwa Corpus est déclaré comme une activité professionnelle au Cameroun :
                  <table>
                    <tbody>
                      <tr>
                        <td className="font-bold">Dénomination :</td>
                        <td>Mangwa Corpus</td>
                      </tr>
                      <tr>
                        <td className="font-bold" style={{ lineHeight: 1 }}>Activité principale </td>
                        <td><b>R930200 :</b> Activités récréatives et de loisirs / Événementiel</td>
                      </tr>
                      <tr>
                        <td className="font-bold" style={{ lineHeight: 1 }}>Activité secondaire </td>
                        <td><b>S960004 :</b>  Services personnels n.c.a / Productions artistiques</td>
                      </tr>
                      <tr>
                        <td className="font-bold" style={{ lineHeight: 1 }}>RCCM</td>
                        <td>CM-DLA-01-2025-A10-01934</td>
                      </tr>
                      <tr>
                        <td className="font-bold" style={{ lineHeight: 1 }}>NIU</td>
                        <td>P018217230860M</td>
                      </tr>
                      <tr>
                        <td className="font-bold" style={{ lineHeight: 1 }}>N° de déclaration</td>
                        <td>9846216005</td>
                      </tr>
                      <tr>
                        <td className="font-bold" style={{ lineHeight: 1 }}>Siège</td>
                        <td>Douala, Cameroun</td>
                      </tr>
                    </tbody>
                  </table>

                </p>
                <p className="text-[16px] lg:text-xl text-gray-600 leading-relaxed mt-4">
                  Ça confirme que Mangwa Corpus est une entité enregistrée qui produit des contenus, organise des événements et gère des services artistiques.
                </p>
              </div>
            </div>
            </div>
          </AnimatedSection>
        </Main>
      </div>


      {/* ── Texte gauche / Image droite ── */}



      {/* ── Galerie 3 images ── */}

    </main >
  );
}
