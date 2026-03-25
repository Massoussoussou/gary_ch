import { useLocale } from "../hooks/useLocale.js";

export default function SortMenu({value, onChange}){
  const { t } = useLocale();
  return (
    <div className="max-w-6xl mx-auto px-4 mt-3 flex justify-end">
      <select value={value} onChange={e=>onChange(e.target.value)} aria-label={t("filters.sort_properties")} className="border border-line rounded-lg px-3 py-2 bg-white">
        <option value="recent">{t("filters.sort_recent")}</option>
        <option value="prix-asc">{t("filters.sort_price_asc")}</option>
        <option value="prix-desc">{t("filters.sort_price_desc")}</option>
        <option value="surface">{t("filters.sort_surface")}</option>
      </select>
    </div>
  )
}
