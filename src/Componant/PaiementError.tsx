import { useEffect, useState } from "react";

export default function PaiementError() {
  const [reason, setReason] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setReason(params.get("reason"));
  }, []);

  return (
    <div className="max-w-md mx-auto py-16 text-center flex flex-col items-center gap-6">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>
      <div>
        <h2 className="text-[22px] font-extrabold text-gray-900">Paiement impossible</h2>
        <p className="text-gray-500 text-[14px] mt-2">
          Nous n'avons pas pu initier votre paiement.
        </p>
        {reason && (
          <p className="text-gray-400 text-[13px] mt-3 italic">
            Détail : {reason}
          </p>
        )}
        <p className="text-gray-400 text-[13px] mt-3">
          Vérifiez votre connexion ou réessayez dans quelques instants. Si le problème persiste, contactez le support.
        </p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={() => window.history.back()}
          className="text-[#00bcd4] text-[14px] hover:underline"
        >
          ← Revenir au paiement
        </button>
        <a href="/" className="text-gray-400 text-[13px] hover:underline">
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
}
