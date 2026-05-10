import { useState, useEffect } from "react";
import { adminApi, type PaymentMethod } from "../../lib/api";

const TYPES = ["mobile_money", "card", "bank_transfer", "cash", "other"];

export default function AdminPaymentMethods({ token }: { token: string }) {
  const [items, setItems] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; item?: PaymentMethod }>({ open: false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const a = adminApi(token);

  const reload = () =>
    a.paymentMethods.list().then(setItems).catch(() => setError("Erreur de chargement")).finally(() => setLoading(false));

  useEffect(() => { reload(); }, []);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const data = { name: fd.get("name") as string, type: fd.get("type") as string };
    try {
      if (modal.item) {
        await a.paymentMethods.update(modal.item.id, data);
      } else {
        await a.paymentMethods.create(data);
      }
      await reload();
      setModal({ open: false });
    } catch {
      setError("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Supprimer cette méthode ?")) return;
    await a.paymentMethods.delete(id);
    setItems((prev) => prev.filter((m) => m.id !== id));
  }

  async function handleToggle(item: PaymentMethod) {
    await a.paymentMethods.update(item.id, { active: item.active ? 0 : 1 });
    setItems((prev) => prev.map((m) => m.id === item.id ? { ...m, active: m.active ? 0 : 1 } : m));
  }

  return (
    <div>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-4 py-3 mb-4">{error}</div>}

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setModal({ open: true })}
          className="bg-[#00bcd4] hover:bg-[#00acc1] text-white font-bold px-4 py-2 rounded text-sm transition-colors"
        >
          + Nouvelle méthode
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">{[1, 2, 3].map((i) => <div key={i} className="h-14 bg-gray-100 animate-pulse rounded" />)}</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Nom</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Type</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Statut</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{item.type}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggle(item)}>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}>
                        {item.active ? "Actif" : "Inactif"}
                      </span>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => setModal({ open: true, item })} className="text-blue-600 hover:text-blue-800 font-medium text-xs">Modifier</button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 font-medium text-xs">Supprimer</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">Aucune méthode de paiement</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-bold text-gray-900">{modal.item ? "Modifier" : "Nouvelle méthode"}</h2>
              <button onClick={() => setModal({ open: false })} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
              <label className="flex flex-col gap-1 text-sm text-gray-700">
                Nom *
                <input name="name" required defaultValue={modal.item?.name}
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00bcd4]" />
              </label>
              <label className="flex flex-col gap-1 text-sm text-gray-700">
                Type
                <select name="type" defaultValue={modal.item?.type ?? "mobile_money"}
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00bcd4]">
                  {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setModal({ open: false })} className="px-4 py-2 text-sm text-gray-600">Annuler</button>
                <button type="submit" disabled={saving}
                  className="bg-[#00bcd4] hover:bg-[#00acc1] text-white font-bold px-6 py-2 rounded text-sm disabled:opacity-60">
                  {saving ? "Enregistrement…" : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
