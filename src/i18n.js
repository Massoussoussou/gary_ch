import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "fr",
    supportedLngs: ["fr", "en"],
    defaultNS: "common",
    ns: ["common"],

    detection: {
      // Priorité : URL path > localStorage > navigateur
      order: ["path", "localStorage", "navigator"],
      lookupFromPathIndex: 0, // /en/... → "en"
      caches: ["localStorage"],
    },

    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },

    interpolation: {
      escapeValue: false, // React gère déjà l'échappement
    },
  });

export default i18n;
