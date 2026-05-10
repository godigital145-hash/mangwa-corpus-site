import { useState, useEffect } from "react";
import { adminApi, mediaUrl, type ActivityEntry } from "../../lib/api";

const ACTION_LABEL: Record<string, string> = {
  create: "Ajout",
  update: "Modification",
  delete: "Suppression",
};

const ACTION_COLOR: Record<string, string> = {
  create: "bg-green-100 text-green-700",
  update: "bg-blue-100 text-blue-700",
  delete: "bg-red-100 text-red-700",
};

const ENTITY_LABEL: Record<string, string> = {
  magazine: "Magazine",
  audio: "Audio",
  video: "Vidéo",
  media: "Média",
  hero: "Hero",
};

const IMAGE_EXTS = /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i;

function formatDate(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }),
    time: d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
  };
}

function Thumbnail({ entry }: { entry: ActivityEntry }) {
  const url = mediaUrl(entry.entity_image);
  const isImage = entry.entity_image ? IMAGE_EXTS.test(entry.entity_image) : false;

  if (entry.entity_type === "media") {
    return (
      <div className="shrink-0 w-[42px] h-[42px] rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
        {isImage && url
          ? <img src={url} alt="" className="w-full h-full object-cover" />
          : <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
        }
      </div>
    );
  }

  if (entry.entity_type === "audio") {
    return (
      <div className="shrink-0 w-[42px] h-[42px] rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
        {isImage && url
          ? <img src={url} alt="" className="w-full h-full object-cover" />
          : <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
            </svg>
        }
      </div>
    );
  }

  if (entry.entity_type === "magazine") {
    return (
      <div className="shrink-0 w-[30px] h-[42px] rounded overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
        {isImage && url
          ? <img src={url} alt="" className="w-full h-full object-cover" />
          : <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
        }
      </div>
    );
  }

  return (
    <div className="shrink-0 w-[42px] h-[42px] rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
      {isImage && url
        ? <img src={url} alt="" className="w-full h-full object-cover" />
        : <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
      }
    </div>
  );
}

export default function AdminActivity({ token }: { token: string }) {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi(token).activity.list(30)
      .then(setEntries)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 animate-pulse">
            <div className="w-16 h-5 bg-gray-200 rounded-full" />
            <div className="w-[42px] h-[42px] rounded-full bg-gray-200 shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 bg-gray-200 rounded w-2/3" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
            </div>
            <div className="w-20 h-3 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="py-12 text-center text-gray-400 text-sm">
        Aucune activité enregistrée
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry) => {
        const { date, time } = formatDate(entry.created_at);
        return (
          <div
            key={entry.id}
            className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${ACTION_COLOR[entry.action]}`}>
              {ACTION_LABEL[entry.action]}
            </span>

            <Thumbnail entry={entry} />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {entry.entity_name ?? "—"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {ENTITY_LABEL[entry.entity_type] ?? entry.entity_type}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-xs text-gray-500">{date}</p>
              <p className="text-xs text-gray-400">{time}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
