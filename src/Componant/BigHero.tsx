import { useState, useEffect } from "react";
import { api, mediaUrl, type BigHeroSlide } from "../lib/api";
import Container from "./Container";

const SLIDE_DURATION = 5000;

export default function BigHero() {
  const [slides, setSlides] = useState<BigHeroSlide[]>([]);
  const [current, setCurrent] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    api.bigHero().then(setSlides);
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(id);
  }, [slides.length, resetKey]);

  const goTo = (i: number) => {
    setCurrent(i);
    setResetKey((k) => k + 1);
  };

  if (slides.length === 0) return null;

  const slide = slides[current];

  return (
    <section className="relative w-full overflow-hidden bg-gray-900 mb-10">
      {/* Responsive container: square on mobile, 750px fixed height on md+ */}
      <div className="relative w-full aspect-square md:aspect-auto md:h-187.5">

        {/* Slides */}
        {slides.map((s, i) => {
          const desktopImg = mediaUrl(s.image_desktop);
          const mobileImg = mediaUrl(s.image_mobile) ?? desktopImg;
          return (
            <div
              key={s.id}
              aria-hidden={i !== current}
              className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
              {/* Mobile image (square) */}
              {mobileImg && (
                <img
                  src={mobileImg}
                  alt={s.title}
                  className="md:hidden w-full h-full object-cover object-center"
                />
              )}
              {/* Desktop / tablet image */}
              {desktopImg && (
                <img
                  src={desktopImg}
                  alt={s.title}
                  className="hidden md:block w-full h-full object-cover object-center"
                />
              )}
              {!mobileImg && !desktopImg && (
                <div className="w-full h-full bg-gray-800" />
              )}
            </div>
          );
        })}

        {/* Bottom bar: title left · dots center · CTA right */}
        <div className="absolute bottom-0 left-0 right-0 gap-4 px-5 sm:px-8 py-4 sm:py-5 bg-black/30 backdrop-blur-md">
          <Container>
            <div className="flex items-center justify-between">
              <p className="text-white font-bold text-[15px] sm:text-[18px] lg:text-[20px] truncate flex-1 min-w-0">
                {slide.title}
              </p>

              {slides.length > 1 && (
                <div className="flex-1 items-center justify-center hidden md:flex">
                  <div className="flex shrink-0 items-center gap-1.5">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goTo(i)}
                        aria-label={`Slide ${i + 1}`}
                        className={`h-2 rounded-full transition-all duration-300 ${i === current ? "bg-white w-6" : "bg-white/50 w-2"
                          }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {slide.cta_url && slide.cta_label && (
                <div className="flex-1 flex items-center justify-end">
                  <a
                    href={slide.cta_url}
                    className="shrink-0 bg-[#00bcd4] hover:bg-[#00acc1] transition-colors text-white font-bold text-[13px] sm:text-[14px] px-5 sm:px-6 py-2.5"
                  >
                    {slide.cta_label}
                  </a>
                </div>
              )}
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
