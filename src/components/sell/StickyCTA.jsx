// src/components/sell/StickyCTA.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function StickyCTA() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 140);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className={[
      "fixed z-40 left-0 right-0 bottom-5 md:bottom-6 flex justify-center pointer-events-none",
      show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
      "transition"
    ].join(" ")}>
      <div className="pointer-events-auto bg-white/90 backdrop-blur px-3 py-3 border border-[#E1DBD3] shadow-lg rounded-none">
        <div className="flex gap-2">
          <Link to="/contact" className="px-5 py-2.5 bg-primary text-white rounded-none">Prendre RDV</Link>
          <Link to="/estimer" className="px-5 py-2.5 border border-[#DCD6CE] bg-white rounded-none">Estimer en ligne</Link>
        </div>
      </div>
    </div>
  );
}
