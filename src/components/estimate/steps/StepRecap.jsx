// src/components/estimate/steps/StepRecap.jsx
import useSendLead from "../../../hooks/useSendLead.js";
import { useLocale } from "../../../hooks/useLocale.js";

export default function StepRecap({ form, setForm }) {
  const { t } = useLocale();
  const { send, sending, error, success } = useSendLead();

  const formatAtouts = (at) => {
    const labels = {
      jardin: t("estimate_steps.atout_jardin"),
      piscine: t("estimate_steps.atout_piscine"),
      vue: t("estimate_steps.atout_vue"),
      garage: t("estimate_steps.atout_garage"),
      parkingInterieur: t("estimate_steps.atout_parking_int"),
      parkingExterieur: t("estimate_steps.atout_parking_ext"),
      cave: t("estimate_steps.atout_cave"),
      balcon: t("estimate_steps.atout_balcon"),
      terrasse: t("estimate_steps.atout_terrasse"),
    };
    const sized = {
      garage: "garageM2",
      cave: "caveM2",
      balcon: "balconM2",
      terrasse: "terrasseM2",
    };
    const items = [];
    for (const k of Object.keys(labels)) {
      if (form.atouts[k]) {
        let txt = labels[k];
        if (sized[k] && Number(form.atouts[sized[k]] || 0) > 0) {
          txt += ` (${form.atouts[sized[k]]} m²)`;
        }
        items.push(txt);
      }
    }
    return items.length ? items.join(", ") : "—";
  };

  const handleSubmit = async () => {
    const lines = [
      "[Demande d'estimation]",
      `Type : ${form.type || "—"} / ${form.sousType || "—"}`,
      `Localisation : ${form.ville || "—"} ${form.canton ? `(${form.canton})` : ""}`,
      `Année : ${form.annee || "—"}`,
      `Surface : ${form.surface || "—"} m² — Terrain : ${form.terrain || "—"} m²`,
      `Pièces/Chambres/SDE : ${form.pieces || "—"} / ${form.chambres || "—"} / ${form.sallesEau || "—"}`,
      `État : ${form.etat || "—"}`,
      `Atouts : ${formatAtouts(form.atouts)}`,
      form.adresse ? `Adresse : ${form.adresse}` : null,
    ].filter(Boolean);

    await send({
      sender_lastname: form.nom || "",
      sender_firstname: form.prenom || "",
      sender_email: form.email || "",
      sender_number: form.telephone || "",
      sender_message: lines.join("\n"),
    });
  };

  return (
    <div className="pt-2">
      <h3 className="font-serif text-2xl text-center">{t("estimate_steps.recap_title")}</h3>
      <div className="mt-6 grid md:grid-cols-2 gap-6 text-sm">
        <div className="bg-white/80 rounded-xl border border-black/10 p-4">
          <h4 className="font-semibold mb-3 text-lg md:text-xl">{t("estimate_steps.recap_property")}</h4>
          <div className="space-y-1.5 text-[15px] md:text-base leading-relaxed">
            <div>
              {t("estimate_steps.recap_type")} : <b className="font-semibold">{form.type || "—"}</b>
            </div>
            <div>
              {t("estimate_steps.recap_subtype")} :{" "}
              <b className="font-semibold">{form.sousType || "—"}</b>
            </div>
            <div>
              {t("estimate_steps.recap_location")} :{" "}
              <b className="font-semibold">
                {form.ville || "—"} {form.canton ? `(${form.canton})` : ""}
              </b>
            </div>
            <div>
              {t("estimate_steps.recap_year")} : <b className="font-semibold">{form.annee || "—"}</b>
            </div>
            <div>
              {t("estimate_steps.recap_surface")} : <b className="font-semibold">{form.surface || "—"} m²</b>{" "}
              — {t("estimate_steps.recap_land")} :{" "}
              <b className="font-semibold">{form.terrain || "—"} m²</b>
            </div>
            <div>
              {t("estimate_steps.recap_rooms_beds_baths")} :{" "}
              <b className="font-semibold">{form.pieces || "—"}</b> /{" "}
              <b className="font-semibold">{form.chambres || "—"}</b> /{" "}
              <b className="font-semibold">{form.sallesEau || "—"}</b>
            </div>
            <div>
              {t("estimate_steps.recap_condition")} : <b className="font-semibold">{form.etat || "—"}</b>
            </div>
            <div>
              {t("estimate_steps.recap_amenities")} :{" "}
              <b className="font-semibold">{formatAtouts(form.atouts)}</b>
            </div>
          </div>
        </div>

        <div className="bg-white/80 rounded-xl border border-black/10 p-4">
          <h4 className="font-semibold mb-2">{t("estimate_steps.recap_contact")}</h4>
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder={t("form.lastname")}
              className="rounded-lg border border-black/15 bg-white/90 px-3 py-2"
              value={form.nom}
              onChange={(e) =>
                setForm((f) => ({ ...f, nom: e.target.value }))
              }
            />
            <input
              placeholder={t("form.firstname")}
              className="rounded-lg border border-black/15 bg-white/90 px-3 py-2"
              value={form.prenom}
              onChange={(e) =>
                setForm((f) => ({ ...f, prenom: e.target.value }))
              }
            />
            <input
              placeholder={t("form.email")}
              className="rounded-lg border border-black/15 bg-white/90 px-3 py-2 col-span-2"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
            />
            <input
              placeholder={t("form.phone")}
              className="rounded-lg border border-black/15 bg-white/90 px-3 py-2 col-span-2"
              value={form.telephone}
              onChange={(e) =>
                setForm((f) => ({ ...f, telephone: e.target.value }))
              }
            />
            <input
              placeholder={t("estimate_steps.recap_address")}
              className="rounded-lg border border-black/15 bg-white/90 px-3 py-2 col-span-2"
              value={form.adresse}
              onChange={(e) =>
                setForm((f) => ({ ...f, adresse: e.target.value }))
              }
            />
          </div>

          {success && (
            <div className="mt-3 rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-green-800 text-sm">
              {t("estimate_steps.recap_success")}
            </div>
          )}
          {error && (
            <div className="mt-3 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-red-700 text-sm">
              {t("estimate_steps.recap_error", { error })}
            </div>
          )}

          <button
            className="mt-5 w-full px-6 py-3 rounded-xl text-white transition
                      hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0
                      focus:outline-none focus:ring-4 focus:ring-[rgba(255,74,62,0.25)]
                      disabled:opacity-60 disabled:cursor-wait"
            style={{ backgroundColor: "#FF4A3E" }}
            disabled={sending}
            onClick={handleSubmit}
          >
            {sending ? t("estimate_steps.recap_submitting") : t("estimate_steps.recap_submit")}
          </button>
        </div>
      </div>
    </div>
  );
}
