import { useState, useEffect } from "react";
import { api, mediaUrl, type HeroSection } from "../lib/api";

interface HeroSectionProps {
  page: string;
}

export default function HeroSection({ page }: HeroSectionProps) {
  const [hero, setHero] = useState<HeroSection | null>(null);

  useEffect(() => {
    api.hero(page).then((items) => {
      const active = items.filter((h) => h.active).sort((a, b) => a.display_order - b.display_order);
      if (active.length > 0) setHero(active[0]);
    });
  }, [page]);

  if (!hero) return null;

  const desktop = mediaUrl(hero.image_desktop);
  const tablet = mediaUrl(hero.image_tablet);
  const mobile = mediaUrl(hero.image_mobile);

  return (
    <section className="relative px-0 sm:px-6 lg:px-8 xl:px-12 w-full max-w-[1440px] mx-auto h-screen md:h-[520px] lg:h-[471px] overflow-hidden bg-gray-300">
      <div className="w-full mx-auto  max-w-[1440px] flex items-center">
        <picture className="absolute inset-0 max-w-[1440px] w-full h-full">
          {desktop && <source media="(min-width: 1024px)" srcSet={desktop} />}
          {tablet && <source media="(min-width: 768px)" srcSet={tablet} />}
          <img
            src={(mobile ?? tablet ?? desktop) ?? ""}
            alt={hero.title}
            className="w-full h-full object-cover object-center"
          />
        </picture>

        <div className="relative h-full flex items-center px-6 md:px-10 lg:px-16">
          <div className="max-w-2xl">
            <h1 className="text-2xl md:text-3xl lg:text-3xl inter font-semibold text-white leading-tight drop-shadow-md">
              {hero.title}
            </h1>
            {hero.subtitle && (
              <p className="mt-3 text-base md:text-xl karma text-white/90 drop-shadow">
                {hero.subtitle}
              </p>
            )}
          </div>
        </div>

        {hero.cta_url && hero.cta_label && (
          <a
            href={hero.cta_url}
            className="absolute bottom-0 left-0 bg-[#00bcd4] hover:bg-[#00acc1] text-white font-bold text-sm px-6 py-3 transition-colors"
          >
            {hero.cta_label}
          </a>
        )}
      </div>
    </section>
  );
}
