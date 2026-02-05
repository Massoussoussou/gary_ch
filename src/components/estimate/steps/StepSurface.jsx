// src/components/estimate/steps/StepSurface.jsx
import FieldNum from "../../forms/FieldNum.jsx";

export default function StepSurface({ value, onChange }) {
  const update = (k, v) => onChange({ ...value, [k]: v });

  return (
    <div>
      <h3 className="font-serif text-2xl text-center">Surface & composition</h3>
      <p className="text-black/60 mt-1 text-center">
        Indiquez les surfaces et les pièces principales.
      </p>

      <div className="mt-6 grid md:grid-cols-3 gap-5">
        <FieldNum
          label="Surface habitable (m²)"
          value={value.surface}
          onChange={(v) => update("surface", v)}
        />
        <FieldNum
          label="Terrain (m²)"
          value={value.terrain}
          onChange={(v) => update("terrain", v)}
        />
        <FieldNum
          label="Pièces"
          value={value.pieces}
          onChange={(v) => update("pieces", v)}
        />
        <FieldNum
          label="Chambres"
          value={value.chambres}
          onChange={(v) => update("chambres", v)}
        />
        <FieldNum
          label="Salles d'eau"
          value={value.sallesEau}
          onChange={(v) => update("sallesEau", v)}
        />
      </div>
    </div>
  );
}
