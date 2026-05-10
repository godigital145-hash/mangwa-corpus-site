import { useState, useEffect } from "react";
import { adminApi, type Payment } from "../../lib/api";

const STATUS_COLOR: Record<string, string> = {
  pending:   "bg-amber-100 text-amber-700",
  completed: "bg-green-100 text-green-700",
  failed:    "bg-red-100 text-red-600",
  refunded:  "bg-blue-100 text-blue-700",
};

const STATUS_LABEL: Record<string, string> = {
  pending:   "En attente",
  completed: "Complété",
  failed:    "Échoué",
  refunded:  "Remboursé",
};

export default function AdminPayments({ token }: { token: string }) {
  const [items, setItems] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const a = adminApi(token);

  const reload = (p = page) =>
    a.payments.list(p).then(setItems).catch(() => setError("Erreur de chargement")).finally(() => setLoading(false));

  useEffect(() => { reload(page); }, [page]);

  async function handleStatus(id: number, status: string) {
    await a.payments.updateStatus(id, status);
    setItems((prev) => prev.map((p) => p.id === id ? { ...p, status } : p));
  }

  async function handleDelete(id: number) {
    if (!confirm("Supprimer ce paiement ?")) return;
    await a.payments.delete(id);
    setItems((prev) => prev.filter((p) => p.id !== id));
  }

  const total     = items.reduce((s, p) => s + (p.status === "completed" ? p.amount : 0), 0);
  const pending   = items.filter((p) => p.status === "pending").length;
  const completed = items.filter((p) => p.status === "completed").length;

  return (
    <div>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-4 py-3 mb-4">{error}</div>}

      <div className="flex gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 px-6 py-4 text-center">
          <p className="text-2xl font-extrabold text-green-600">{total.toLocaleString("fr-FR")} XAF</p>
          <p className="text-xs text-gray-400 mt-0.5">Revenus (page)</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 px-6 py-4 text-center">
          <p className="text-2xl font-extrabold text-gray-900">{completed}</p>
          <p className="text-xs text-gray-400 mt-0.5">Complétés</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 px-6 py-4 text-center">
          <p className="text-2xl font-extrabold text-amber-600">{pending}</p>
          <p className="text-xs text-gray-400 mt-0.5">En attente</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">{[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-14 bg-gray-100 animate-pulse rounded" />)}</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Référence</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Client</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Contenu</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Méthode</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Montant</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Statut</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((pay) => (
                <tr key={pay.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{pay.reference ?? `#${pay.id}`}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 text-xs">{pay.user_name ?? "—"}</p>
                    <p className="text-gray-400 text-xs">{pay.user_email ?? ""}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs capitalize">
                    {pay.entity_type ? `${pay.entity_type} #${pay.entity_id}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{pay.method_name ?? "—"}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900 text-xs whitespace-nowrap">
                    {pay.amount.toLocaleString("fr-FR")} {pay.currency}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={pay.status}
                      onChange={(e) => handleStatus(pay.id, e.target.value)}
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full border-0 cursor-pointer ${STATUS_COLOR[pay.status] ?? "bg-gray-100 text-gray-600"}`}
                    >
                      {Object.entries(STATUS_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(pay.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(pay.id)} className="text-red-500 hover:text-red-700 font-medium text-xs">Supprimer</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">Aucun paiement</td></tr>
              )}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-xs text-gray-500 hover:text-gray-800 disabled:opacity-40"
            >
              ← Précédent
            </button>
            <span className="text-xs text-gray-400">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={items.length < 50}
              className="text-xs text-gray-500 hover:text-gray-800 disabled:opacity-40"
            >
              Suivant →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
