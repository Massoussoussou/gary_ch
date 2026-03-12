// src/components/AlreadyOwner.jsx
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function CalculatorIcon({ className = "w-8 h-8", strokeWidth = 1.5 }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"
      className={className} stroke="currentColor" strokeWidth={strokeWidth}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M8 7h8M7 12h4M7 16h4M13.5 12h3.5M13.5 16h3.5" />
    </svg>
  );
}
CalculatorIcon.propTypes = { className: PropTypes.string, strokeWidth: PropTypes.number };

function HandshakeIcon({ className = "w-8 h-8", strokeWidth = 1.5 }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"
      className={className} stroke="currentColor" strokeWidth={strokeWidth}>
      <path d="M7.5 12.5 10 10l3 3 2.5-2.5a3.5 3.5 0 1 1 5 5l-3.4 3.4a3 3 0 0 1-4.2 0l-.6-.6-.6.6a3 3 0 0 1-4.2 0L5 16.5" />
      <path d="M2 7h5l3 3m9-3h-5l-2 2" />
    </svg>
  );
}
HandshakeIcon.propTypes = { className: PropTypes.string, strokeWidth: PropTypes.number };

function Tile({ title, subtitle, Icon, onClick, to }) {
  const Element = to ? Link : "button";
  const commonClass = `group relative isolate w-full text-left
    border border-zinc-200 bg-white px-10 py-12 md:py-14
    transition-transform duration-300
    hover:-translate-y-0.5 focus-visible:outline-none
    focus-visible:ring-2 focus-visible:ring-black/10
    shadow-[0_0_0_1px_rgba(0,0,0,0.02)] block`;

  return (
    <Element
      {...(to ? { to } : { type: "button", onClick })}
      aria-label={title}
      className={commonClass}
    >
      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] origin-right scale-x-0 bg-[#FF4A3E] transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100"
        aria-hidden="true"
      />
      <div className="flex items-start gap-5">
        <div className="mt-1 shrink-0 text-zinc-800 group-hover:text-[#FF4A3E] transition-colors">
          <Icon className="w-9 h-9 md:w-10 md:h-10" />
        </div>
        <div className="min-w-0">
          <h3 className="font-serif tracking-tight leading-none text-[clamp(1.6rem,3vw,2.2rem)] text-zinc-900">
            {title}
          </h3>
          {subtitle ? <p className="mt-2 text-[15px] text-zinc-600">{subtitle}</p> : null}
          <div className="mt-6 text-[15px] font-medium text-zinc-900/70 group-hover:text-[#FF4A3E]">
            Découvrir <span aria-hidden>→</span>
          </div>
        </div>
      </div>
    </Element>
  );
}
Tile.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  Icon: PropTypes.elementType.isRequired,
  onClick: PropTypes.func,
  to: PropTypes.string,
};

export default function AlreadyOwner({
  onEstimate,
  onSell,
  toEstimate,
  toSell,
  title = "Déjà propriétaire ?",
  className = "",
}) {
  return (
    <section className={`bg-[#FAFAFA] py-14 md:py-20 ${className} relative z-10`}>
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/*<h2 className="mb-10 md:mb-12 font-serif tracking-tight leading-[0.95] text-[clamp(2rem,5vw,3.4rem)] text-zinc-900">
          {title}
  </h2>*/}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <Tile
            title="Estimer mon bien"
            subtitle="Estimation précise et gratuite, réalisée par un expert local."
            Icon={CalculatorIcon}
            onClick={onEstimate}
            to={toEstimate}
          />
          <Tile
            title="Confier une vente"
            subtitle="Stratégie de mise en marché haut de gamme et accompagnement complet."
            Icon={HandshakeIcon}
            onClick={onSell}
            to={toSell}
          />
        </div>
      </div>
    </section>
  );
}
AlreadyOwner.propTypes = {
  onEstimate: PropTypes.func,
  onSell: PropTypes.func,
  toEstimate: PropTypes.string,
  toSell: PropTypes.string,
  title: PropTypes.string,
  className: PropTypes.string,
};
