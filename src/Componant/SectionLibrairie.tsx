import { useState, useEffect } from "react";
import CarteLibrairie from "./CarteLibrairie";
import Container from "./Container";
import Titre from "./Titre";
import { api, mediaUrl, type Magazine } from "../lib/api";

export default function SectionLibrairie({ limit = false, type }: { limit?: boolean; type?: 'ebook' | 'magazine' }) {
  const [magazines, setMagazines] = useState<Magazine[]>([]);

  useEffect(() => {
    api.magazines().then(setMagazines).catch(console.error);
  }, []);

  const filtered = magazines.filter((mag) => {
    if (!type) return true;
    if (type === 'ebook') return mag.type === 'ebook' || !mag.type;
    return mag.type === 'magazine';
  });

  return (
    <section className="w-full lg:mt-[100px]">
      <Container>
        <Titre titre="Notre librairie" />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {(limit ? filtered.slice(0, 4) : filtered).map((mag) => (
            <CarteLibrairie
              key={mag.id}
              imageUrl={mediaUrl(mag.cover) ?? ''}
              titre={mag.title}
              auteur={mag.category ?? undefined}
              href={`/ebook/${mag.id}`}
            />
          ))}
        </div>

        {limit && filtered.length > 0 && (
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
