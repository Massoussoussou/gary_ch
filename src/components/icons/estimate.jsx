// src/components/icons/estimate.jsx
// Icônes du wizard d'estimation

const commonIconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: "w-12 h-12 md:w-14 md:h-14",
};

const subIconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: "w-16 h-16 md:w-18 md:h-18",
};

// --- Icônes Atouts ---
export function IconLeaf(props) {
  return (
    <svg {...commonIconProps} {...props}>
      <path d="M5 12c7-7 14-6 14-6s1 7-6 14c-5 5-10 1-10-4 0-2 1-3 2-4" />
    </svg>
  );
}

export function IconWaves(props) {
  return (
    <svg {...commonIconProps} {...props}>
      <path d="M3 12c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2" />
      <path d="M3 16c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2" />
    </svg>
  );
}

export function IconMountain(props) {
  return (
    <svg {...commonIconProps} {...props}>
      <path d="M3 20l7-12 3 5 2-3 6 10H3z" />
      <path d="M10 8l1.5 2.5" />
    </svg>
  );
}

export function IconCar(props) {
  return (
    <svg {...commonIconProps} {...props}>
      <path d="M3 13l2-6h14l2 6" />
      <path d="M5 16h14" />
      <circle cx="7.5" cy="17.5" r="1.5" />
      <circle cx="16.5" cy="17.5" r="1.5" />
    </svg>
  );
}

export function IconParking(props) {
  return (
    <svg {...commonIconProps} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 17V7h4a3 3 0 0 1 0 6h-4" />
    </svg>
  );
}

export function IconBox(props) {
  return (
    <svg {...commonIconProps} {...props}>
      <path d="M21 8l-9-5-9 5 9 5 9-5z" />
      <path d="M12 13v8" />
      <path d="M3 8v8l9 5 9-5V8" />
    </svg>
  );
}

export function IconBalcony(props) {
  return (
    <svg {...commonIconProps} {...props}>
      <path d="M4 10h16" />
      <path d="M6 10V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4" />
      <path d="M6 14h12M6 18h12" />
      <path d="M6 14v4M10 14v4M14 14v4M18 14v4" />
    </svg>
  );
}

export function IconTerrace(props) {
  return (
    <svg {...commonIconProps} {...props}>
      <path d="M3 20h18" />
      <path d="M6 20V12l6-3 6 3v8" />
      <path d="M9 9l3-3 3 3" />
    </svg>
  );
}

// --- Icônes État ---
export function IconSparkle(props) {
  return (
    <svg {...commonIconProps} {...props}>
      <path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3z" />
      <path d="M5 18l1-2 2-1-2-1-1-2-1 2-2 1 2 1 1 2z" />
      <path d="M18 5l.7 1.6L20 7l-1.3.4L18 9l-.7-1.6L16 7l1.3-.4L18 5z" />
    </svg>
  );
}

export function IconRoller(props) {
  return (
    <svg {...commonIconProps} {...props}>
      <rect x="3" y="4" width="10" height="6" rx="2" />
      <path d="M13 7h4a2 2 0 0 1 2 2v1" />
      <path d="M12 10v6" />
      <rect x="10.5" y="16" width="3" height="5" rx="1" />
    </svg>
  );
}

export function IconWrench(props) {
  return (
    <svg {...commonIconProps} {...props}>
      <path d="M14 7a4 4 0 0 0-5.7 5.6l-4.6 4.6a2 2 0 1 0 2.8 2.8l4.6-4.6A4 4 0 0 0 14 7z" />
      <circle cx="14.5" cy="6.5" r="1" />
    </svg>
  );
}

export function IconHardHat(props) {
  return (
    <svg {...commonIconProps} {...props}>
      <path d="M3 19h18" />
      <path d="M6 19v-3a6 6 0 0 1 12 0v3" />
      <path d="M12 7V4" />
      <path d="M9 11V7" />
      <path d="M15 11V7" />
    </svg>
  );
}

// --- Icônes Maisons ---
export function IconDetached(props) {
  return (
    <svg {...subIconProps} {...props}>
      <path d="M3 11l9-7 9 7" />
      <path d="M6 10v10h12V10" />
      <path d="M10 20v-5h4v5" />
      <path d="M4 14h4" />
      <path d="M16 14h4" />
    </svg>
  );
}

export function IconSemi(props) {
  return (
    <svg {...subIconProps} {...props}>
      <path d="M3 11l9-7 9 7" />
      <path d="M12 4v16" />
      <path d="M6 10v10h6" />
      <path d="M18 10v10h-6" />
    </svg>
  );
}

export function IconRow(props) {
  return (
    <svg {...subIconProps} {...props}>
      <path d="M2 12L6 8L10 12" />
      <path d="M10 12L14 8L18 12" />
      <path d="M18 12L22 8.5L22 12" />
      <rect x="2" y="12" width="20" height="8" rx="1" />
      <path d="M10 12V20" />
      <path d="M18 12V20" />
      <path d="M6 20v-3" />
      <path d="M14 20v-3" />
      <path d="M20 20v-3" />
    </svg>
  );
}

export function IconCorner(props) {
  return (
    <svg {...subIconProps} {...props}>
      <path d="M4 20V8l8-5 8 5v12" />
      <path d="M12 3v17" />
      <path d="M12 12h8" />
    </svg>
  );
}

export function IconHouseOther(props) {
  return (
    <svg {...subIconProps} {...props}>
      <path d="M3 11l9-7 9 7" />
      <path d="M6 10v10h12V10" />
      <circle cx="12" cy="15" r="2.5" />
    </svg>
  );
}

// --- Icônes Appartements ---
export function IconPenthouse(props) {
  return (
    <svg {...subIconProps} {...props}>
      <path d="M3 20h18" />
      <path d="M6 20V9l6-4 6 4v11" />
      <path d="M10 20v-5h4v5" />
      <path d="M9 9h6" />
    </svg>
  );
}

export function IconAttic(props) {
  return (
    <svg {...subIconProps} {...props}>
      <path d="M3 20h18" />
      <path d="M6 20V12l6-6 6 6v8" />
      <path d="M12 8v4" />
    </svg>
  );
}

export function IconDuplex(props) {
  return (
    <svg {...subIconProps} {...props}>
      <rect x="4" y="7" width="16" height="12" rx="2" />
      <path d="M12 7v12" />
      <path d="M7.5 11h3" />
      <path d="M13.5 11h3" />
    </svg>
  );
}

export function IconGardenLevel(props) {
  return (
    <svg {...subIconProps} {...props}>
      <rect x="4" y="8" width="16" height="10" rx="2" />
      <path d="M3 18h18" />
      <path d="M6 18c1.5-2 3.5-2 5 0" />
    </svg>
  );
}

export function IconCrossVent(props) {
  return (
    <svg {...subIconProps} {...props}>
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="M8 9h8" />
      <path d="M8 15h8" />
      <path d="M6 12h4" />
      <path d="M14 12h4" />
    </svg>
  );
}

export function IconAptOther(props) {
  return (
    <svg {...subIconProps} {...props}>
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}
