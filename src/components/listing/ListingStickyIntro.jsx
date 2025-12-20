// src/components/listing/ListingStickyIntro.jsx
import React, { useLayoutEffect, useRef, useState } from "react";
import HeroSticky from "./HeroSticky.jsx";
import TitleCard from "./TitleCard.jsx";
import GalleryCard from "./GalleryCard.jsx";
import AgentCard from "../AgentCard.jsx";

export default function ListingStickyIntro({ item, heroSrc }) {
  const leftRef = useRef(null);
  const [colW, setColW] = useState(0);

  useLayoutEffect(() => {
    const measure = () => setColW(leftRef.current?.offsetWidth || 0);
    measure();
    window.addEventListener("resize", measure, { passive: true });
    if (document?.fonts?.ready) document.fonts.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Largeur du Titre = largeur colonne (≈ galerie)
  const titleStyle = colW ? { width: `${colW}px` } : { width: "min(720px,92vw)" };
  // Largeur de l'AgentCard = plus étroite (360 → 480 px selon place)
  const agentW = colW ? Math.min(480, Math.max(360, Math.round(colW * 0.68))) : 420;
  const agentStyle = { width: `${agentW}px` };

  return (
    <section className="relative">
      <HeroSticky src={heroSrc} alt={item?.titre}>
        <div className="relative z-10">
          <div className="mx-auto max-w-[min(1600px,94vw)] px-4 md:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8
                            min-h-[calc(100vh-var(--header-h,72px))]
                            items-center py-6">
              {/* Gauche : Galerie */}
              <div className="mx-auto md:mr-auto w-full" ref={leftRef} style={{ maxWidth: 720 }}>
                <div style={titleStyle}>
                  <GalleryCard images={item?.images || []} widthPx={colW || undefined} item={item} />
                </div>
              </div>

              {/* Droite : Titre (tuile) + Agent (tuile plus petite) */}
              <aside className="mx-auto md:ml-auto w-full md:sticky md:top-[calc(var(--header-h,72px)+12px)]" style={{ maxWidth: 720 }}>
                <div style={titleStyle}>
                  <TitleCard title={item?.titre} variant="tile" />
                </div>

                {/* Agent plus étroit, aligné à gauche du bloc */}
                <div className="mt-4 mx-auto" style={agentStyle}>
                  <AgentCard agentSlug={item?.agentSlug} variant="card" />
                </div>
              </aside>
            </div>
          </div>
        </div>
      </HeroSticky>
    </section>
  );
}
