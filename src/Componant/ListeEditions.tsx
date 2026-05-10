import { useState, useEffect } from "react";
import Container from "./Container";
import { api, mediaUrl, type Magazine } from "../lib/api";

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 16l-5-5 1.41-1.41L11 13.17V4h2v9.17l2.59-2.58L17 11l-5 5zm-7 4h14v-2H5v2z" />
  </svg>
);

export default function ListeEditions() {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.magazines().then(setMagazines).catch(console.error).finally(() => setLoading(false));
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

  return (
    <section className="w-full mt-10">
      <Container>
        <div className="flex flex-col divide-y divide-gray-200">
          {magazines.slice(0, 5).map((mag) => (
            <div
              key={mag.id}
              className="grid grid-cols-1 sm:grid-cols-4 sm:gap-6 py-6 items-start"
            >
              {/* Couverture */}
              <div className="shrink-0 w-full sm:w-full h-[341px] flex justify-center items-center bg-gray-100">
                {mediaUrl(mag.cover) ? (
                  <img src={mediaUrl(mag.cover)!} alt={mag.title} className="w-[55%] object-contain" />
                ) : (
                  <div className="w-[55%] h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">Pas de couverture</div>
                )}
              </div>

              <div className="col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6 p-4 sm:p-6 bg-gray-100 h-full">
                {/* La UNE */}
                <div className="flex-1 min-w-0 karma">
                  <p className="text-[16px] inter text-gray-400 uppercase tracking-widest font-medium mb-1">
                    La UNE
                  </p>
                  <h3 className="font-extrabold text-[18px] inter sm:text-[24px] text-gray-900 uppercase leading-tight mb-4">
                    {mag.title}
                  </h3>
                  {mag.subtitle && <p className="text-[20px] text-gray-600 mt-0.5">{mag.subtitle}</p>}
                  {mag.description && <p className="text-[20px] text-gray-500 mt-2 line-clamp-4">{mag.description}</p>}
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <p className="text-[20px] text-gray-400 uppercase tracking-widest font-medium mb-2">
                    Détails
                  </p>
                  <ul className="flex flex-col gap-2.5 text-[16px] text-gray-700">
                    {mag.category && <li><span className="font-bold">Catégorie :</span> {mag.category}</li>}
                    {mag.issue_number && <li><span className="font-bold">Numéro :</span> #{mag.issue_number}</li>}
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
                      Lire les quelques pages
                    </a>
                  )}
                  {mag.pdf_file && (
                    <a
                      href={mediaUrl(mag.pdf_file) ?? '#'}
                      target="_blank"
                      className="flex items-center justify-center gap-2 bg-[#6dbe6d] hover:bg-[#5cb85c] transition-colors text-white text-[16px] font-bold px-4 py-2.5 whitespace-nowrap"
                    >
                      Télécharger <DownloadIcon />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
