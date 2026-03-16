import React, { useRef, useState, useEffect } from "react";

const portals = [
  { parts: [{ t: "H", o: true }, { t: "ome" }, { t: "g", o: true }, { t: "ate" }], url: "https://www.homegate.ch/fr" },
  { parts: [{ t: "I", o: true }, { t: "mmo" }, { t: "S", o: true }, { t: "cout" }, { t: "24", o: true }], url: "https://www.immobilienscout24.de/" },
  { parts: [{ t: "I", o: true }, { t: "mmobilier" }, { t: ".", o: true }, { t: "ch" }], url: "https://www.immobilier.ch/" },
  { parts: [{ t: "A", o: true }, { t: "cheter-" }, { t: "L", o: true }, { t: "ouer" }], url: "https://www.acheter-louer.ch/" },
  { parts: [{ t: "R", o: true }, { t: "eal" }, { t: "f", o: true }, { t: "orce" }], url: "https://www.realforce.ch/fr/" },
];

export default function PortalsSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-white py-16 md:py-20 border-y border-neutral-100">
      <div className="mx-auto px-8 md:px-16">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <p
            className="text-[0.8rem] uppercase tracking-[0.2em] text-neutral-500 whitespace-nowrap shrink-0"
            style={{
              opacity: visible ? 1 : 0,
              transition: "opacity 0.5s ease",
            }}
          >
            Votre bien diffusé sur
          </p>

          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-24 flex-1">
            {portals.map((p, i) => (
              <a
                key={i}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-block font-serif text-[1.3rem] md:text-[1.5rem] text-[#1A1A1A] hover:text-[#FF4A3E] transition-colors duration-300 cursor-pointer pb-1"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(10px)",
                  transition: `opacity 0.4s ease ${0.15 + i * 0.08}s, transform 0.4s ease ${0.15 + i * 0.08}s, color 0.3s ease`,
                }}
              >
                {p.parts.map((seg, j) =>
                  seg.o
                    ? <span key={j} className="text-[#FF4A3E] group-hover:text-[#FF4A3E]">{seg.t}</span>
                    : <React.Fragment key={j}>{seg.t}</React.Fragment>
                )}
                <span className="absolute left-0 right-0 bottom-0 h-[1px] bg-[#FF4A3E]/40 origin-right scale-x-0 group-hover:origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
