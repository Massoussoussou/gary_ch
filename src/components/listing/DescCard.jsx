// src/components/listing/DescCard.jsx
import React, { forwardRef } from "react";

const DescCard = forwardRef(function DescCard({ item }, ref) {
  return (
    <div ref={ref} className="w-[min(720px,96vw)]">
      <div
        className="
          rounded-none bg-white
          shadow-[0_12px_32px_rgba(0,0,0,0.14)]
          p-6 md:p-8
        "
      >
        <h2 className="font-serif text-[26px] md:text-[30px] leading-snug tracking-tight text-neutral-900">
          Faisons un tour d’horizon
        </h2>

        {/* zone scrollable interne */}
        <div className="mt-4 max-h-[56vh] overflow-y-auto pr-1 text-[15px] md:text-[16px] leading-relaxed text-neutral-800/90">
          {item?.description || "Description à venir."}
        </div>
      </div>
    </div>
  );
});

export default DescCard;
