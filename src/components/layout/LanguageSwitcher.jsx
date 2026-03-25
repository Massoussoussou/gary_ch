import { useLocale } from "../../hooks/useLocale.js";

export default function LanguageSwitcher({ className = "" }) {
  const { lang, switchLanguage } = useLocale();

  return (
    <button
      type="button"
      onClick={() => switchLanguage(lang === "fr" ? "en" : "fr")}
      className={`text-[13px] uppercase tracking-[0.1em] font-medium transition-colors duration-200 hover:text-[#FF4A3E] ${className}`}
      aria-label={lang === "fr" ? "Switch to English" : "Passer en français"}
    >
      {lang === "fr" ? "EN" : "FR"}
    </button>
  );
}
