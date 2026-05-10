import { useState, useEffect } from "react";
import { adminApi } from "../../lib/api";
import {
  IcSharpPermMedia,
  IcSharpCropLandscape,
  IcRoundVideoLibrary,
  IcBaselineLibraryMusic,
  IcTwotoneNewspaper,
  IcBaselinePeople,
  IcBaselineEmail,
} from "../icons";

type Counts = {
  magazines: number;
  audios: number;
  videos: number;
  hero: number;
  media: number;
  users: number;
  newsletter: number;
};

const CARDS = [
  {
    key: "magazines" as keyof Counts,
    label: "Magazines",
    href: "/admin/magazines",
    desc: "Éditions et e-books",
    color: "text-blue-500",
    Icon: IcTwotoneNewspaper,
  },
  {
    key: "audios" as keyof Counts,
    label: "Audios",
    href: "/admin/audios",
    desc: "Pistes audio",
    color: "text-purple-500",
    Icon: IcBaselineLibraryMusic,
  },
  {
    key: "videos" as keyof Counts,
    label: "Vidéos",
    href: "/admin/videos",
    desc: "Vidéos",
    color: "text-red-500",
    Icon: IcRoundVideoLibrary,
  },
  {
    key: "hero" as keyof Counts,
    label: "Hero",
    href: "/admin/hero",
    desc: "Bannières d'accueil",
    color: "text-amber-500",
    Icon: IcSharpCropLandscape,
  },
  {
    key: "media" as keyof Counts,
    label: "Médiathèque",
    href: "/admin/media",
    desc: "Fichiers médias",
    color: "text-teal-500",
    Icon: IcSharpPermMedia,
  },
  {
    key: "users" as keyof Counts,
    label: "Utilisateurs",
    href: "/admin/users",
    desc: "Comptes utilisateurs",
    color: "text-indigo-500",
    Icon: IcBaselinePeople,
  },
  {
    key: "newsletter" as keyof Counts,
    label: "Newsletter",
    href: "/admin/newsletter",
    desc: "Abonnés newsletter",
    color: "text-pink-500",
    Icon: IcBaselineEmail,
  },
];

export default function AdminDashboardCards({ token }: { token: string }) {
  const [counts, setCounts] = useState<Partial<Counts>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const a = adminApi(token);
    Promise.allSettled([
      fetch(`/api/magazines`).then((r) => r.json()).then((d: any[]) => ({ magazines: d.length })),
      fetch(`/api/audios`).then((r) => r.json()).then((d: any[]) => ({ audios: d.length })),
      fetch(`/api/videos`).then((r) => r.json()).then((d: any[]) => ({ videos: d.length })),
      fetch(`/api/hero`).then((r) => r.json()).then((d: any[]) => ({ hero: d.length })),
      fetch(`/api/media`).then((r) => r.json()).then((d: any[]) => ({ media: d.length })),
      a.users.list().then((d) => ({ users: d.length })),
      a.newsletter.list().then((d) => ({ newsletter: d.length })),
    ]).then((results) => {
      const merged: Partial<Counts> = {};
      for (const r of results) {
        if (r.status === "fulfilled") Object.assign(merged, r.value);
      }
      setCounts(merged);
      setLoading(false);
    });
  }, [token]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-10">
      {CARDS.map((card) => {
        const count = counts[card.key];
        return (
          <a
            key={card.key}
            href={card.href}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow group flex flex-col justify-between gap-3 min-h-35"
          >
            <div className="flex items-start justify-between">
              <card.Icon className={`h-9 w-9 ${card.color}`} />
              <span className={`text-2xl font-extrabold ${loading ? "text-gray-200" : "text-gray-900"} tabular-nums`}>
                {loading ? "—" : (count ?? "—")}
              </span>
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-sm group-hover:text-[#00bcd4] transition-colors">
                {card.label}
              </h2>
              <p className="text-gray-400 text-xs mt-0.5">{card.desc}</p>
            </div>
          </a>
        );
      })}
    </div>
  );
}
