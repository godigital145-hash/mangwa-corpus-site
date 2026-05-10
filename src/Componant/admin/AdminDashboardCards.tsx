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
  { key: "magazines" as keyof Counts, label: "Magazines", href: "/admin/magazines", Icon: IcTwotoneNewspaper },
  { key: "audios" as keyof Counts, label: "Audios", href: "/admin/audios", Icon: IcBaselineLibraryMusic },
  { key: "videos" as keyof Counts, label: "Vidéos", href: "/admin/videos", Icon: IcRoundVideoLibrary },
  { key: "hero" as keyof Counts, label: "Hero", href: "/admin/hero", Icon: IcSharpCropLandscape },
  { key: "media" as keyof Counts, label: "Médiathèque", href: "/admin/media", Icon: IcSharpPermMedia },
  { key: "users" as keyof Counts, label: "Utilisateurs", href: "/admin/users", Icon: IcBaselinePeople },
  { key: "newsletter" as keyof Counts, label: "Newsletter", href: "/admin/newsletter", Icon: IcBaselineEmail },
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
    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-10">
      {CARDS.map((card, i) => {
        const count = counts[card.key];
        return (
          <a
            key={card.key}
            href={card.href}
            className="anim-fade-up bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-2
              transition-[transform,border-color] duration-150 ease-out
              hover:-translate-y-px hover:border-gray-300"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <card.Icon className="h-5 w-5 text-gray-400" />
            <span
              className={`text-xl font-bold tabular-nums transition-colors duration-300 ${
                loading ? "text-gray-200" : "text-gray-900"
              }`}
            >
              {loading ? "—" : (count ?? "—")}
            </span>
            <span className="text-xs font-medium text-gray-500">{card.label}</span>
          </a>
        );
      })}
    </div>
  );
}
