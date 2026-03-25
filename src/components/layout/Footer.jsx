// src/components/layout/Footer.jsx
import { Link } from "react-router-dom";
import { useLocale } from "../../hooks/useLocale.js";

export default function Footer() {
  const { t, lang, link } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0F1115] text-white/70 pt-14 pb-8" style={{ zIndex: 2 }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-8">
        {/* ── Top row: logo + nav links ── */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 mb-12">
          {/* Logo */}
          <Link to={link("home")} className="shrink-0" aria-label="GARY">
            <svg viewBox="0 0 1372 309" xmlns="http://www.w3.org/2000/svg" className="h-6 md:h-7 w-auto">
              <g fill="#FF4A3E">
                <path d="M12,156.2C12,72.9,73.2,9.4,162.1,9.4c58.5,0,102.7,25.5,127,62l-42.8,27.8c-15.7-26.5-44.7-44.1-84.2-44.1c-57.8,0-96.3,43.4-96.3,101.1c0,58.1,38.6,101.9,96.3,101.9c47.2,0,81-26.3,89.6-68.5h-92.5v-43.9h151c0,93.3-57.2,157.4-148.1,157.4C73.2,303,12,239.5,12,156.2z"/>
                <path d="M505.7,15.2h57l114.6,282.1h-53.5L594.4,223H474l-29.4,74.3h-53.3L505.7,15.2z M577.9,178.5L534.3,67.7l-43.8,110.7H577.9z"/>
                <path d="M787.6,15.2h100.4c69.1,0,101.1,32.2,101.1,80.2c0,40.1-26.1,71-76,77.3l110.3,124.5h-63.1L854.7,175.8h-16.5v121.5h-50.7V15.2z M883.7,134.1c34.7,0,51.4-13.2,51.4-38.2c0-24.9-16.7-38.2-51.4-38.2h-45.5v76.4H883.7z"/>
                <path d="M1192.1,177.1l-112.3-162h56.6l81.2,119.5l81.2-119.5h56.4l-112.4,162v120.1h-50.7V177.1z"/>
              </g>
            </svg>
          </Link>

          {/* Nav columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-16 gap-y-6 text-[13px]">
            {/* Column 1 */}
            <div className="space-y-3">
              <Link to={link("buy")} className="block hover:text-white transition-colors">{t("footer.our_properties")}</Link>
              <Link to={link("sell")} className="block hover:text-white transition-colors">{t("footer.our_method")}</Link>
              <Link to={link("estimate")} className="block hover:text-white transition-colors">{t("nav.estimate")}</Link>
            </div>
            {/* Column 2 */}
            <div className="space-y-3">
              <Link to={link("newProjects")} className="block hover:text-white transition-colors">{t("nav.new_projects")}</Link>
              <Link to={link("about")} className="block hover:text-white transition-colors">{t("footer.our_brokers")}</Link>
              <Link to={link("contact")} className="block hover:text-white transition-colors">{t("footer.contact")}</Link>
            </div>
            {/* Column 3 */}
            <div className="space-y-3">
              <Link to={link("news")} className="block hover:text-white transition-colors">{t("nav.news")}</Link>
              <Link to={link("legal")} className="block hover:text-white transition-colors">{t("footer.legal")}</Link>
              <Link to={link("privacy")} className="block hover:text-white transition-colors">
                {lang === "en" ? "Privacy Policy" : "Confidentialit\u00e9"}
              </Link>
            </div>
          </div>

          {/* Contact info */}
          <div className="text-[13px] space-y-2 shrink-0">
            <a href="tel:+41225570700" className="block hover:text-white transition-colors">+41 22 557 07 00</a>
            <a href="mailto:contact@gary.ch" className="block hover:text-white transition-colors">contact@gary.ch</a>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-white/10 mb-6" />

        {/* ── Bottom row ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-white/30">
          <p>&copy; {year} GARY. {lang === "en" ? "All rights reserved." : "Tous droits r\u00e9serv\u00e9s."}</p>
          <p>
            {lang === "en" ? "Website by" : "Site r\u00e9alis\u00e9 par"}{" "}
            <span className="text-white/50">T&M</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
