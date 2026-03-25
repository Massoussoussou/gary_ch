import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import articlesFr from "../data/actualites.json";
import articlesEn from "../data/actualites_en.json";

/**
 * Retourne les articles dans la langue courante.
 * Exclut les articles "Presse" (affichés sur une page dédiée).
 */
export function useArticles({ includePresse = false } = {}) {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  return useMemo(() => {
    const data = lang === "en" ? articlesEn : articlesFr;
    return includePresse ? data : data.filter((a) => a.category !== "Presse");
  }, [lang, includePresse]);
}

/**
 * Retourne un article par ID dans la langue courante.
 */
export function useArticleById(id) {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  return useMemo(() => {
    const data = lang === "en" ? articlesEn : articlesFr;
    return data.find((a) => a.id === parseInt(id)) || null;
  }, [lang, id]);
}
