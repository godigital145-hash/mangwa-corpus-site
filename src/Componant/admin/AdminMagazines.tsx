import { useState, useEffect } from "react";
import { api, adminApi, mediaUrl, type Magazine } from "../../lib/api";
import MediaField from "./MediaField";

const EMPTY: Partial<Magazine> = {};

export default function AdminMagazines({ token }: { token: string }) {
  const [items, setItems] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; item?: Magazine }>({ open: false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = () =>
    api.magazines().then(setItems).catch(() => setError("Erreur de chargement")).finally(() => setLoading(false));

  useEffect(() => { reload(); }, []);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const a = adminApi(token);
    try {
      const res = modal.item
        ? await a.magazines.update(modal.item.id, form)
        : await a.magazines.create(form);
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as any;
        setError(body?.error ?? `Erreur serveur ${res.status}`);
        return;
      }
      await reload();
      setModal({ open: false });
    } catch {
      setError("Erreur réseau — vérifiez que le serveur est accessible");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Supprimer ce magazine ?")) return;
    await adminApi(token).magazines.delete(id);
    setItems((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-4 py-3 mb-4">{error}</div>
      )}

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setModal({ open: true })}
          className="bg-[#00bcd4] hover:bg-[#00acc1] text-white font-bold px-4 py-2 rounded text-sm transition-colors"
        >
          + Nouveau magazine
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <div key={i} className="h-14 bg-gray-100 animate-pulse rounded" />)}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Couverture</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Titre</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Numéro</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Catégorie</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Mis en avant</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((mag) => (
                <tr key={mag.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {mediaUrl(mag.cover)
                      ? <img src={mediaUrl(mag.cover)!} alt={mag.title} className="w-10 h-14 object-cover rounded" />
                      : <div className="w-10 h-14 bg-gray-200 rounded" />
                    }
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{mag.title}</td>
                  <td className="px-4 py-3 text-gray-500">#{mag.issue_number ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-500">{mag.category ?? "—"}</td>
                  <td className="px-4 py-3">
                    {mag.featured ? (
                      <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">Oui</span>
                    ) : (
                      <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-2 py-0.5 rounded-full">Non</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => setModal({ open: true, item: mag })}
                      className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(mag.id)}
                      className="text-red-500 hover:text-red-700 font-medium text-xs"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">Aucun magazine</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-bold text-gray-900">
                {modal.item ? "Modifier le magazine" : "Nouveau magazine"}
              </h2>
              <button onClick={() => setModal({ open: false })} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
              <Field label="Titre *" name="title" required defaultValue={modal.item?.title} />
              <Field label="Sous-titre" name="subtitle" defaultValue={modal.item?.subtitle ?? ""} />
              <Field label="Description" name="description" textarea defaultValue={modal.item?.description ?? ""} />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Numéro" name="issue_number" type="number" defaultValue={modal.item?.issue_number?.toString() ?? ""} />
                <Field label="Catégorie" name="category" defaultValue={modal.item?.category ?? ""} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Prix (FCFA)" name="price" type="number" defaultValue={modal.item?.price?.toString() ?? ""} />
                <Field label="Pages" name="pages" type="number" defaultValue={modal.item?.pages?.toString() ?? ""} />
              </div>
              <Field label="Date de publication" name="published_at" type="date" defaultValue={modal.item?.published_at?.slice(0, 10) ?? ""} />
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" name="featured" value="true" defaultChecked={!!modal.item?.featured} />
                Mis en avant
              </label>

              <hr className="border-gray-100" />
              <MediaField label="Couverture (image)" name="cover" token={token} currentKey={modal.item?.cover} defaultFolder="magazines/covers" />
              <MediaField label="PDF complet" name="pdf_file" token={token} currentKey={modal.item?.pdf_file} defaultFolder="magazines/pdf" />
              <MediaField label="Aperçu PDF" name="pdf_preview" token={token} currentKey={modal.item?.pdf_preview} defaultFolder="magazines/previews" />

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setModal({ open: false })} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#00bcd4] hover:bg-[#00acc1] text-white font-bold px-6 py-2 rounded text-sm disabled:opacity-60"
                >
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

function Field({ label, name, required, type = "text", textarea, defaultValue }: {
  label: string; name: string; required?: boolean; type?: string; textarea?: boolean; defaultValue?: string;
}) {
  const cls = "w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00bcd4]";
  return (
    <label className="flex flex-col gap-1 text-sm text-gray-700">
      {label}
      {textarea
        ? <textarea name={name} rows={3} defaultValue={defaultValue} className={cls} />
        : <input type={type} name={name} required={required} defaultValue={defaultValue} className={cls} />
      }
    </label>
  );
}

