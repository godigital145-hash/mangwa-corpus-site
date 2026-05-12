import { useState, useCallback, useEffect } from "react";
import { api, mediaUrl, type Magazine } from "../lib/api";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

const MAX_PREVIEW_PAGES = 6;

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 16l-5-5 1.41-1.41L11 13.17V4h2v9.17l2.59-2.58L17 11l-5 5zm-7 4h14v-2H5v2z" />
  </svg>
);

const ChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
  </svg>
);

const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
  </svg>
);

const LockIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
  </svg>
);

type PdfComponents = {
  Document: React.ComponentType<any>;
  Page: React.ComponentType<any>;
};

function PdfViewer({ url, paymentUrl }: { url: string; paymentUrl: string }) {
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);
  const [pdfLib, setPdfLib] = useState<PdfComponents | null>(null);

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (node) setContainerWidth(node.getBoundingClientRect().width);
  }, []);

  useEffect(() => {
    import("react-pdf").then((mod) => {
      mod.pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
      setPdfLib({ Document: mod.Document, Page: mod.Page });
    });
    import("react-pdf/dist/Page/AnnotationLayer.css" as any);
    import("react-pdf/dist/Page/TextLayer.css" as any);
  }, []);

  const previewTotal = Math.min(numPages, MAX_PREVIEW_PAGES);
  const isLocked = numPages > MAX_PREVIEW_PAGES && currentPage >= MAX_PREVIEW_PAGES;

  if (!pdfLib) {
    return (
      <div className="w-full bg-gray-100 flex items-center justify-center gap-3 text-gray-400 py-24 rounded">
        <div className="w-5 h-5 border-2 border-gray-300 border-t-[#00bcd4] rounded-full animate-spin" />
        Chargement du document…
      </div>
    );
  }

  const { Document, Page } = pdfLib;

  return (
    <div className="flex flex-col gap-6">
      <div
        ref={containerRef}
        className="relative w-full bg-[#f0f0f0] flex items-center justify-center min-h-96 rounded overflow-hidden"
      >
        <Document
          file={url}
          onLoadSuccess={({ numPages }: { numPages: number }) => setNumPages(numPages)}
          loading={
            <div className="flex items-center gap-3 text-gray-400 py-20">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-[#00bcd4] rounded-full animate-spin" />
              Chargement…
            </div>
          }
        >
          <Page
            pageNumber={currentPage}
            width={containerWidth || undefined}
            renderTextLayer
            renderAnnotationLayer
          />
        </Document>

        {isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-white/90 backdrop-blur-sm">
            <div className="text-[#00bcd4]"><LockIcon /></div>
            <div className="text-center px-6">
              <p className="text-gray-900 font-bold text-[18px]">Aperçu terminé</p>
              <p className="text-gray-500 text-[14px] mt-1">
                Téléchargez la version complète pour accéder aux {numPages} pages.
              </p>
            </div>
            <a
              href={paymentUrl}
              className="bg-[#00bcd4] hover:bg-[#00acc1] transition-colors text-white font-bold px-8 py-3 text-[14px]"
            >
              Obtenir la version complète
            </a>
          </div>
        )}
      </div>

      {numPages > 0 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="flex items-center gap-1 px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-[14px]"
          >
            <ChevronLeft /> Précédent
          </button>
          <div className="text-center">
            <p className="text-gray-900 font-semibold text-[14px]">
              Page {currentPage} / {previewTotal}
            </p>
            {numPages > MAX_PREVIEW_PAGES && (
              <p className="text-gray-400 text-[11px] mt-0.5">
                Aperçu — {MAX_PREVIEW_PAGES} pages sur {numPages}
              </p>
            )}
          </div>
          <button
            onClick={() => setCurrentPage((p) => Math.min(previewTotal, p + 1))}
            disabled={currentPage >= previewTotal}
            className="flex items-center gap-1 px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-[14px]"
          >
            Suivant <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}

function NoPdfPlaceholder() {
  return (
    <div className="w-full bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-4 py-24 rounded">
      <div className="text-gray-300">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
        </svg>
      </div>
      <p className="text-gray-400 text-[14px]">Extrait PDF disponible prochainement</p>
    </div>
  );
}

export default function EbookDetailViewer({ id }: { id: string }) {
  const [mag, setMag] = useState<Magazine | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.magazine(id)
      .then((data) => {
        if (!data || (data as any).error) {
          setNotFound(true);
        } else {
          setMag(data);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col gap-8 py-8 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="bg-gray-100 aspect-3/4" />
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="h-4 bg-gray-100 rounded w-24" />
            <div className="h-10 bg-gray-100 rounded w-2/3" />
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-4/5" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !mag) {
    return (
      <div className="py-16 text-center text-gray-400">
        <p className="text-[18px] font-medium">Magazine introuvable</p>
        <a href="/ebook" className="text-[#00bcd4] text-[14px] mt-2 inline-block hover:underline">
          ← Retour aux E-Books
        </a>
      </div>
    );
  }

  const coverUrl = mediaUrl(mag.cover);
  const pdfPreviewUrl = mag.pdf_preview ? mediaUrl(mag.pdf_preview) : null;
  const pdfFileUrl = mag.pdf_file ? mediaUrl(mag.pdf_file) : null;
  const paymentUrl = `/paiement?type=magazine&id=${id}`;

  return (
    <div className="flex flex-col gap-12 py-8">

      {/* ── Info ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

        {/* Couverture */}
        <div className="lg:col-span-1 bg-gray-100 aspect-3/4 flex items-center justify-center px-8 py-10">
          {coverUrl
            ? <img src={coverUrl} alt={mag.title} className="w-full h-full object-contain" />
            : <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">Pas de couverture</div>
          }
        </div>

        {/* Détails */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          <span className="inline-block text-[11px] text-[#00bcd4] uppercase tracking-widest font-semibold">
            Magazine
            {mag.published_at ? ` · ${new Date(mag.published_at).getFullYear()}` : ""}
            {mag.pages ? ` · ${mag.pages} pages` : ""}
          </span>

          <div>
            <h1 className="text-[28px] sm:text-[36px] font-extrabold text-gray-900 uppercase leading-tight">
              {mag.title}
            </h1>
            {mag.subtitle && (
              <p className="text-gray-500 text-[16px] mt-1">{mag.subtitle}</p>
            )}
          </div>

          {mag.description && (
            <p className="text-[15px] text-gray-500 leading-relaxed">{mag.description}</p>
          )}

          {/* Méta */}
          <ul className="flex flex-col gap-1.5 text-[14px] text-gray-600">
            {mag.category && <li><span className="font-semibold">Catégorie :</span> {mag.category}</li>}
            {mag.issue_number && <li><span className="font-semibold">Numéro :</span> #{mag.issue_number}</li>}
            {mag.published_at && <li><span className="font-semibold">Date :</span> {new Date(mag.published_at).toLocaleDateString("fr-FR")}</li>}
            {mag.price != null && <li><span className="font-semibold">Prix :</span> {mag.price.toLocaleString("fr-FR")} XAF</li>}
          </ul>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {pdfPreviewUrl && (
              <a
                href="#extrait"
                className="flex items-center justify-center bg-[#00bcd4] hover:bg-[#00acc1] transition-colors text-white text-[14px] font-bold px-6 py-3"
              >
                Lire l'extrait
              </a>
            )}
            {(pdfFileUrl || mag.price != null) && (
              <a
                href={mag.price ? paymentUrl : pdfFileUrl ?? "#"}
                {...(mag.price ? {} : { download: true })}
                className="flex items-center gap-2 bg-[#00c853] hover:bg-[#00b548] transition-colors text-white text-[12px] sm:text-[13px] font-bold"
              >
                <span className="px-4 inter sm:px-5 py-2.5">{mag.price ? "Acheter" : "Télécharger"}</span>
                <span className="px-4 inter sm:px-5 py-2.5 bg-black/20">{mag.price != null ? `${mag.price.toLocaleString("fr-FR")} XAF` : "Gratuit"}</span>
              </a>
            )}
            <span>
              Paiement sécurisé
            </span>
          </div>
        </div>
      </div>

      {/* ── PDF Preview ── */}
      <div id="extrait">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-[20px] font-bold text-gray-900">Lire un extrait</h2>
          <span className="text-[12px] text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
            {MAX_PREVIEW_PAGES} premières pages
          </span>
        </div>
        {pdfPreviewUrl
          ? <PdfViewer url={pdfPreviewUrl} paymentUrl={paymentUrl} />
          : <NoPdfPlaceholder />
        }
      </div>
    </div>
  );
}
