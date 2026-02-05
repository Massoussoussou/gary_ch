// src/components/estimate/steps/StepLocalisation.jsx

export default function StepLocalisation({ value, onChange }) {
  const update = (k, v) => onChange({ ...value, [k]: v });
  const villes = [
    "Genève",
    "Cologny",
    "Chêne-Bourg",
    "Neuchâtel",
    "Lausanne",
    "Montreux",
  ];
  const cantons = ["GE", "VD", "VS", "NE", "FR", "TI"];

  return (
    <div>
      <h3 className="font-serif text-2xl text-center">Où se situe le bien ?</h3>
      <p className="text-black/60 mt-1 text-center">
        Commune, canton et (facultatif) année de construction.
      </p>

      <div className="mt-6 grid md:grid-cols-3 gap-5">
        <div>
          <label className="text-sm text-black/70">Ville</label>
          <input
            list="villes"
            placeholder="ex. Genève"
            className="w-full rounded-xl border border-black/15 bg-white/90 pl-3 pr-3 py-2 focus:outline-none focus:ring-4 focus:ring-[rgba(255,74,62,0.25)]"
            value={value.ville}
            onChange={(e) => update("ville", e.target.value)}
          />
          <datalist id="villes">
            {villes.map((v) => (
              <option key={v} value={v} />
            ))}
          </datalist>
        </div>

        <div>
          <label className="text-sm text-black/70">Canton</label>
          <input
            list="cantons"
            placeholder="ex. GE"
            className="w-full rounded-xl border border-black/15 bg-white/90 pl-3 pr-3 py-2 focus:outline-none focus:ring-4 focus:ring-[rgba(255,74,62,0.25)]"
            value={value.canton}
            onChange={(e) => update("canton", e.target.value.toUpperCase())}
          />
          <datalist id="cantons">
            {cantons.map((v) => (
              <option key={v} value={v} />
            ))}
          </datalist>
        </div>

        <div>
          <label className="text-sm text-black/70">Année</label>
          <input
            type="number"
            placeholder="ex. 2008"
            className="w-full rounded-xl border border-black/15 bg-white/90 pl-3 pr-3 py-2 focus:outline-none focus:ring-4 focus:ring-[rgba(255,74,62,0.25)]"
            value={value.annee}
            onChange={(e) => update("annee", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
