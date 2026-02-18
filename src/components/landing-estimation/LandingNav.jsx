import React, { useState, useEffect } from "react";
import { GaryLogoWhite } from "./icons";

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToForm = (e) => {
    e.preventDefault();
    const el = document.getElementById("form");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`}>
      <a href="/" className="nav-logo" aria-label="GARY">
        <GaryLogoWhite />
      </a>
      <div className="nav-right">
        <a href="tel:+41225570700" className="nav-phone" aria-label="Appeler GARY">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
          +41 22 557 07 00
        </a>
        <button className="nav-cta" onClick={scrollToForm}>
          Estimer mon bien
        </button>
      </div>
    </nav>
  );
}
