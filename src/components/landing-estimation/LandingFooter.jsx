import React from "react";
import { GaryLogoRed } from "./icons";

export default function LandingFooter() {
  return (
    <footer className="footer">
      <a href="/" className="footer-logo" aria-label="GARY">
        <GaryLogoRed />
      </a>
      <div className="footer-links">
        <a href="/acheter">Nos biens</a>
        <a href="/vendre">Notre méthode</a>
        <a href="/a-propos">Nos courtiers</a>
        <a href="/contact">Contact</a>
        <a href="#">Mentions légales</a>
      </div>
    </footer>
  );
}
