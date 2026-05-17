import type { APIRoute } from "astro";
import { api } from "../lib/api";

export const GET: APIRoute = async ({ url }) => {
  const origin = url.origin;

  const staticRoutes = [
    { path: "/", priority: "1.0", changefreq: "weekly" },
    { path: "/audio", priority: "0.9", changefreq: "daily" },
    { path: "/ebook", priority: "0.9", changefreq: "daily" },
    { path: "/edition-speciale", priority: "0.8", changefreq: "weekly" },
    { path: "/videos", priority: "0.8", changefreq: "weekly" },
    { path: "/qui-sommes-nous", priority: "0.5", changefreq: "monthly" },
  ];

  let magazines: { id: number }[] = [];
  let albums: { id: number }[] = [];
  let audios: { id: number }[] = [];

  try { magazines = await api.magazines(); } catch {}
  try { albums = await api.albums(); } catch {}
  try { audios = await api.audios(); } catch {}

  const now = new Date().toISOString().split("T")[0];

  const urls = [
    ...staticRoutes.map(
      (r) =>
        `<url><loc>${origin}${r.path}</loc><lastmod>${now}</lastmod><changefreq>${r.changefreq}</changefreq><priority>${r.priority}</priority></url>`
    ),
    ...magazines.map(
      (m) =>
        `<url><loc>${origin}/ebook/${m.id}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`
    ),
    ...albums.map(
      (a) =>
        `<url><loc>${origin}/album/${a.id}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`
    ),
    ...audios.map(
      (a) =>
        `<url><loc>${origin}/audioitem/${a.id}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
