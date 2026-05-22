import { useState, useEffect } from "react";
import Container from "./Container";
import { api, mediaUrl, type Magazine } from "../lib/api";

type Props = {
  activeTab?: 'ebook' | 'magazine';
  onTabChange?: (tab: 'ebook' | 'magazine') => void;
};

export default function EbooksAndMagazines({ activeTab: controlledTab, onTabChange }: Props = {}) {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ebook' | 'magazine'>(controlledTab || 'magazine');

  useEffect(() => {
    api.magazines().then(setMagazines).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = magazines.filter((mag) => {
    if (activeTab === 'ebook') return mag.type === 'ebook' || !mag.type;
    return mag.type === 'magazine';
  });

  if (loading) {
    return (
      <section className="w-full mt-10">
        <Container>
          <div className="flex flex-col gap-6">
            {[1, 2].map((i) => <div key={i} className="h-[341px] bg-gray-100 animate-pulse" />)}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="w-full mt-10">
      <Container>
        {/* Onglets */}
        <div className="flex gap-4 border-b border-gray-200 mb-8">
          <button
            onClick={() => {
              setActiveTab('ebook');
              onTabChange?.('ebook');
            }}
            className={`pb-3 font-bold text-lg transition-colors ${
              activeTab === 'ebook'
                ? 'text-[#00bcd4] border-b-2 border-[#00bcd4]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            E-Books
          </button>
          <button
            onClick={() => {
              setActiveTab('magazine');
              onTabChange?.('magazine');
            }}
            className={`pb-3 font-bold text-lg transition-colors ${
              activeTab === 'magazine'
                ? 'text-[#00bcd4] border-b-2 border-[#00bcd4]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Magazines
          </button>
        </div>

        {/* Contenu */}
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            Aucun {activeTab === 'ebook' ? 'e-book' : 'magazine'} disponible
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-gray-200">
            {filtered.slice(0, 3).map((mag) => (
              <div
                key={mag.id}
                className="grid grid-cols-1 sm:grid-cols-4 sm:gap-6 py-6 items-start"
              >
                {/* Couverture */}
                <div className="shrink-0 w-full aspect-3/4 flex justify-center items-center bg-gray-100">
                  {mediaUrl(mag.cover) ? (
                    <img src={mediaUrl(mag.cover)!} alt={mag.title} className="w-[85%] h-full object-contain" />
                  ) : (
                    <div className="w-[55%] h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">Pas de couverture</div>
                  )}
                </div>

                <div className="col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6 p-4 sm:p-6 bg-gray-100 h-full">
                  {/* Titre */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[16px] inter text-gray-400 uppercase tracking-widest font-medium mb-1">
                      {activeTab === 'ebook' ? 'E-Book' : 'Magazine'}
                    </p>
                    <h3 className="font-extrabold text-[18px] inter sm:text-[24px] text-gray-900 uppercase leading-tight mb-4">
                      {mag.title}
                    </h3>
                    {mag.subtitle && <p className="text-[14px] sm:text-[20px] text-gray-600 mt-0.5">{mag.subtitle}</p>}
                    {mag.description && <p className="text-[14px] sm:text-[20px] text-gray-500 mt-2 line-clamp-4">{mag.description}</p>}
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] sm:text-[15px] text-gray-400 uppercase tracking-widest font-medium mb-2">
                      Détails
                    </p>
                    <ul className="flex flex-col gap-2.5 text-[16px] text-gray-700">
                      {mag.category && <li><span className="font-bold">Catégorie :</span> {mag.category}</li>}
                      {mag.issue_number && <li><span className="font-bold">Numéro :</span> #{String(mag.issue_number).padStart(3, '0')}</li>}
                      {mag.pages && <li><span className="font-bold">Pages :</span> {mag.pages}</li>}
                      {mag.published_at && <li><span className="font-bold">Date :</span> {new Date(mag.published_at).toLocaleDateString('fr-FR')}</li>}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0 flex flex-col gap-2 w-full sm:w-auto justify-end">
                    {mag.pdf_preview && (
                      <a
                        href={`/ebook/${mag.id}`}
                        className="flex items-center justify-center gap-2 bg-[#00bcd4] hover:bg-[#00acc1] transition-colors text-white text-[16px] font-bold px-4 py-2.5 whitespace-nowrap"
                      >
                        Lire l'aperçu
                      </a>
                    )}
                    {mag.price && (
                      <a
                        href={`/paiement?type=magazine&id=${mag.id}`}
                        className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 transition-colors text-white text-[16px] font-bold px-4 py-2.5 whitespace-nowrap"
                      >
                        Acheter ({mag.price.toLocaleString('fr-FR')} FCFA)
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
