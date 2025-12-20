// src/components/brand/GaryMonogram.jsx
export default function GaryMonogram({ size = 96, color = "#E74C3C" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="GARY">
      <defs>
        <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000" floodOpacity="0.30" />
        </filter>
      </defs>
      {/* pastille blanche avec ombre douce */}
      <circle cx="50" cy="50" r="42" fill="white" filter="url(#softShadow)" />
      {/* G stylisé */}
      <path
        d="M50 18c-17.1 0-31 13.9-31 31s13.9 31 31 31c10.4 0 19.7-5 25.4-12.7l-9.6-7.4C62 64.9 56.4 67.8 50 67.8c-9.9 0-18-8.1-18-18s8.1-18 18-18c7.2 0 13.6 4.3 16.4 10.6H50v11h25V49C75 31.9 67.1 18 50 18z"
        fill={color}
      />
    </svg>
  );
}
