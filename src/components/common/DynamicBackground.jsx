// src/components/common/DynamicBackground.jsx
import { motion, AnimatePresence } from "framer-motion";

export default function DynamicBackground({ bgSrc, fadeSrc, onFadeDone }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none select-none">
      {/* Image de BASE : toujours visible (pas animée) */}
      <img
        src={bgSrc}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover will-change-[opacity,transform] transform-gpu"
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />

      {/* Image OVERLAY : se fade-in puis on la "commit" en base */}
      <AnimatePresence>
        {fadeSrc && (
          <motion.img
            key={fadeSrc}
            src={fadeSrc}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover will-change-[opacity,transform] transform-gpu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            onAnimationComplete={(def) => {
              if (def === "animate") onFadeDone?.();
            }}
          />
        )}
      </AnimatePresence>

      {/* Overlay sombre léger */}
      <div className="absolute inset-0 bg-black/25" />
    </div>
  );
}
