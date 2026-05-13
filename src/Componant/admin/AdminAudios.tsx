import { useState, useEffect } from "react";
import { api, adminApi, mediaUrl, type Audio, type Album } from "../../lib/api";
import { decodeWaveform } from "../../utils/audioWaveform";
import MediaField from "./MediaField";

type AlbumTab = "info" | "tracks";

// ── Section Albums ────────────────────────────────────────────────────────────

function AlbumsSection({ token }: { token: string }) {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; item?: Album; tab: AlbumTab }>({ open: false, tab: "info" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allAudios, setAllAudios] = useState<Audio[]>([]);

  const reload = () =>
    api.albums().then(setAlbums).catch(() => setError("Erreur albums")).finally(() => setLoading(false));

  useEffect(() => { reload(); }, []);

  function openModal(item?: Album) {
    setModal({ open: true, item, tab: "info" });
    if (allAudios.length === 0) api.audios().then(setAllAudios);
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
        await a.albums.create(form);
      }
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
    setAlbums((prev) => prev.filter((a) => a.id !== id));
  }


  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-800 text-base">Albums</h2>
        <button
          onClick={() => openModal()}
          className="bg-[#00bcd4] hover:bg-[#00acc1] text-white font-bold px-4 py-2 rounded text-sm transition-colors"
        >
          + Nouvel album
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-4 py-3 mb-4">{error}</div>
      )}

      {loading ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-100 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : albums.length === 0 ? (
        <p className="text-sm text-gray-400 py-4">Aucun album — créez le premier ci-dessus.</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {albums.map((album, i) => (
            <div
              key={album.id}
              className="anim-fade-up group relative cursor-pointer"
              style={{ animationDelay: `${Math.min(i, 11) * 40}ms` }}
              onClick={() => openModal(album)}
            >
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-200 mb-2">
                {album.cover
                  ? <img
                    src={mediaUrl(album.cover) ?? ""}
                    alt={album.title}
                    className="w-full h-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03]"
                  />
                  : <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl
                      transition-transform duration-200 ease-out group-hover:scale-[1.03]">♫</div>
                }
              </div>
              <p
                className="font-semibold text-gray-900 truncate leading-tight"
                style={{ fontFamily: "Inter, sans-serif", fontSize: "20px" }}
              >
                {album.title}
              </p>
              {album.artist && (
                <p className="text-xs text-gray-500 truncate">{album.artist}</p>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(album.id); }}
                className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white text-xl w-8 h-8 rounded-full items-center justify-center hidden group-hover:flex
                  transition-colors duration-150"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {modal.open && (
        <div className="anim-fade-in fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="anim-fade-up bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-bold text-gray-900">{modal.item ? "Modifier l'album" : "Nouvel album"}</h2>
              <button onClick={() => setModal({ open: false, tab: "info" })} className="text-gray-400 hover:text-gray-600 text-xl transition-colors duration-150">✕</button>
            </div>

            <div className="flex border-b px-6">
              {(["info", "tracks"] as AlbumTab[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setModal((m) => ({ ...m, tab: t }))}
                  className={`py-3 px-4 text-sm font-medium border-b-2 -mb-px transition-colors duration-150 ${modal.tab === t ? "border-[#00bcd4] text-[#00bcd4]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                >
                  {t === "info" ? "Informations" : `Pistes (${modal.item ? allAudios.filter((a) => String(a.album_id) === String(modal.item!.id)).length : 0})`}
                </button>
              ))}
            </div>

            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
              {modal.tab === "info" && (
                <>
                  <AlbumField label="Titre *" name="title" required defaultValue={modal.item?.title} />
                  <AlbumField label="Artiste" name="artist" defaultValue={modal.item?.artist ?? ""} />
                  <AlbumField label="Description" name="description" textarea defaultValue={modal.item?.description ?? ""} />
                  <div className="grid grid-cols-2 gap-4">
                    <AlbumField label="Genre" name="genre" defaultValue={modal.item?.genre ?? ""} />
                    <AlbumField label="Date de sortie" name="published_at" type="date" defaultValue={modal.item?.published_at?.slice(0, 10) ?? ""} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <AlbumField label="Prix (XAF)" name="price" type="number" defaultValue={modal.item?.price?.toString() ?? ""} />
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
                  <p className="text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded px-3 py-2">
                    Les pistes sont automatiquement celles dont le champ <strong>Album</strong> est défini sur cet album.
                    Pour ajouter ou retirer une piste, modifiez le champ Album de l'audio concerné.
                  </p>
                  {(() => {
                    const albumTracks = modal.item
                      ? allAudios.filter((a) => String(a.album_id) === String(modal.item!.id))
                      : [];
                    return albumTracks.length === 0 ? (
                      <p className="text-sm text-gray-400 py-4 text-center">
                        Aucun audio lié à cet album pour l'instant.
                      </p>
                    ) : (
                      <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
                        {albumTracks.map((a, i) => (
                          <div key={a.id} className="flex items-center gap-3 px-3 py-2 bg-white">
                            <span className="text-xs text-gray-400 w-5 text-right shrink-0">{i + 1}</span>
                            {a.cover
                              ? <img src={mediaUrl(a.cover) ?? ""} alt="" className="w-8 h-8 object-cover rounded shrink-0" />
                              : <div className="w-8 h-8 bg-gray-200 rounded shrink-0" />}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{a.title}</p>
                              {a.artist && <p className="text-xs text-gray-500 truncate">{a.artist}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}

              {error && <p className="text-red-600 text-sm">{error}</p>}
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setModal({ open: false, tab: "info" })} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-150">Annuler</button>
                <button type="submit" disabled={saving} className="bg-[#00bcd4] hover:bg-[#00acc1] text-white font-bold px-6 py-2 rounded text-sm disabled:opacity-60 transition-colors duration-150">
                  {saving ? "Enregistrement…" : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

// ── Section Audios ────────────────────────────────────────────────────────────

export default function AdminAudios({ token }: { token: string }) {
  const [items, setItems] = useState<Audio[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; item?: Audio }>({ open: false });
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [waveformStatus, setWaveformStatus] = useState<"idle" | "computing">("idle");
  const [error, setError] = useState<string | null>(null);

  const reload = () =>
    api.audios().then(setItems).catch(() => setError("Erreur de chargement")).finally(() => setLoading(false));

  useEffect(() => {
    reload();
    api.albums().then(setAlbums);
  }, []);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const form = new FormData(e.currentTarget);

    const audioKey = form.get("audio_file") as string | null;
    const existingWaveform = modal.item?.waveform;
    const audioChanged = audioKey && audioKey !== modal.item?.audio_file;

    if (audioKey && (audioChanged || !existingWaveform)) {
      try {
        setWaveformStatus("computing");
        const url = mediaUrl(audioKey);
        if (url) {
          const bars = await decodeWaveform(url, 2000);
          form.set("waveform", JSON.stringify(Array.from(bars)));
        }
      } catch {
        // waveform est optionnel — on continue sans bloquer
      } finally {
        setWaveformStatus("idle");
      }
    }

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
      <AlbumsSection token={token} />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-4 py-3 mb-4">{error}</div>
      )}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-800 text-base">Audios</h2>
        <button
          onClick={() => { api.albums().then(setAlbums); setSelectedAlbumId(""); setModal({ open: true }); }}
          className="bg-[#00bcd4] hover:bg-[#00acc1] text-white font-bold px-4 py-2 rounded text-sm transition-colors duration-150"
        >
          + Nouvel audio
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
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
            {loading ? (
              <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-3"><div className="w-10 h-10 bg-gray-100 rounded-full" /></td>
                    <td className="px-4 py-3"><div className="h-3.5 bg-gray-100 rounded w-32" /></td>
                    <td className="px-4 py-3"><div className="h-3 bg-gray-100 rounded w-20" /></td>
                    <td className="px-4 py-3"><div className="h-3 bg-gray-100 rounded w-16" /></td>
                    <td className="px-4 py-3"><div className="h-5 bg-gray-100 rounded-full w-14" /></td>
                    <td className="px-4 py-3" />
                  </tr>
                ))}
              </>
            ) : items.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-5 text-center text-gray-400">Aucun audio</td></tr>
            ) : (() => {
              const groups: Record<string, Audio[]> = {};
              for (const audio of items) {
                const key = audio.album_id != null ? String(audio.album_id) : "__unknown__";
                if (!groups[key]) groups[key] = [];
                groups[key].push(audio);
              }
              const albumKeys = Object.keys(groups).filter((k) => k !== "__unknown__").sort((a, b) => {
                const na = albums.find((al) => String(al.id) === a)?.title ?? "";
                const nb = albums.find((al) => String(al.id) === b)?.title ?? "";
                return na.localeCompare(nb);
              });
              if (groups["__unknown__"]) albumKeys.push("__unknown__");

              let rowIndex = 0;
              return albumKeys.map((key) => (
                <>
                  <tr key={`group-${key}`}>
                    <td colSpan={6} className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                      <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                        {key === "__unknown__" ? "Sans album" : (albums.find((a) => String(a.id) === key)?.title ?? `Album #${key}`)}
                      </span>
                    </td>
                  </tr>
                  {groups[key].map((audio) => {
                    const delay = Math.min(rowIndex++, 15) * 30;
                    return (
                      <tr
                        key={audio.id}
                        className="anim-fade-in hover:bg-gray-50 transition-colors duration-100"
                        style={{ animationDelay: `${delay}ms` }}
                      >
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
                          <button onClick={() => { setSelectedAlbumId(String(audio.album_id ?? "")); setModal({ open: true, item: audio }); }} className="text-blue-600 hover:text-blue-800 font-medium text-xs transition-colors duration-100">Modifier</button>
                          <button onClick={() => handleDelete(audio.id)} className="text-red-500 hover:text-red-700 font-medium text-xs transition-colors duration-100">Supprimer</button>
                        </td>
                      </tr>
                    );
                  })}
                </>
              ));
            })()}
          </tbody>
        </table>
      </div>

      {modal.open && (
        <div className="anim-fade-in fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="anim-fade-up bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-bold text-gray-900">{modal.item ? "Modifier l'audio" : "Nouvel audio"}</h2>
              <button onClick={() => setModal({ open: false })} className="text-gray-400 hover:text-gray-600 text-xl transition-colors duration-150">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
              <Field label="Titre *" name="title" required defaultValue={modal.item?.title} />
              <Field label="Artiste *" name="artist" required defaultValue={modal.item?.artist} />
              <label className="flex flex-col gap-1 text-sm text-gray-700">
                Album
                <select
                  name="album_id"
                  value={selectedAlbumId}
                  onChange={(e) => setSelectedAlbumId(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00bcd4] transition-colors duration-150"
                >
                  <option value="">— Sans album —</option>
                  {albums.map((a) => (
                    <option key={a.id} value={String(a.id)}>{a.title}{a.artist ? ` — ${a.artist}` : ""}</option>
                  ))}
                </select>
                <input type="hidden" name="album" value={albums.find((a) => String(a.id) === selectedAlbumId)?.title ?? ""} />
              </label>
              <Field label="Genre" name="genre" defaultValue={modal.item?.genre ?? ""} />
              <Field label="Description" name="description" textarea defaultValue={modal.item?.description ?? ""} />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Durée (secondes)" name="duration" type="number" defaultValue={modal.item?.duration?.toString() ?? ""} />
                <Field label="Prix (FCFA)" name="price" type="number" defaultValue={modal.item?.price?.toString() ?? ""} />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-gray-700 font-medium">Fenêtre de prévisualisation</p>
                <p className="text-xs text-gray-400 mb-1">Laissez vide pour lire l'audio en entier. Sinon, entrez le début et la fin en secondes.</p>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Début preview (s)" name="preview_start" type="number" defaultValue={modal.item?.preview_start?.toString() ?? ""} />
                  <Field label="Fin preview (s)" name="preview_end" type="number" defaultValue={modal.item?.preview_end?.toString() ?? ""} />
                </div>
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
              {waveformStatus === "computing" && (
                <p className="text-xs text-gray-400">Calcul de la waveform…</p>
              )}
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setModal({ open: false })} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-150">Annuler</button>
                <button type="submit" disabled={saving || waveformStatus === "computing"} className="bg-[#00bcd4] hover:bg-[#00acc1] text-white font-bold px-6 py-2 rounded text-sm disabled:opacity-60 transition-colors duration-150">
                  {waveformStatus === "computing" ? "Calcul waveform…" : saving ? "Enregistrement…" : "Enregistrer"}
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
  const cls = "w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00bcd4] transition-colors duration-150";
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

function AlbumField({ label, name, required, type = "text", textarea, defaultValue }: {
  label: string; name: string; required?: boolean; type?: string; textarea?: boolean; defaultValue?: string;
}) {
  const cls = "w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00bcd4] transition-colors duration-150";
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
