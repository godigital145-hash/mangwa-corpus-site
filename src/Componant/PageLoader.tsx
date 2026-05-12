import { useState, useEffect, useRef } from "react";

interface Props {
  count: number;
}

export default function PageLoader({ count }: Props) {
  const [phase, setPhase] = useState<"loading" | "fading" | "done">("loading");
  const countRef = useRef(0);

  useEffect(() => {
    const done = () => {
      setPhase("fading");
      setTimeout(() => setPhase("done"), 350);
    };

    const onReady = () => {
      countRef.current++;
      if (countRef.current >= count) done();
    };

    window.addEventListener("mangwa:component-ready", onReady);
    const timeout = setTimeout(done, 8000);

    return () => {
      window.removeEventListener("mangwa:component-ready", onReady);
      clearTimeout(timeout);
    };
  }, [count]);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center transition-opacity duration-300 ${
        phase === "fading" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <p className="text-[#00bcd4] font-bold text-xs uppercase tracking-widest mb-5">
        Mangwa Corpus
      </p>
      <div className="w-6 h-6 border-2 border-gray-200 border-t-[#00bcd4] rounded-full animate-spin" />
    </div>
  );
}
