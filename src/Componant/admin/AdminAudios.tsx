import { useState, useEffect } from "react";
import { api, adminApi, mediaUrl, type Audio } from "../../lib/api";
import MediaField from "./MediaField";

export default function AdminAudios({ token }: { token: string }) {
  const [items, setItems] = useState<Audio[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; item?: Audio }>({ open: false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = () =>
    api.audios().then(setItems).catch(() => setError("Erreur de chargement")).finally(() => setLoading(false));

  useEffect(() => { reload(); }, []);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const a = adminApi(token);
    try {
      if (modal.item) {
        await a.audios.update(modal.item.id, form);
      } else {
        await a.audios.create(form);
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
    if (!confirm("Supprimer cet audio ?")) return;
    await adminApi(token).audios.delete(id);
    setItems((prev) => prev.filter((a) => a.id !== id));
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
          + Nouvel audio
        </button>
      </div>


      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-semibold">Couverture</th>
              <th className="text-left px-4 py-3 text-gray-600 font-semibold">Titre</th>
              <th className="text-left px-4 py-3 text-gray-600 font-semibold">Artiste</th>
              <th className="text-left px-4 py-3 text-gray-600 font-semibold">Genre</th>
              <th className="text-left px-4 py-3 text-gray-600 font-semibold">Gratuit</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {
              loading ? (<tr><td colSpan={6} className="px-4 py-5 text-center text-gray-400">Chargement…</td></tr>) :
                items.map((audio) => (
                  <tr key={audio.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {mediaUrl(audio.cover)
                        ? <img src={mediaUrl(audio.cover)!} alt={audio.title} className="w-10 h-10 object-cover rounded-full" />
                        : <div className="w-10 h-10 bg-gray-200 rounded-full" />
                      }
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{audio.title}</td>
                    <td className="px-4 py-3 text-gray-500">{audio.artist}</td>
                    <td className="px-4 py-3 text-gray-500">{audio.genre ?? "—"}</td>
                    <td className="px-4 py-3">
                      {audio.free ? (
                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">Gratuit</span>
                      ) : (
                        <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-2 py-0.5 rounded-full">Payant</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => setModal({ open: true, item: audio })} className="text-blue-600 hover:text-blue-800 font-medium text-xs">Modifier</button>
                      <button onClick={() => handleDelete(audio.id)} className="text-red-500 hover:text-red-700 font-medium text-xs">Supprimer</button>
                    </td>
                  </tr>
                ))
            }
            {items.length === 0 || loading && (
              <tr><td colSpan={6} className="px-4 py-5 text-center text-gray-400">Aucun audio</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-bold text-gray-900">{modal.item ? "Modifier l'audio" : "Nouvel audio"}</h2>
              <button onClick={() => setModal({ open: false })} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
              <Field label="Titre *" name="title" required defaultValue={modal.item?.title} />
              <Field label="Artiste *" name="artist" required defaultValue={modal.item?.artist} />
              <Field label="Album" name="album" defaultValue={modal.item?.album ?? ""} />
              <Field label="Genre" name="genre" defaultValue={modal.item?.genre ?? ""} />
              <Field label="Description" name="description" textarea defaultValue={modal.item?.description ?? ""} />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Durée (secondes)" name="duration" type="number" defaultValue={modal.item?.duration?.toString() ?? ""} />
                <Field label="Prix (FCFA)" name="price" type="number" defaultValue={modal.item?.price?.toString() ?? ""} />
              </div>
              <Field label="Date de publication" name="published_at" type="date" defaultValue={modal.item?.published_at?.slice(0, 10) ?? ""} />
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" name="featured" value="true" defaultChecked={!!modal.item?.featured} />
                  Mis en avant
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" name="free" value="true" defaultChecked={!!modal.item?.free} />
                  Gratuit
                </label>
              </div>
              <hr className="border-gray-100" />
              <MediaField label="Couverture (image)" name="cover" token={token} currentKey={modal.item?.cover} defaultFolder="audios/covers" />
              <MediaField label="Fichier audio (MP3/WAV)" name="audio_file" token={token} currentKey={modal.item?.audio_file} defaultFolder="audios/files" />
              <MediaField label="Fichier paroles (TXT/JSON)" name="lyrics" token={token} currentKey={modal.item?.lyrics} defaultFolder="audios/files" />

              {error && <p className="text-red-600 text-sm">{error}</p>}
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setModal({ open: false })} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Annuler</button>
                <button type="submit" disabled={saving} className="bg-[#00bcd4] hover:bg-[#00acc1] text-white font-bold px-6 py-2 rounded text-sm disabled:opacity-60">
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

