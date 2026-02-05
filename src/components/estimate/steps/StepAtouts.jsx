// src/components/estimate/steps/StepAtouts.jsx
import BubbleOption from "../BubbleOption.jsx";
import {
  IconLeaf,
  IconWaves,
  IconMountain,
  IconCar,
  IconParking,
  IconBox,
  IconBalcony,
  IconTerrace,
} from "../../icons/estimate.jsx";

export default function StepAtouts({ value, onChange }) {
  const toggle = (k) => {
    const next = { ...value, [k]: !value[k] };
    // nettoyer la surface si on désactive
    if (!next[k]) {
      if (k === "garage") next.garageM2 = "";
      if (k === "cave") next.caveM2 = "";
      if (k === "balcon") next.balconM2 = "";
      if (k === "terrasse") next.terrasseM2 = "";
    }
    onChange(next);
  };

  // 9 atouts (4 + 4 + 1)
  const atouts = [
    { k: "jardin", label: "Jardin", Icon: IconLeaf },
    { k: "piscine", label: "Piscine", Icon: IconWaves },
    { k: "vue", label: "Vue d'exception", Icon: IconMountain },
    { k: "garage", label: "Garage/Box", Icon: IconCar, size: "garageM2" },
    { k: "parkingInterieur", label: "Parking intérieur", Icon: IconParking },
    { k: "parkingExterieur", label: "Parking extérieur", Icon: IconParking },
    { k: "cave", label: "Cave", Icon: IconBox, size: "caveM2" },
    { k: "balcon", label: "Balcon", Icon: IconBalcony, size: "balconM2" },
    { k: "terrasse", label: "Terrasse", Icon: IconTerrace, size: "terrasseM2" },
  ];

  const top8 = atouts.slice(0, 8);
  const last = atouts[8];

  return (
    <div className="text-center">
      <h3 className="font-serif text-2xl">Atouts du bien</h3>
      <p className="text-black/60 mt-1">
        Sélectionnez vos atouts. Ajoutez la surface quand c'est pertinent.
      </p>

      {/* 2 lignes de 4 */}
      <div className="mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-5 md:gap-y-6 gap-x-2 md:gap-x-3 place-items-center">
          {top8.map(({ k, label, Icon }) => (
            <div key={k} className="justify-self-center">
              <BubbleOption
                icon={Icon}
                label={label}
                active={!!value[k]}
                onClick={() => toggle(k)}
              />
            </div>
          ))}

          {/* dernière ligne : 1 seul élément centré */}
          <div className="col-span-2 md:col-span-4 flex justify-center">
            <BubbleOption
              icon={last.Icon}
              label={last.label}
              active={!!value[last.k]}
              onClick={() => toggle(last.k)}
            />
          </div>
        </div>
      </div>

      {/* champs m² pour les atouts actifs qui en ont besoin */}
      <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-left">
        {atouts
          .filter((a) => a.size && value[a.k])
          .map(({ k, label, size }) => (
            <div key={k}>
              <label className="text-sm text-black/70">
                {label} — Surface (m²)
              </label>
              <input
                type="number"
                inputMode="numeric"
                placeholder="m²"
                className="w-full rounded-xl border border-black/15 bg-white/90 pl-3 pr-3 py-2 focus:outline-none focus:ring-4 focus:ring-[rgba(255,74,62,0.25)]"
                value={value[size] || ""}
                onChange={(e) => onChange({ ...value, [size]: e.target.value })}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
