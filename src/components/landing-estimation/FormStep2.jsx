import React from "react";

const projectOptions = [
  "Je veux vendre dans les 3 mois",
  "Je veux vendre dans les 6 mois",
  "Je réfléchis encore",
  "Je veux juste connaître la valeur",
];

const durationOptions = [
  "Moins d'un mois",
  "1 à 3 mois",
  "3 à 6 mois",
  "Plus de 6 mois",
];

const portalOptions = ["Homegate", "ImmoScout24", "Immobilier.ch", "Autre"];

export default function FormStep2({ data, onChange, onNext, stepState }) {
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
          Votre projet
        </span>
        <div className="form-step-line" />
      </div>

      <div className="form-group">
        <label htmlFor="project">Où en êtes-vous ?</label>
        <select
          id="project"
          value={data.project}
          onChange={(e) => update("project", e.target.value)}
        >
          <option value="" disabled>Sélectionner</option>
          {projectOptions.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Votre bien est-il déjà en vente ?</label>
        <div className="toggle-row">
          <button
            type="button"
            className={`toggle-btn${data.alreadySelling === "non" ? " active" : ""}`}
            onClick={() => update("alreadySelling", "non")}
          >
            Non
          </button>
          <button
            type="button"
            className={`toggle-btn${data.alreadySelling === "oui" ? " active" : ""}`}
            onClick={() => update("alreadySelling", "oui")}
          >
            Oui, avec une agence
          </button>
        </div>
      </div>

      <div className={`expand-section${data.alreadySelling === "oui" ? " open" : ""}`}>
        <div className="expand-inner">
          <div className="expand-hint">
            Ces informations nous permettent d'identifier ce qui peut être amélioré.
          </div>
          <div className="form-group">
            <label htmlFor="sellingDuration">Depuis combien de temps ?</label>
            <select
              id="sellingDuration"
              value={data.sellingDuration || ""}
              onChange={(e) => update("sellingDuration", e.target.value)}
            >
              <option value="" disabled>Sélectionner</option>
              {durationOptions.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Sur quels portails ?</label>
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
            <label>Prix déjà baissé ?</label>
            <div className="toggle-row">
              {["non", "oui", "nsp"].map((val) => (
                <button
                  type="button"
                  key={val}
                  className={`toggle-btn${data.priceReduced === val ? " active" : ""}`}
                  onClick={() => update("priceReduced", val)}
                >
                  {val === "non" ? "Non" : val === "oui" ? "Oui" : "Je ne sais pas"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button type="button" className="form-next" onClick={onNext}>
        Dernière étape &rarr;
      </button>
    </div>
  );
}
