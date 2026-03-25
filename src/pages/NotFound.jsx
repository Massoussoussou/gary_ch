import { Link } from "react-router-dom";
import { useLocale } from "../hooks/useLocale.js";

export default function NotFound(){
  const { t, link } = useLocale();

  return (
    <div className="page-bg min-h-screen">
    <div className="max-w-xl mx-auto px-4 py-10 text-center">
      <h1 className="font-serif text-3xl">{t("not_found.title")}</h1>
      <p className="text-muted mt-2">{t("not_found.message")}</p>
      <Link to={link("home")} className="mt-4 inline-block text-brand">{t("not_found.back_home")}</Link>
    </div>
    </div>
  )
}
