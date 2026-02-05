// src/components/forms/FieldNum.jsx

export default function FieldNum({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm text-black/70">{label}</label>
      <input
        type="number"
        inputMode="numeric"
        className="w-full rounded-xl border border-black/15 bg-white/90 pl-3 pr-3 py-2
                   focus:outline-none focus:ring-4 focus:ring-[rgba(255,74,62,0.25)]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
