// src/components/sell/StepsSection.jsx
import { AnimatePresence, motion } from "framer-motion";
import StepTabs from "./StepTabs";
import StepContent from "./StepContent";

export default function StepsSection({ steps, stepImages, active, setActive }) {
  return (
    <section id="etapes" className="bg-[#EFECE7]">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-start">
          {/* Gauche */}
          <div className="col-span-12 lg:col-span-7">
            <StepTabs steps={steps} active={active} onChange={setActive} />
            <StepContent step={steps[active]} />
          </div>

          {/* Droite : image carrée luxe */}
          <div className="col-span-12 lg:col-span-5">
            <div className="ml-auto max-w-[min(82vh,46rem)] w-full aspect-square
                            bg-white overflow-hidden rounded-none
                            border border-[#E1DBD3] ring-1 ring-black/5
                            shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={active}
                  src={stepImages[active] || stepImages[0]}
                  alt={steps[active].title}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.01 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className="h-full w-full object-cover"
                />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
