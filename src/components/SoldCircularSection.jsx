// src/components/SoldCircularSection.jsx
import { useMemo } from "react";
import CircularGallery from "./CircularGallery";

const FALLBACK =
  "https://images.pexels.com/photos/13041118/pexels-photo-13041118.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=1600&h=900";

export default function SoldCircularSection({ vendus = [], height = "72vh" }) {
  const items = useMemo(
    () =>
      (vendus || [])
        .filter(Boolean)
        .map(v => ({
          image: v?.images?.[0] || FALLBACK,
          text: v?.titre || "Bien vendu"
        })),
    [vendus]
  );

  if (!items.length) return null;

  return (
    <section className="relative bg-white py-0">
      <div
        className="relative"
        style={{
          height,
          marginLeft: "calc(50% - 50vw)",
          marginRight: "calc(50% - 50vw)"
        }}
      >
        <CircularGallery
          items={items}
          bend={3}
          textColor="#ffffff"
          borderRadius={0}
          font={'600 28px "League Spartan", sans-serif'}
          scrollSpeed={2}
          scrollEase={0.05}
        />
      </div>
    </section>
  );
}
