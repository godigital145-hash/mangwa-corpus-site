import { useEffect, useState } from "react";

const API_URL = import.meta.env.PUBLIC_API_URL ?? "https://serveur.mangwacorpus.com";

type Status = "loading" | "paid" | "pending" | "failed" | "notfound";

export default function PaiementSuccess() {
  const [status, setStatus] = useState<Status>("loading");
  const [reference, setReference] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("payment_ref") ?? params.get("reference");
    if (!ref) { setStatus("notfound"); return; }
    setReference(ref);

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 10;

    async function poll() {
      if (cancelled) return;
      attempts++;
      try {
        const res = await fetch(`${API_URL}/api/monetbil/status/${encodeURIComponent(ref!)}`);
        if (!res.ok) {
          if (attempts >= maxAttempts) setStatus("notfound");
          else setTimeout(poll, 2000);
          return;
        }
        const data = await res.json() as { status: string };
        if (data.status === "paid") setStatus("paid");
        else if (data.status === "failed") setStatus("failed");
        else if (attempts >= maxAttempts) setStatus("pending");
        else setTimeout(poll, 2000);
      } catch {
        if (attempts >= maxAttempts) setStatus("notfound");
        else setTimeout(poll, 2000);
      }
    }

    poll();
    return () => { cancelled = true; };
  }, []);

  if (status === "loading") {
    return (
      <div className="max-w-md mx-auto py-20 text-center flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-[#00bcd4] rounded-full animate-spin" />
        <p className="text-gray-500 text-[14px]">Vérification du paiement…</p>
      </div>
    );
  }

  if (status === "paid") {
    return (
      <div className="max-w-md mx-auto py-16 text-center flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <h2 className="text-[22px] font-extrabold text-gray-900">Paiement confirmé !</h2>
          <p className="text-gray-500 text-[14px] mt-2">
            Référence : <strong className="text-gray-900">{reference}</strong>
          </p>
          <p className="text-gray-400 text-[13px] mt-3">
            Vous recevrez un e-mail avec les détails d'accès.
          </p>
        </div>
        <a href="/" className="text-[#00bcd4] text-[14px] hover:underline">← Retour à l'accueil</a>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="max-w-md mx-auto py-16 text-center flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
          </svg>
        </div>
        <div>
          <h2 className="text-[22px] font-extrabold text-gray-900">Paiement en cours</h2>
          <p className="text-gray-500 text-[14px] mt-2">
            Référence : <strong className="text-gray-900">{reference}</strong>
          </p>
          <p className="text-gray-400 text-[13px] mt-3">
            La confirmation peut prendre quelques minutes. Vous recevrez un e-mail dès validation.
          </p>
        </div>
        <a href="/" className="text-[#00bcd4] text-[14px] hover:underline">← Retour à l'accueil</a>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-16 text-center flex flex-col items-center gap-6">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>
      <div>
        <h2 className="text-[22px] font-extrabold text-gray-900">Paiement non confirmé</h2>
        {reference && (
          <p className="text-gray-500 text-[14px] mt-2">
            Référence : <strong className="text-gray-900">{reference}</strong>
          </p>
        )}
        <p className="text-gray-400 text-[13px] mt-3">
          Le paiement n'a pas pu être validé. Réessayez ou contactez le support.
        </p>
      </div>
      <a href="/" className="text-[#00bcd4] text-[14px] hover:underline">← Retour à l'accueil</a>
    </div>
  );
}
