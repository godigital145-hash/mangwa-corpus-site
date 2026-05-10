import { useState, useEffect } from "react";
import CarteLibrairie from "./CarteLibrairie";
import Container from "./Container";
import Titre from "./Titre";
import { api, mediaUrl, type Magazine } from "../lib/api";

export default function SectionLibrairie() {
  const [magazines, setMagazines] = useState<Magazine[]>([]);

  useEffect(() => {
    api.magazines().then(setMagazines).catch(console.error);
  }, []);

  return (
    <section className="w-full lg:mt-[100px]">
      <Container>
        <Titre titre="Notre librairie" />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {magazines.map((mag) => (
            <CarteLibrairie
              key={mag.id}
              imageUrl={mediaUrl(mag.cover) ?? ''}
              titre={mag.title}
              auteur={mag.category ?? undefined}
              href={`/ebook/${mag.id}`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
