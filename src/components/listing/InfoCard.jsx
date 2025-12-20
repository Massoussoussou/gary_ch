// src/components/listing/InfoCard.jsx
import React from "react";
import { IconPin } from "../icons.jsx";

function formatCHF(n) {
  if (typeof n !== "number") return n;
  return "CHF " + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

export default function InfoCard({ item }) {
  const cityLine = [item?.ville, item?.canton].filter(Boolean).join(", ");
  const specLine = [
    item?.pieces ? `${item.pieces} pièces` : null,
    item?.surface_m2 ? `${item.surface_m2} m²` : null,
    item?.sdb ? `${item.sdb} sdb` : null,
  ].filter(Boolean).join(" • ");

  return (
    <div
      className="
        w-[min(560px,96vw)]
        rounded-none bg-white/75 supports-backdrop-blur:bg-white/60 backdrop-blur-xl
        ring-6 ring-black/10 shadow-xl
        p-7 md:p-8
      "
    >
      <h1 className="font-serif uppercase tracking-[0.045em] text-[28px] md:text-[34px] leading-[1.12] text-[#ff4a3e]">
        {item?.titre}
      </h1>

      {cityLine && (
        <div className="mt-3 text-[16px] md:text-[17px] text-neutral-900/90 flex items-center gap-2">
          <IconPin className="h-4 w-4 opacity-70" />
          <span>{cityLine}</span>
        </div>
      )}

      {specLine && (
        <div className="mt-1 text-[13px] md:text-[14px] tracking-[0.08em] uppercase text-neutral-600">
          {specLine}
        </div>
      )}

      <div className="mt-6 text-[20px] md:text-[22px] font-semibold text-neutral-900">
        {item?.prix ? formatCHF(item.prix) : "Prix sur demande"}
      </div>
    </div>
  );
}
