import React from "react";
import { useLocale } from "../../hooks/useLocale.js";

const portalOptions = ["Homegate", "ImmoScout24", "Immobilier.ch", "Autre"];

export default function FormStep2({ data, onChange, onNext, stepState }) {
  const { t } = useLocale();
  const projectOptions = t("estimate.form2.project_options", { returnObjects: true });
  const durationOptions = t("estimate.form2.duration_options", { returnObjects: true });
  const update = (field, value) => onChange({ ...data, [field]: value });

  const togglePortal = (portal) => {
    const current = data.portals || [];
    const next = current.includes(portal)
      ? current.filter((p) => p !== portal)
      : [...current, portal];
    update("portals", next);
  };

  return (
    <div className={`form-step ${stepState}`}>
      <div className="form-step-header">
        <div className={`form-step-num ${stepState === "expanded" ? "active" : stepState === "collapsed" && data.project ? "done" : "pending"}`}>
          {stepState === "collapsed" && data.project ? "\u2713" : "2"}
        </div>
        <span className={`form-step-label ${stepState === "expanded" ? "active" : stepState === "collapsed" && data.project ? "done" : "pending"}`}>
          {t("estimate.form2.step_label")}
        </span>
        <div className="form-step-line" />
      </div>

      <div className="form-group">
        <label htmlFor="project">{t("estimate.form2.where_are_you")}</label>
        <select
          id="project"
          value={data.project}
          onChange={(e) => update("project", e.target.value)}
        >
          <option value="" disabled>{t("estimate.form2.select")}</option>
          {projectOptions.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>{t("estimate.form2.already_selling")}</label>
        <div className="toggle-row">
          <button
            type="button"
            className={`toggle-btn${data.alreadySelling === "non" ? " active" : ""}`}
            onClick={() => update("alreadySelling", "non")}
          >
            {t("estimate.form2.no")}
          </button>
          <button
            type="button"
            className={`toggle-btn${data.alreadySelling === "oui" ? " active" : ""}`}
            onClick={() => update("alreadySelling", "oui")}
          >
            {t("estimate.form2.yes_with_agency")}
          </button>
        </div>
      </div>

      <div className={`expand-section${data.alreadySelling === "oui" ? " open" : ""}`}>
        <div className="expand-inner">
          <div className="expand-hint">
            {t("estimate.form2.expand_hint")}
          </div>
          <div className="form-group">
            <label htmlFor="sellingDuration">{t("estimate.form2.how_long")}</label>
            <select
              id="sellingDuration"
              value={data.sellingDuration || ""}
              onChange={(e) => update("sellingDuration", e.target.value)}
            >
              <option value="" disabled>{t("estimate.form2.select")}</option>
              {durationOptions.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>{t("estimate.form2.which_portals")}</label>
            <div className="checkbox-row">
              {portalOptions.map((portal) => (
                <label className="checkbox-label" key={portal}>
                  <input
                    type="checkbox"
                    checked={(data.portals || []).includes(portal)}
                    onChange={() => togglePortal(portal)}
                  />
                  <span>{portal}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>{t("estimate.form2.price_reduced")}</label>
            <div className="toggle-row">
              {["non", "oui", "nsp"].map((val) => (
                <button
                  type="button"
                  key={val}
                  className={`toggle-btn${data.priceReduced === val ? " active" : ""}`}
                  onClick={() => update("priceReduced", val)}
                >
                  {val === "non" ? t("estimate.form2.no") : val === "oui" ? t("estimate.form2.yes") : t("estimate.form2.dont_know")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button type="button" className="form-next" onClick={onNext}>
        {t("estimate.form2.last_step")} &rarr;
      </button>
    </div>
  );
}
