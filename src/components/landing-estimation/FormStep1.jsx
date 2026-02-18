import React from "react";
import AddressAutocomplete from "./AddressAutocomplete";

const propertyTypes = [
  "Appartement",
  "Maison individuelle",
  "Villa mitoyenne",
  "Immeuble",
  "Terrain",
];

const roomOptions = ["1-2", "3", "4", "5", "6", "7+"];
const surfaceOptions = [
  "< 50 m\u00B2",
  "50-80 m\u00B2",
  "80-120 m\u00B2",
  "120-180 m\u00B2",
  "180-250 m\u00B2",
  "250+ m\u00B2",
];

export default function FormStep1({ data, onChange, onNext, stepState }) {
  const update = (field, value) => onChange({ ...data, [field]: value });

  const handleAddressSelect = (addr) => {
    onChange({
      ...data,
      address: addr.street,
      npa: addr.npa || data.npa,
      city: addr.city || data.city,
    });
  };

  return (
    <div className={`form-step ${stepState}`}>
      <div className="form-step-header">
        <div className={`form-step-num ${stepState === "expanded" ? "active" : stepState === "collapsed" && data.type ? "done" : "pending"}`}>
          {stepState === "collapsed" && data.type ? "\u2713" : "1"}
        </div>
        <span className={`form-step-label ${stepState === "expanded" ? "active" : stepState === "collapsed" && data.type ? "done" : "pending"}`}>
          Votre bien
        </span>
        <div className="form-step-line" />
      </div>

      <div className="form-group">
        <label htmlFor="propertyType">Type de bien</label>
        <select
          id="propertyType"
          value={data.type}
          onChange={(e) => update("type", e.target.value)}
        >
          <option value="" disabled>Sélectionner</option>
          {propertyTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="rooms">Pièces</label>
          <select
            id="rooms"
            value={data.rooms}
            onChange={(e) => update("rooms", e.target.value)}
          >
            <option value="" disabled>Pièces</option>
            {roomOptions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="surface">Surface</label>
          <select
            id="surface"
            value={data.surface}
            onChange={(e) => update("surface", e.target.value)}
          >
            <option value="" disabled>Surface</option>
            {surfaceOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <AddressAutocomplete
        value={data.address}
        onChange={(v) => update("address", v)}
        onSelect={handleAddressSelect}
      />

      <div className="form-row-3">
        <div className="form-group">
          <label htmlFor="fieldNpa">NPA</label>
          <input
            type="text"
            id="fieldNpa"
            placeholder="1200"
            value={data.npa}
            onChange={(e) => update("npa", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="fieldCity">Localité</label>
          <input
            type="text"
            id="fieldCity"
            placeholder="Genève"
            value={data.city}
            onChange={(e) => update("city", e.target.value)}
          />
        </div>
      </div>

      <button type="button" className="form-next" onClick={onNext}>
        Continuer &rarr;
      </button>
    </div>
  );
}
