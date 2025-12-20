// src/components/listing/HeroSticky.jsx
import React from "react";

export default function HeroSticky({ src, alt, children }) {
  return (
    <div className="sticky top-0 h-screen w-full overflow-hidden z-0">
      {src ? (
        <>
          <img
            src={src}
            alt={alt || ""}
            loading="eager"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Voile blanc léger, dégradé vers le bas */}
          <div className="absolute inset-0 bg-white/18" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/55 via-white/28 to-white/10" />
        </>
      ) : (
        <div className="h-full w-full bg-neutral-200" />
      )}
      <div className="absolute inset-0 z-10">{children}</div>
    </div>
  );
}
