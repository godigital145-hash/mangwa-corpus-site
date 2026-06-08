import { useEffect, useRef, useState } from "react";

export function useReveal<T extends HTMLElement = HTMLDivElement>(options?: {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const once = options?.once ?? true;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            if (once) io.unobserve(e.target);
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      {
        threshold: options?.threshold ?? 0.12,
        rootMargin: options?.rootMargin ?? "0px 0px -40px 0px",
      },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [options?.threshold, options?.rootMargin, options?.once]);

  return { ref, visible } as const;
}
