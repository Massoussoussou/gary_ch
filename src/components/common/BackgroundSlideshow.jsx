// src/components/common/BackgroundSlideshow.jsx
import { useEffect, useState } from "react";

export default function BackgroundSlideshow({ images, duration = 6.2 }) {
  const [idx, setIdx] = useState(0);
  const [prev, setPrev] = useState(null);

  useEffect(() => {
    const next = (idx + 1) % images.length;

    // Précharge next (évite flash)
    const img = new Image();
    img.decoding = "async";
    img.src = images[next];

    const t = setTimeout(() => {
      setPrev(idx);
      setIdx(next);
      setTimeout(() => setPrev(null), 900); // durée fade
    }, duration * 1000);

    return () => clearTimeout(t);
  }, [idx, images, duration]);

  const current = images[idx];
  const previous = prev !== null ? images[prev] : null;

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none select-none overflow-hidden">
      {/* previous */}
      {previous && (
        <div className="absolute inset-0 opacity-0 transition-opacity duration-900">
          <img
            src={previous}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover scale-[1.08]"
            decoding="async"
          />
        </div>
      )}

      {/* current */}
      <div className="absolute inset-0 opacity-100 transition-opacity duration-900">
        <img
          src={current}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover scale-[1.10] translate-x-[-2%]"
          decoding="async"
          fetchPriority="high"
        />
      </div>

      {/* Voiles luxe */}
      <div aria-hidden className="absolute inset-0">
        <div className="absolute inset-0 bg-black/18" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/20 to-transparent md:from-white/55 md:via-white/25 md:to-transparent" />
        <div className="absolute inset-0 md:bg-gradient-to-r md:from-white/55 md:via-white/25 md:to-transparent" />
      </div>
    </div>
  );
}
