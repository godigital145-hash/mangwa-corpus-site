import etooBg from "../assets/Etoo.png";
import mangwaLogo from "../assets/mangwa_logo.png";
import Container from "./Container";

interface PanneauEditionProps {
  badge?: string;
  nom: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function PanneauEdition({
  badge = "Édition Limitée",
  nom,
  description,
  ctaLabel = "Obtenir un exemple",
  ctaHref = "#",
}: PanneauEditionProps) {
  return (
    <section className="relative w-full overflow-hidden my-6">
      <Container className="py-0 relative">
        <div className="relative w-full min-h-[280px] sm:min-h-[360px] lg:min-h-[420px] flex items-center">

          {/* Image de fond */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={etooBg.src}
              alt=""
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* Dégradé : transparent à gauche → noir à droite (desktop) / bas → haut (mobile) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:via-black/55 sm:to-black/92" />

          {/* Badge */}
          <div className="absolute top-0 right-0 bg-[#e8f531] text-black text-[12px] sm:text-[13px] font-bold px-3 py-1.5 sm:px-4 sm:py-2 z-10">
            {badge}
          </div>

          {/* Contenu */}
          <div className="
            relative z-10 w-full flex flex-col gap-3 px-5 py-8
            items-start justify-end mt-auto
            sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2
            sm:w-[58%] sm:items-start sm:px-8 sm:py-0
            lg:w-[52%] lg:px-10
          ">
            {/* Logo Mangwa */}
            <img
              src={mangwaLogo.src}
              alt="Mangwa Magazine"
              className="h-10 sm:h-14 lg:h-16 object-contain"
            />

            {/* Nom vedette */}
            <h2 className="text-white font-extrabold text-[26px] sm:text-[42px] lg:text-[58px] leading-tight">
              {nom}
            </h2>

            {/* Description */}
            <p className="text-white/90 text-[13px] sm:text-[16px] lg:text-[18px] font-light leading-snug">
              {description}
            </p>

            {/* CTA */}
            <a
              href={ctaHref}
              className="inline-flex items-center gap-3 border border-white/50 bg-white/10 hover:bg-white/20 transition-colors text-white text-[13px] sm:text-[14px] font-medium px-5 py-2.5 sm:px-6 sm:py-3 mt-1"
            >
              {ctaLabel}
              <span className="text-base">→</span>
            </a>
          </div>

        </div>
      </Container>
    </section>
  );
}
