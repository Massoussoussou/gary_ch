// src/components/forms/TabsDemandType.jsx

export default function TabsDemandType({
  type,
  onChange,
  types = ["Achat", "Vente", "Estimation", "Autre"],
}) {
  return (
    <div className="flex justify-center">
      <div
        className="
          inline-flex items-center justify-center
          flex-wrap gap-2
          rounded-2xl sm:rounded-full
          border border-black/10 bg-black/5
          px-3 py-2
          max-w-full
        "
      >
        {types.map((t) => {
          const active = t === type;
          return (
            <button
              key={t}
              type="button"
              onClick={() => onChange(t)}
              className={[
                "px-4 py-2 rounded-full uppercase tracking-[0.10em] text-[12px] font-semibold",
                "transition-colors border",
                active
                  ? "bg-[#FF4A3E] text-white border-[#FF4A3E]"
                  : "bg-white/80 text-black/70 border-black/10 hover:bg-white",
              ].join(" ")}
            >
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
}
