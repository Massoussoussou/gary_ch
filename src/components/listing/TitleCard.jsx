import React, { useEffect, useState } from "react";

function Typing({ text, speed = 14, className = "" }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1; setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return (
    <h1 className={className + " break-words leading-tight"}>
      {shown}
      <span className="inline-block align-baseline w-[1ch] border-r border-neutral-900/70 animate-pulse ml-0.5" />
    </h1>
  );
}

export default function TitleCard({ title, widthPx }) {
  const style = widthPx ? { width: `${Math.round(widthPx)}px` } : undefined;

  return (
    <div
      className="
        relative rounded-none
        bg-white/82 supports-backdrop-blur:bg-white/60 backdrop-blur-xl
        ring-1 ring-black/10 shadow-[0_12px_32px_rgba(0,0,0,0.16)]
        px-6 py-4 md:px-8 md:py-5
      "
      style={style}
    >
      {/* voile subtil pour l'effet verre (sans gris sale) */}
      <div className="pointer-events-none absolute inset-0 bg-white/55 backdrop-blur-sm -z-10" />
      
      <Typing
        text={title || ""}
        className="font-serif uppercase tracking-[0.035em] text-neutral-900
               text-[clamp(30px,4.6vw,52px)] text-center"
      />
    </div>
  );
}
