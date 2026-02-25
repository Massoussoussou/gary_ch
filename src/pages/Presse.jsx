import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import articlesData from "../data/actualites.json";

const pressArticles = articlesData.filter((a) => a.category === "Presse");

const EASE_SMOOTH = [0.22, 1, 0.36, 1];

const categoryColors = {
  Presse: "bg-[#2563eb] text-white",
};

function PressCard({ article, index }) {
  const stagger = (index % 3) * 0.1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-6%" }}
      transition={{ duration: 0.7, ease: EASE_SMOOTH, delay: stagger }}
    >
      <Link
        to={`/actualites/${article.id}`}
        className="group block transition-transform duration-500 ease-out hover:-translate-y-1"
      >
        <motion.div
          className="relative overflow-hidden aspect-[3/2]"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          whileInView={{ clipPath: "inset(0 0 0% 0)" }}
          viewport={{ once: true, margin: "-3%" }}
          transition={{ duration: 0.9, ease: EASE_SMOOTH, delay: stagger + 0.1 }}
        >
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
            loading="lazy"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all duration-500">
            <span className="text-white text-[13px] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500 flex items-center gap-2">
              Lire
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>
          <span className={`absolute top-4 left-4 px-3 py-1 text-[11px] uppercase tracking-[0.15em] font-medium ${categoryColors.Presse}`}>
            Presse
          </span>
        </motion.div>

        <div className="pt-5 pb-2">
          <p className="text-[12px] tracking-[0.12em] uppercase text-neutral-400 mb-2">
            {article.date}
          </p>
          <h2 className="font-serif text-[18px] md:text-[20px] leading-snug text-neutral-900 line-clamp-2 group-hover:text-[#FF4A3E] transition-colors duration-300">
            {article.title}
          </h2>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Presse() {
  return (
    <main className="min-h-screen bg-white text-[#0F1115]">
      <section className="pt-20 md:pt-28 pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center mb-16 md:mb-20">
            <p className="text-[12px] md:text-[13px] uppercase tracking-[0.2em] text-neutral-500 mb-3">
              Ils parlent de nous
            </p>
            <h1 className="font-serif tracking-[-0.03em] leading-[1.05] text-[clamp(2.4rem,8vw,4rem)]">
              Presse
            </h1>
            <p className="mt-4 text-[clamp(1rem,1.8vw,1.15rem)] text-neutral-600 max-w-[48ch] mx-auto">
              GARY dans les médias : interviews, articles et reportages.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14 md:gap-y-16">
            {pressArticles.map((article, i) => (
              <PressCard key={article.id} article={article} index={i} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
