import { useState, useEffect } from "react";
import Container from "./Container";
import { api, mediaUrl, type Magazine, type Ebook } from "../lib/api";

type Props = {
  activeTab?: 'ebook' | 'magazine';
  onTabChange?: (tab: 'ebook' | 'magazine') => void;
};

export default function EbooksAndMagazines({ activeTab: controlledTab, onTabChange }: Props = {}) {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ebook' | 'magazine'>(controlledTab || 'magazine');

  useEffect(() => {
    Promise.all([api.magazines(), api.ebooks()])
      .then(([m, e]) => { setMagazines(m); setEbooks(e); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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

  const isEbookTab = activeTab === 'ebook';
  const items: Array<{
    id: number;
    title: string;
    subtitle?: string | null;
    cover: string | null;
    description: string | null;
    category?: string | null;
    issue_number?: number | null;
    pages: number | null;
    published_at: string | null;
    pdf_preview: string | null;
    price: number | null;
  }> = isEbookTab
    ? ebooks.map((e) => ({
        id: e.id, title: e.title, cover: e.cover, description: e.description,
        pages: e.pages, published_at: e.published_at, pdf_preview: e.pdf_preview, price: e.price,
      }))
    : magazines.map((m) => ({
        id: m.id, title: m.title, subtitle: m.subtitle, cover: m.cover, description: m.description,
        category: m.category, issue_number: m.issue_number, pages: m.pages,
        published_at: m.published_at, pdf_preview: m.pdf_preview, price: m.price,
      }));

  const detailHref = (id: number) => isEbookTab ? `/ebook/${id}` : `/magazine/${id}`;
  const paymentType = isEbookTab ? 'ebook' : 'magazine';

  return (
    <section className="w-full mt-10">
      <Container>
        <div className="flex gap-4 border-b border-gray-200 mb-8">
          <button
            onClick={() => { setActiveTab('ebook'); onTabChange?.('ebook'); }}
            className={`pb-3 font-bold text-lg transition-colors ${
              isEbookTab ? 'text-[#00bcd4] border-b-2 border-[#00bcd4]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            E-Books
          </button>
          <button
            onClick={() => { setActiveTab('magazine'); onTabChange?.('magazine'); }}
            className={`pb-3 font-bold text-lg transition-colors ${
              !isEbookTab ? 'text-[#00bcd4] border-b-2 border-[#00bcd4]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Magazines
          </button>
        </div>

        {items.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            Aucun {isEbookTab ? 'e-book' : 'magazine'} disponible
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-gray-200">
            {items.slice(0, 3).map((it) => (
              <div key={it.id} className="grid grid-cols-1 sm:grid-cols-4 sm:gap-6 py-6 items-start">
                <div className="shrink-0 w-full aspect-3/4 flex justify-center items-center bg-gray-100">
                  {mediaUrl(it.cover) ? (
                    <img src={mediaUrl(it.cover)!} alt={it.title} className="w-[85%] h-full object-contain" />
                  ) : (
                    <div className="w-[55%] h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">Pas de couverture</div>
                  )}
                </div>

                <div className="col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6 p-4 sm:p-6 bg-gray-100 h-full">
                  <div className="flex-1 min-w-0">
                    <p className="text-[16px] inter text-gray-400 uppercase tracking-widest font-medium mb-1">
                      {isEbookTab ? 'E-Book' : 'Magazine'}
                    </p>
                    <h3 className="font-extrabold text-[18px] inter sm:text-[24px] text-gray-900 uppercase leading-tight mb-4">
                      {it.title}
                    </h3>
                    {it.subtitle && <p className="text-[14px] sm:text-[20px] text-gray-600 mt-0.5">{it.subtitle}</p>}
                    {it.description && <p className="text-[14px] sm:text-[20px] text-gray-500 mt-2 line-clamp-4">{it.description}</p>}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] sm:text-[15px] text-gray-400 uppercase tracking-widest font-medium mb-2">
                      Détails
                    </p>
                    <ul className="flex flex-col gap-2.5 text-[16px] text-gray-700">
                      {it.category && <li><span className="font-bold">Catégorie :</span> {it.category}</li>}
                      {it.issue_number && <li><span className="font-bold">Numéro :</span> #{String(it.issue_number).padStart(3, '0')}</li>}
                      {it.pages && <li><span className="font-bold">Pages :</span> {it.pages}</li>}
                      {it.published_at && <li><span className="font-bold">Date :</span> {new Date(it.published_at).toLocaleDateString('fr-FR')}</li>}
                    </ul>
                  </div>

                  <div className="shrink-0 flex flex-col gap-2 w-full sm:w-auto justify-end">
                    {it.pdf_preview && (
                      <a
                        href={detailHref(it.id)}
                        className="flex items-center justify-center gap-2 bg-[#00bcd4] hover:bg-[#00acc1] transition-colors text-white text-[16px] font-bold px-4 py-2.5 whitespace-nowrap"
                      >
                        Lire l'aperçu
                      </a>
                    )}
                    {it.price && (
                      <a
                        href={`/paiement?type=${paymentType}&id=${it.id}`}
                        className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 transition-colors text-white text-[16px] font-bold px-4 py-2.5 whitespace-nowrap"
                      >
                        Acheter ({it.price.toLocaleString('fr-FR')} FCFA)
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
