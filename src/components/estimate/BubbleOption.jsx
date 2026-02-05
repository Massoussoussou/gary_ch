// src/components/estimate/BubbleOption.jsx
import { motion } from "framer-motion";

const ORANGE = "#FF4A3E";

export default function BubbleOption({ icon: Icon, label, active, onClick }) {
  return (
    <div className="group flex flex-col items-center gap-3 w-[12rem] md:w-[13.5rem] shrink-0">
      <motion.button
        type="button"
        aria-label={label}
        aria-pressed={active}
        whileHover={{ y: -3, scale: 1.02 }}
        whileTap={{ scale: 0.985 }}
        onClick={onClick}
        className={`relative isolate overflow-hidden grid place-items-center
                   w-40 h-40 md:w-48 md:h-48 rounded-full border transition will-change-transform
                    ${
                      active
                        ? "bg-[var(--gary-primary,#FF4A3E)] border-[var(--gary-primary,#FF4A3E)] text-white shadow-xl shadow-[rgba(255,74,62,0.35)]"
                        : "bg-white/95 border-white/70 hover:border-white hover:shadow-2xl hover:shadow-black/20"
                    }`}
      >
        {active && (
          <>
            <motion.span
              className="absolute inset-0 rounded-full ring-8 ring-white/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className="absolute inset-0 rounded-full z-0 pointer-events-none"
              initial={{ scale: 0.2, opacity: 0.95 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ background: ORANGE }}
            />
          </>
        )}

        <Icon
          aria-hidden
          className={`relative z-10 w-14 h-14 md:w-16 md:h-16 ${active ? "text-white" : "text-black"}`}
        />
      </motion.button>

      {/* nom toujours visible */}
      <span className="text-base text-black leading-tight text-center drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]">
        {label}
      </span>
    </div>
  );
}
