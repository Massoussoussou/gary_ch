// src/components/common/BeigeOrnament.jsx

export default function BeigeOrnament({ className = "" }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 ${className}`}
    >
      <div className="absolute left-[5%] top-[10%] h-[26rem] w-[26rem] bg-[#FAF0E6]/40 blur-3xl" />
      <div className="absolute right-[2%] top-[35%] h-[22rem] w-[22rem] bg-[#FF4A3E]/8 blur-3xl" />
    </div>
  );
}
