import React from "react";
import { Link } from "react-router-dom";
import { GaryLogoRed } from "./icons";
import { useLocale } from "../../hooks/useLocale.js";

export default function LandingFooter() {
  const { t, link } = useLocale();
  return (
    <footer className="footer">
      <Link to={link("home")} className="footer-logo" aria-label="GARY">
        <GaryLogoRed />
      </Link>
      <div className="footer-links">
        <Link to={link("buy")}>{t("footer.our_properties")}</Link>
        <Link to={link("sell")}>{t("footer.our_method")}</Link>
        <Link to={link("about")}>{t("footer.our_brokers")}</Link>
        <Link to={link("contact")}>{t("footer.contact")}</Link>
        <Link to={link("legal")}>{t("footer.legal")}</Link>
      </div>
    </footer>
  );
}
