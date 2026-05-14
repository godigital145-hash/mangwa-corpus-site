import Container from "./Container";
import Raymond from "../assets/raymond.jpeg";

const images = {
  hero: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&q=80",
  mission: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=80",
  gallery1: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80",
  gallery2: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
  gallery3: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80",
  histoire: "https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&w=900&q=80",
};

function Main({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full max-w-5xl mx-auto py-10 px-6 sm:px-0 flex flex-col gap-16">{children}</main>
  )
}

export default function QuiSommesNous() {
  return (
    <main className="w-ful flex flex-col gap-16">
      <div className="bg-gray-100 py-6 lg:py-24">
        <Main>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div className="w-full aspect-square overflow-hidden">
              <img
                src={Raymond.src}
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
                  Une succursale dont le champ d'action est subdivisé en deux principales catégories :
                  <ul className="list-disc pl-5">
                    <li>Activités récréatives et de loisirs R930200 (événementiel).</li>
                    <li>Services personnels n.c.a - S960004 (productions).</li>
                    <li>N° : RCCM CM-DLA. -01-2025-A10-01934</li>
                    <li>NIU : P018217230860M</li>
                  </ul>

                </p>
                <p className="text-[16px] lg:text-xl text-gray-600 leading-relaxed mt-4">
                  <span className="font-bold">Adresse :</span> Douala, Cameroun <br />
                  <span className="font-bold">E-mail:</span> daguekotr@gmail.com | rtdagueko@yahoo.fr <br /><br />
                  <span className="font-bold">CONTACT :</span> <br />
                  <span className="font-bold">+237 698 944 443
                  </span> (Professionnel)<br />
                  <span className="font-bold">+237 672 666 503
                  </span> (personnel)<br />
                  <span className="font-bold">+237 620 114 886
                  </span> (Privé)<br />
                </p>
              </div>
            </div>
          </div>
        </Main>
      </div>
      <Main>
        {/* ── Titre ── */}
        <h1 className="inter text-[36px] sm:text-[52px] font-bold text-gray-900 uppercase mb-8 text-center">
          Qui sommes nous ?
        </h1>

        {/* ── Hero image ── */}
        <div className="w-full aspect-16/7 overflow-hidden">
          <img
            src={images.hero}
            alt="Mangwa Corpus"
            className="w-full h-full object-cover"
          />
        </div>
        {/* ── Citation centrale ── */}
        <div className="max-w-2xl mx-auto text-center py-14">
          <p className="text-[24px] sm:text-[40px] text-gray-700 leading-relaxed karma italic">
            Mangwa Corpus est un espace de création, de mémoire et de partage,
            dédié à valoriser la richesse culturelle et intellectuelle de l'Afrique.
          </p>
        </div>
        {/* ── Texte gauche / Image droite ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="flex flex-col gap-5">
            <h2 className="text-[24px] sm:text-[30px] font-extrabold text-gray-900 uppercase leading-tight">
              Notre mission
            </h2>
            <div className="karma">
              <p className="text-[16px] lg:text-xl text-gray-600 leading-relaxed">
                Notre mission est de documenter, diffuser et célébrer les récits
                africains qui méritent d'être entendus. À travers nos magazines,
                nos livres et notre catalogue musical, nous construisons un pont
                entre les générations, entre les artistes et leur public, entre
                l'Afrique et le monde.
              </p>
              <p className="text-[16px] lg:text-xl text-gray-600 leading-relaxed">
                Chaque édition, chaque piste audio, chaque page publiée est le
                fruit d'un travail rigoureux mené par des passionnés convaincus
                que la culture africaine est une force universelle qui mérite
                d'être célébrée et transmise aux générations futures.
              </p>
              <p className="text-[16px] lg:text-xl text-gray-600 leading-relaxed">
                Fondé avec la conviction que l'Afrique a ses propres récits à
                raconter, Mangwa Corpus s'est imposé comme une référence
                éditoriale et musicale, présente dans plus d'une dizaine de pays
                à travers le continent et la diaspora.
              </p>
            </div>
          </div>
          <div className="w-full aspect-square overflow-hidden">
            <img
              src={images.mission}
              alt="Notre équipe"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Main>


      {/* ── Texte gauche / Image droite ── */}



      {/* ── Galerie 3 images ── */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="w-full aspect-square overflow-hidden">
          <img
            src={images.gallery1}
            alt="Édition & Presse"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full aspect-square overflow-hidden">
          <img
            src={images.gallery2}
            alt="Musique & Audio"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full aspect-square overflow-hidden">
          <img
            src={images.gallery3}
            alt="Librairie & Savoir"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full aspect-square overflow-hidden">
          <img
            src={images.gallery3}
            alt="Librairie & Savoir"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* ── Image gauche / Texte droite ── */}
      <Main>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="w-full aspect-square overflow-hidden">
            <img
              src={images.histoire}
              alt="Notre histoire"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-5">
            <h2 className="text-[24px] sm:text-[30px] font-extrabold text-gray-900 uppercase leading-tight">
              Notre histoire
            </h2>
            <div className="karma">
              <p className="text-[16px] lg:text-xl text-gray-600 leading-relaxed">
                De nos éditions spéciales consacrées aux icônes du continent aux
                compilations audio de nos artistes, chaque production est pensée
                avec passion et rigueur pour toucher le plus grand nombre.
              </p>
              <p className="text-[16px] lg:text-xl text-gray-600 leading-relaxed">
                Nous croyons que la mémoire collective se construit jour après
                jour, à travers les mots que l'on choisit, les images que l'on
                garde et les sons que l'on transmet aux générations futures.
                Mangwa Corpus en est le gardien fidèle.
              </p>
            </div>
          </div>
        </div>
      </Main>

    </main >
  );
}
