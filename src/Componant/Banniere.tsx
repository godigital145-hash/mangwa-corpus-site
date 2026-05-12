import { useState, useEffect } from "react";
import { api, mediaUrl, type HeroSection } from "../lib/api";

interface BanniereProps {
  page: string;
}

export default function Banniere({ page }: BanniereProps) {
  const [hero, setHero] = useState<HeroSection | null>(null);

  useEffect(() => {
    api.hero(page)
      .then((items) => {
        const active = items.filter((h) => h.active).sort((a, b) => a.display_order - b.display_order);
        if (active.length > 0) setHero(active[0]);
      })
      .finally(() => {
        window.dispatchEvent(new CustomEvent("mangwa:component-ready"));
      });
  }, [page]);

  if (!hero) return null;

  const desktop = mediaUrl(hero.image_desktop);
  const tablet = mediaUrl(hero.image_tablet);
  const mobile = mediaUrl(hero.image_mobile);
  const titre = hero.title;
  const descript = hero.subtitle;
  const ctaLabel = hero.cta_label;
  const ctaUrl = hero.cta_url;

  const hasPicture = desktop || tablet || mobile;

  return (
    <section className="relative w-full h-[720px] md:h-[520px] lg:h-[455px] overflow-hidden bg-gray-300 mb-6 lg:mb-8">
      {hasPicture && (
        <picture className="absolute inset-0 w-full h-full">
          {desktop && <source media="(min-width: 1024px)" srcSet={desktop} />}
          {tablet && <source media="(min-width: 768px)" srcSet={tablet} />}
          <img
            src={(mobile ?? tablet ?? desktop) ?? ""}
            alt={titre}
            className="w-full h-full object-cover object-center"
          />
        </picture>
      )}

      <div className="relative lg:w-[60%] lg:h-full flex flex-col items-center justify-center px-10 sm:px-10 lg:px-16 pb-10 sm:pb-14 pt-12 sm:pt-16 lg:pt-20">
        <h1 className="text-[34px] sm:text-[24px] lg:text-[32px] inter font-semibold text-white leading-tight max-w-205">
          {titre}
        </h1>
        <p className="text-white karma mt-5 text-[16px] sm:text-[16px] lg:text-[20px] max-w-205">
          {descript}
        </p>
      </div>

      {ctaUrl && ctaLabel && (
        <a
          href={ctaUrl}
          className="absolute bottom-0 left-0 bg-[#00bcd4] hover:bg-[#00acc1] text-white font-bold text-sm px-6 py-3 transition-colors"
        >
          {ctaLabel}
        </a>
      )}
    </section>
  );
}
