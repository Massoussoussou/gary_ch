import { useEffect, useState } from "react";
import ListingCard from "./ListingCard.jsx";

// Map tailles -> spans (colonnes, lignes) pour desktop
const SPANS = {
  md: { col: 1, row: 1 },
  lg: { col: 2, row: 1 },
  xl: { col: 2, row: 2 },
  xxl: { col: 4, row: 2 },
};

function normalizeSize(spotlight) {
  const s = String(spotlight || "md").toLowerCase();
  return s === "xxl" ? "xxl" : s === "xl" ? "xl" : s === "lg" ? "lg" : "md";
}

// ✅ Mobile = < 640px
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 639px)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const onChange = (e) => setIsMobile(e.matches);

    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  return isMobile;
}

export default function ListingGrid({ items = [] }) {
  const isMobile = useIsMobile();

  return (
    <div
      className="
        w-full max-w-[1500px] 2xl:max-w-[1600px] mx-auto px-4 lg:px-6 py-10
        grid gap-6
        grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
      "
    >
      {items.map((it, i) => (
        <div key={it.id ?? i} className="col-span-1">
          <ListingCard item={it} size="md" />
        </div>
      ))}
    </div>
  );
}
