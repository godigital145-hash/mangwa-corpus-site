import { useState, useEffect } from "react";
import CarteLibrairie from "./CarteLibrairie";
import Container from "./Container";
import Titre from "./Titre";
import { api, mediaUrl } from "../lib/api";

type Item = { id: number; title: string; cover: string | null; category?: string | null };

export default function SectionLibrairie({ limit = false, type }: { limit?: boolean; type?: 'ebook' | 'magazine' }) {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    if (type === 'ebook') {
      api.ebooks().then((arr) => setItems(arr.map((e) => ({ id: e.id, title: e.title, cover: e.cover })))).catch(console.error);
    } else if (type === 'magazine') {
      api.magazines().then((arr) => setItems(arr.map((m) => ({ id: m.id, title: m.title, cover: m.cover, category: m.category })))).catch(console.error);
    } else {
      Promise.all([api.magazines(), api.ebooks()])
        .then(([m, e]) => setItems([
          ...m.map((x) => ({ id: x.id, title: x.title, cover: x.cover, category: x.category })),
          ...e.map((x) => ({ id: x.id, title: x.title, cover: x.cover })),
        ]))
        .catch(console.error);
    }
  }, [type]);

  return (
    <section className="w-full lg:mt-[100px]">
      <Container>
        <Titre titre="Notre librairie" />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {(limit ? items.slice(0, 4) : items).map((it) => (
            <CarteLibrairie
              key={`${type ?? 'all'}-${it.id}`}
              imageUrl={mediaUrl(it.cover) ?? ''}
              titre={it.title}
              auteur={it.category ?? undefined}
              href={type === 'ebook' ? `/ebook/${it.id}` : `/magazine/${it.id}`}
            />
          ))}
        </div>

        {limit && items.length > 0 && (
          <div className="flex justify-center mt-10">
            <a
              href="/ebook"
              className="border border-[#00bcd4] text-[#00bcd4] hover:bg-[#00bcd4] hover:text-white transition-colors font-bold text-sm px-8 py-3"
            >
              Voir plus
            </a>
          </div>
        )}
      </Container>
    </section>
  );
}
