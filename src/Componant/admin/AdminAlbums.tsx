import { useState, useEffect } from "react";
import { api, adminApi, mediaUrl, type Album, type AlbumTrack, type Audio } from "../../lib/api";
import MediaField from "./MediaField";

type Tab = "info" | "tracks";

export default function AdminAlbums({ token }: { token: string }) {
  const [items, setItems]   = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]   = useState<{ open: boolean; item?: Album; tab: Tab }>({ open: false, tab: "info" });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  // état pistes
  const [tracks, setTracks]     = useState<AlbumTrack[]>([]);
  const [allAudios, setAllAudios] = useState<Audio[]>([]);
  const [search, setSearch]     = useState("");

  const reload = () =>
    api.albums().then(setItems).catch(() => setError("Erreur de chargement")).finally(() => setLoading(false));

  useEffect(() => { reload(); }, []);

  function openModal(item?: Album) {
    setModal({ open: true, item, tab: "info" });
    setTracks([]);
    setSearch("");
    if (item) {
      adminApi(token).albums.tracks(item.id).then(setTracks);
    }
    if (allAudios.length === 0) {
      api.audios().then(setAllAudios);
    }
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const a = adminApi(token);
    try {
      if (modal.item) {
        await a.albums.update(modal.item.id, form);
      } else {
        const res = await a.albums.create(form);
        const { id } = await res.json() as { id: number };
        if (tracks.length > 0) {
          await a.albums.setTracks(id, tracks.map((t, i) => ({ audio_id: t.audio_id, track_order: i })));
        }
        await reload();
        setModal({ open: false, tab: "info" });
        return;
      }
      await a.albums.setTracks(modal.item.id, tracks.map((t, i) => ({ audio_id: t.audio_id, track_order: i })));
      await reload();
      setModal({ open: false, tab: "info" });
    } catch {
      setError("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Supprimer cet album ?")) return;
    await adminApi(token).albums.delete(id);
    setItems((prev) => prev.filter((a) => a.id !== id));
  }

  function addTrack(audio: Audio) {
    if (tracks.find((t) => t.audio_id === audio.id)) return;
    setTracks((prev) => [...prev, {
      audio_id: audio.id, track_order: prev.length,
      title: audio.title, artist: audio.artist, cover: audio.cover,
      audio_file: audio.audio_file, duration: audio.duration, free: audio.free,
    }]);
  }

  function removeTrack(audioId: number) {
    setTracks((prev) => prev.filter((t) => t.audio_id !== audioId));
  }

  function moveTrack(index: number, dir: -1 | 1) {
    setTracks((prev) => {
      const next = [...prev];
      const swap = index + dir;
      if (swap < 0 || swap >= next.length) return prev;
      [next[index], next[swap]] = [next[swap], next[index]];
      return next;
    });
  }

  const filtered = allAudios.filter((a) =>
    !tracks.find((t) => t.audio_id === a.id) &&
    (a.title.toLowerCase().includes(search.toLowerCase()) || (a.artist ?? "").toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-4 py-3 mb-4">{error}</div>
      )}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => openModal()}
          className="bg-[#00bcd4] hover:bg-[#00acc1] text-white font-bold px-4 py-2 rounded text-sm transition-colors"
        >
          + Nouvel album
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
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Artiste</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Genre</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((album) => (
                <tr key={album.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {album.cover
                      ? <img src={mediaUrl(album.cover) ?? ""} alt="" className="w-10 h-10 object-cover rounded" />
                      : <div className="w-10 h-10 bg-gray-200 rounded" />}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{album.title}</td>
                  <td className="px-4 py-3 text-gray-500">{album.artist ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-500">{album.genre ?? "—"}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => openModal(album)} className="text-blue-600 hover:text-blue-800 font-medium text-xs">Modifier</button>
                    <button onClick={() => handleDelete(album.id)} className="text-red-500 hover:text-red-700 font-medium text-xs">Supprimer</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Aucun album</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-bold text-gray-900">{modal.item ? "Modifier l'album" : "Nouvel album"}</h2>
              <button onClick={() => setModal({ open: false, tab: "info" })} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            {/* Onglets */}
            <div className="flex border-b px-6">
              {(["info", "tracks"] as Tab[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setModal((m) => ({ ...m, tab: t }))}
                  className={`py-3 px-4 text-sm font-medium border-b-2 -mb-px transition-colors ${modal.tab === t ? "border-[#00bcd4] text-[#00bcd4]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                >
                  {t === "info" ? "Informations" : `Pistes (${tracks.length})`}
                </button>
              ))}
            </div>

            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
              {modal.tab === "info" && (
                <>
                  <Field label="Titre *" name="title" required defaultValue={modal.item?.title} />
                  <Field label="Artiste" name="artist" defaultValue={modal.item?.artist ?? ""} />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Genre" name="genre" defaultValue={modal.item?.genre ?? ""} />
                    <Field label="Date de sortie" name="published_at" type="date" defaultValue={modal.item?.published_at?.slice(0, 10) ?? ""} />
                  </div>
                  <MediaField label="Couverture" name="cover" token={token} currentKey={modal.item?.cover} defaultFolder="albums" />
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" name="featured" value="true" defaultChecked={!!modal.item?.featured} />
                    Mis en avant
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" name="free" value="true" defaultChecked={modal.item ? !!modal.item.free : true} />
                    Gratuit
                  </label>
                </>
              )}

              {modal.tab === "tracks" && (
                <div className="flex flex-col gap-4">
                  {/* Pistes actuelles */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Pistes de l'album</p>
                    {tracks.length === 0 ? (
                      <p className="text-sm text-gray-400 py-4 text-center">Aucune piste — ajoutez des titres ci-dessous</p>
                    ) : (
                      <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
                        {tracks.map((t, i) => (
                          <div key={t.audio_id} className="flex items-center gap-3 px-3 py-2 bg-white">
                            <span className="text-xs text-gray-400 w-5 text-right shrink-0">{i + 1}</span>
                            {t.cover
                              ? <img src={mediaUrl(t.cover) ?? ""} alt="" className="w-8 h-8 object-cover rounded shrink-0" />
                              : <div className="w-8 h-8 bg-gray-200 rounded shrink-0" />}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{t.title}</p>
                              {t.artist && <p className="text-xs text-gray-500 truncate">{t.artist}</p>}
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button type="button" onClick={() => moveTrack(i, -1)} disabled={i === 0} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30">▲</button>
                              <button type="button" onClick={() => moveTrack(i, 1)} disabled={i === tracks.length - 1} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30">▼</button>
                              <button type="button" onClick={() => removeTrack(t.audio_id)} className="p-1 text-red-400 hover:text-red-600 ml-1">✕</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recherche audios */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Ajouter des titres</p>
                    <input
                      type="text"
                      placeholder="Rechercher un titre ou artiste…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-2 focus:outline-none focus:border-[#00bcd4]"
                    />
                    <div className="max-h-48 overflow-y-auto divide-y divide-gray-100 border border-gray-200 rounded-lg">
                      {filtered.slice(0, 30).map((a) => (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => addTrack(a)}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 text-left"
                        >
                          {a.cover
                            ? <img src={mediaUrl(a.cover) ?? ""} alt="" className="w-8 h-8 object-cover rounded shrink-0" />
                            : <div className="w-8 h-8 bg-gray-200 rounded shrink-0" />}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{a.title}</p>
                            {a.artist && <p className="text-xs text-gray-500 truncate">{a.artist}</p>}
                          </div>
                          <span className="text-xs text-[#00bcd4] font-medium shrink-0">+ Ajouter</span>
                        </button>
                      ))}
                      {filtered.length === 0 && (
                        <p className="text-sm text-gray-400 py-4 text-center">Aucun résultat</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {error && <p className="text-red-600 text-sm">{error}</p>}
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setModal({ open: false, tab: "info" })} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Annuler</button>
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

function Field({ label, name, required, type = "text", defaultValue, hint }: {
  label: string; name: string; required?: boolean; type?: string; defaultValue?: string; hint?: string;
}) {
  const cls = "w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00bcd4]";
  return (
    <label className="flex flex-col gap-1 text-sm text-gray-700">
      {label}
      <input type={type} name={name} required={required} defaultValue={defaultValue} className={cls} />
      {hint && <span className="text-xs text-gray-400">{hint}</span>}
    </label>
  );
}
