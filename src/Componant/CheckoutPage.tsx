import { useState, useEffect, useRef } from "react";
import { api, mediaUrl, type Magazine, type Ebook, type Audio, type Album } from "../lib/api";

const API_URL = import.meta.env.PUBLIC_API_URL ?? "https://serveur.mangwacorpus.com";

type PaymentMethod = { id: string; name: string; type: string };
type EntityType = "magazine" | "ebook" | "audio" | "album";
type Item = { id: string | number; title: string; cover: string | null; price: number | null; subtitle?: string | null };
type PaypalConfig = { client_id: string | null; env: string; currency: string; xaf_to_eur: number };

declare global {
  interface Window { paypal?: any }
}

function loadPaypalSdk(clientId: string, currency: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.paypal) return resolve();
    const existing = document.querySelector<HTMLScriptElement>('script[data-paypal-sdk]');
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('PayPal SDK load error')), { once: true });
      return;
    }
    const s = document.createElement('script');
    s.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=${currency}&intent=capture`;
    s.async = true;
    s.dataset.paypalSdk = '1';
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('PayPal SDK load error'));
    document.head.appendChild(s);
  });
}

function formatPrice(price: number | null) {
  if (price == null || price === 0) return "Gratuit";
  return `${price.toLocaleString("fr-FR")} XAF`;
}

export default function CheckoutPage({ type, id }: { type: EntityType; id: string }) {
  const [item, setItem] = useState<Item | null>(null);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [methodId, setMethodId] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState<{ reference: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paypalConfig, setPaypalConfig] = useState<PaypalConfig | null>(null);
  const [paypalReady, setPaypalReady] = useState(false);
  const paypalContainerRef = useRef<HTMLDivElement | null>(null);
  const paypalButtonsRef = useRef<any>(null);

  useEffect(() => {
    const fetchItem =
      type === "magazine"
        ? api.magazine(id).then((m: Magazine) => ({
            id: m.id,
            title: m.title,
            cover: m.cover,
            price: m.price,
            subtitle: m.subtitle,
          }))
        : type === "ebook"
          ? api.ebook(id).then((e: Ebook) => ({
              id: e.id,
              title: e.title,
              cover: e.cover,
              price: e.price,
              subtitle: null,
            }))
        : type === "album"
          ? api.album(id).then((a: Album & { tracks: any[] }) => ({
              id: a.id,
              title: a.title,
              cover: a.cover,
              price: a.price,
              subtitle: a.artist,
            }))
          : api.audio(id).then((a: Audio) => ({
              id: a.id,
              title: a.title,
              cover: a.cover,
              price: a.price,
              subtitle: a.artist,
            }));

    fetch(`${API_URL}/api/paypal/config`)
      .then((r) => r.json())
      .then((cfg: PaypalConfig) => setPaypalConfig(cfg))
      .catch(() => setPaypalConfig(null));

    Promise.all([
      fetchItem,
      fetch(`${API_URL}/api/payments/methods`).then((r) => r.json()),
    ])
      .then(([itemData, methodsData]) => {
        if (!itemData || (itemData as any).error) { setNotFound(true); return; }
        setItem(itemData as Item);
        setMethods(methodsData as PaymentMethod[]);
        if ((methodsData as PaymentMethod[]).length > 0) {
          setMethodId((methodsData as PaymentMethod[])[0].id);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [type, id]);

  const selectedMethod = methods.find((m) => m.id === methodId) ?? null;
  const isPaypalSelected = selectedMethod?.type === "paypal";
  const isMonetbilSelected = selectedMethod?.type === "monetbil";

  async function handleMonetbil() {
    if (!item) return;
    if (!name || !email) {
      setError("Renseignez votre nom et e-mail avant de payer.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/monetbil/create-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity_type: type,
          entity_id: String(item.id),
          amount: item.price ?? 0,
          name,
          email,
          phone: phone || undefined,
        }),
      });
      const body = await res.json() as any;
      if (!res.ok || !body.payment_url) {
        const reason = body?.error ?? "Impossible d'initier le paiement Monetbil.";
        window.location.href = `/paiement/error?reason=${encodeURIComponent(reason)}`;
        return;
      }
      window.location.href = body.payment_url;
    } catch {
      window.location.href = `/paiement/error?reason=${encodeURIComponent("Erreur réseau — veuillez réessayer.")}`;
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (!isPaypalSelected || !paypalConfig?.client_id || !item) return;
    let cancelled = false;

    loadPaypalSdk(paypalConfig.client_id, paypalConfig.currency)
      .then(() => {
        if (cancelled || !window.paypal || !paypalContainerRef.current) return;
        if (paypalButtonsRef.current) {
          try { paypalButtonsRef.current.close(); } catch {}
        }
        paypalContainerRef.current.innerHTML = "";

        const buttons = window.paypal.Buttons({
          style: { layout: "vertical", color: "blue", shape: "rect", label: "paypal" },
          onClick: (_data: any, actions: any) => {
            if (!name || !email) {
              setError("Renseignez votre nom et e-mail avant de payer.");
              return actions.reject();
            }
            setError(null);
            return actions.resolve();
          },
          createOrder: async () => {
            const res = await fetch(`${API_URL}/api/paypal/create-order`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                entity_type: type,
                entity_id: String(item.id),
                amount: item.price ?? 0,
                name,
                email,
                phone: phone || undefined,
              }),
            });
            const body = await res.json() as any;
            if (!res.ok || !body.order_id) {
              setError(body?.error ?? "Erreur lors de la création de la commande PayPal.");
              throw new Error(body?.error ?? "create-order failed");
            }
            return body.order_id;
          },
          onApprove: async (data: any) => {
            setSaving(true);
            try {
              const res = await fetch(`${API_URL}/api/paypal/capture-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order_id: data.orderID }),
              });
              const body = await res.json() as any;
              if (!res.ok || body.status !== "paid") {
                setError(body?.error ?? "Erreur lors de la capture du paiement.");
                return;
              }
              setDone({ reference: body.reference });
            } catch {
              setError("Erreur réseau pendant la capture du paiement.");
            } finally {
              setSaving(false);
            }
          },
          onError: (err: any) => {
            console.error("[PayPal]", err);
            setError("Erreur PayPal — veuillez réessayer.");
          },
        });

        buttons.render(paypalContainerRef.current);
        paypalButtonsRef.current = buttons;
        setPaypalReady(true);
      })
      .catch((err) => {
        console.error("[PayPal SDK]", err);
        setError("Impossible de charger PayPal.");
      });

    return () => {
      cancelled = true;
      if (paypalButtonsRef.current) {
        try { paypalButtonsRef.current.close(); } catch {}
        paypalButtonsRef.current = null;
      }
    };
  }, [isPaypalSelected, paypalConfig, item, name, email, phone, type]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!item) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity_type: type,
          entity_id: String(item.id),
          amount: item.price ?? 0,
          name,
          email,
          phone: phone || undefined,
          payment_method_id: methodId || undefined,
        }),
      });
      const body = await res.json() as any;
      if (!res.ok) { setError(body?.error ?? `Erreur ${res.status}`); return; }
      setDone({ reference: body.reference });
    } catch {
      setError("Erreur réseau — veuillez réessayer.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-[#00bcd4] rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !item) {
    return (
      <div className="py-16 text-center text-gray-400">
        <p className="text-[18px] font-medium">Contenu introuvable</p>
        <a href="/" className="text-[#00bcd4] text-[14px] mt-2 inline-block hover:underline">
          ← Retour à l'accueil
        </a>
      </div>
    );
  }

  const coverUrl = mediaUrl(item.cover);

  if (done) {
    return (
      <div className="max-w-md mx-auto py-16 text-center flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <h2 className="text-[22px] font-extrabold text-gray-900">Demande envoyée !</h2>
          <p className="text-gray-500 text-[14px] mt-2">
            Votre référence de paiement est <strong className="text-gray-900">{done.reference}</strong>.
          </p>
          <p className="text-gray-400 text-[13px] mt-3">
            Notre équipe va vérifier votre paiement et vous contacter à l'adresse <strong>{email}</strong>.
          </p>
        </div>
        <a
          href={(type === "magazine" || type === "ebook") ? "/ebook" : "/audio"}
          className="text-[#00bcd4] text-[14px] hover:underline"
        >
          ← Continuer à parcourir
        </a>
        {type === "album" && (
          <a href={`/album/${id}`} className="text-gray-400 text-[13px] hover:underline">
            ← Retour à l'album
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 flex flex-col gap-8">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[13px] text-gray-400">
        <a href={(type === "magazine" || type === "ebook") ? "/ebook" : "/audio"} className="hover:text-gray-700 transition-colors">
          {type === "magazine" ? "Magazines" : type === "ebook" ? "E-Books" : type === "album" ? "Albums" : "Audios"}
        </a>
        <span>/</span>
        <span className="text-gray-700 font-medium">{item.title}</span>
        <span>/</span>
        <span className="text-gray-700 font-medium">Paiement</span>
      </nav>

      <h1 className="text-[26px] font-extrabold text-gray-900">Finaliser l'achat</h1>

      {/* Résumé */}
      <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
        {coverUrl
          ? <img src={coverUrl} alt={item.title} className="w-16 h-16 object-cover rounded-lg shrink-0" />
          : <div className="w-16 h-16 bg-gray-200 rounded-lg shrink-0" />
        }
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-[#00bcd4] uppercase tracking-widest font-semibold mb-0.5">
            {type === "magazine" ? "Magazine" : type === "ebook" ? "E-Book" : type === "album" ? "Album" : "Audio"}
          </p>
          <p className="text-[15px] font-bold text-gray-900 truncate">{item.title}</p>
          {item.subtitle && <p className="text-[13px] text-gray-500 truncate">{item.subtitle}</p>}
        </div>
        <div className="text-right shrink-0">
          <p className="text-[18px] font-extrabold text-gray-900">{formatPrice(item.price)}</p>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-4 py-3">{error}</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-gray-700">Nom complet *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jean Dupont"
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#00bcd4]"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-gray-700">Adresse e-mail *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jean@exemple.com"
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#00bcd4]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-gray-700">Numéro de téléphone (Mobile Money)</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+237 6XX XXX XXX"
            className="border border-gray-200 rounded-lg px-4 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#00bcd4]"
          />
        </div>

        {methods.length > 0 && (
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-semibold text-gray-700">Moyen de paiement *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {methods.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethodId(m.id)}
                  className={`border rounded-lg px-4 py-3 text-[13px] font-semibold text-center transition-colors ${
                    methodId === m.id
                      ? "border-[#00bcd4] bg-[#00bcd4]/5 text-[#00bcd4]"
                      : "border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {!isPaypalSelected && !isMonetbilSelected && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-[13px] text-amber-800">
            <strong>Comment ça marche :</strong> Envoyez le paiement via la méthode choisie, puis soumettez ce formulaire.
            Notre équipe confirmera votre accès sous 24h.
          </div>
        )}

        {isMonetbilSelected && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-[13px] text-blue-800">
            <strong>Mobile Money :</strong> Vous serez redirigé vers la page Monetbil pour finaliser le paiement avec MTN ou Orange Money.
          </div>
        )}

        {isPaypalSelected && paypalConfig?.client_id && item.price != null && item.price > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-[13px] text-blue-800">
            Montant débité en EUR : <strong>{(item.price * paypalConfig.xaf_to_eur).toFixed(2)} €</strong>
            <span className="text-blue-600"> ({formatPrice(item.price)})</span>
          </div>
        )}

        {isPaypalSelected && !paypalConfig?.client_id && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-[13px] text-red-700">
            PayPal n'est pas encore configuré. Choisissez un autre moyen de paiement.
          </div>
        )}

        {isPaypalSelected ? (
          <div ref={paypalContainerRef} className={paypalReady ? "" : "min-h-12.5"} />
        ) : isMonetbilSelected ? (
          <button
            type="button"
            onClick={handleMonetbil}
            disabled={saving}
            className="bg-[#00bcd4] hover:bg-[#00acc1] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white font-bold py-3.5 rounded-lg text-[15px]"
          >
            {saving ? "Redirection…" : `Payer avec Mobile Money — ${formatPrice(item.price)}`}
          </button>
        ) : (
          <button
            type="submit"
            disabled={saving || !methodId}
            className="bg-[#00bcd4] hover:bg-[#00acc1] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white font-bold py-3.5 rounded-lg text-[15px]"
          >
            {saving ? "Envoi en cours…" : `Confirmer la demande — ${formatPrice(item.price)}`}
          </button>
        )}
      </form>
    </div>
  );
}
