import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import team from "../data/team.json";

const TEAM_DOTS = [
  // Jared — debout extrême gauche
  { slug: "jared-camaddo",    dotX: 10,  dotY: 30, zoneX: 0,  zoneY: 5,  zoneW: 17, zoneH: 90 },
  // Frédéric — assis gauche
  { slug: "frederic-batista",  dotX: 27,  dotY: 52, zoneX: 17, zoneY: 25, zoneW: 16, zoneH: 70 },
  // Guive — debout centre
  { slug: "guive-emami",       dotX: 41,  dotY: 28, zoneX: 33, zoneY: 3,  zoneW: 14, zoneH: 92 },
  // Grégory — assis centre
  { slug: "gregory-autieri",   dotX: 53,  dotY: 52, zoneX: 47, zoneY: 25, zoneW: 13, zoneH: 70 },
  // Steven — assis droite
  { slug: "steven-bourg",      dotX: 68,  dotY: 52, zoneX: 60, zoneY: 25, zoneW: 17, zoneH: 70 },
  // Florie — debout droite
  { slug: "florie-autieri",    dotX: 85,  dotY: 40, zoneX: 77, zoneY: 8,  zoneW: 23, zoneH: 88 },
];

function TeamMemberZone({ member, dotX, dotY, zoneX, zoneY, zoneW, zoneH }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const labelRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const labelPos = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const lerp = (a, b, t) => a + (b - a) * t;
    const tick = () => {
      labelPos.current.x = lerp(labelPos.current.x, mousePos.current.x, 0.12);
      labelPos.current.y = lerp(labelPos.current.y, mousePos.current.y, 0.12);
      if (labelRef.current) {
        labelRef.current.style.left = `${labelPos.current.x}px`;
        labelRef.current.style.top = `${labelPos.current.y}px`;
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  const yOffset = 30;

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mousePos.current.x = e.clientX - rect.left;
    mousePos.current.y = e.clientY - rect.top + yOffset;
  }, []);

  const handleMouseEnter = useCallback((e) => {
    setHovered(true);
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top + yOffset;
      mousePos.current = { x, y };
      labelPos.current = { x, y };
    }
  }, []);

  if (!member) return null;

  const relDotX = ((dotX - zoneX) / zoneW) * 100;
  const relDotY = ((dotY - zoneY) / zoneH) * 100;

  return (
    <div
      ref={containerRef}
      className="absolute cursor-pointer"
      style={{
        left: `${zoneX}%`,
        top: `${zoneY}%`,
        width: `${zoneW}%`,
        height: `${zoneH}%`,
        zIndex: hovered ? 30 : 20,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={() => navigate(`/equipe/${member.slug}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") navigate(`/equipe/${member.slug}`); }}
      aria-label={`Voir le profil de ${member.name}`}
    >
      <div
        className="absolute"
        style={{
          left: `${relDotX}%`,
          top: `${relDotY}%`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <span
          className="absolute rounded-full"
          style={{
            width: "40px",
            height: "40px",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(255,74,62,0.25)",
            animation: hovered ? "none" : "teamDotPulse 2.5s ease-in-out infinite",
            opacity: hovered ? 0 : 1,
            transition: "opacity 0.3s ease",
          }}
        />
        <span
          className="flex items-center justify-center rounded-full"
          style={{
            width: hovered ? "90px" : "18px",
            height: hovered ? "30px" : "18px",
            background: "#FF4A3E",
            boxShadow: hovered
              ? "0 0 20px rgba(255,74,62,0.6), 0 2px 8px rgba(0,0,0,0.2)"
              : "0 0 10px rgba(255,74,62,0.5), 0 2px 6px rgba(0,0,0,0.15)",
            borderRadius: hovered ? "20px" : "50%",
            transition: "width 0.4s cubic-bezier(0.22, 1, 0.36, 1), height 0.4s cubic-bezier(0.22, 1, 0.36, 1), border-radius 0.4s ease, box-shadow 0.3s ease",
            transform: "translate(-50%, -50%)",
            position: "absolute",
            left: "50%",
            top: "50%",
          }}
        >
          <span
            className="text-white font-medium tracking-wide whitespace-nowrap"
            style={{
              fontSize: "12px",
              opacity: hovered ? 1 : 0,
              transform: hovered ? "scale(1)" : "scale(0.7)",
              transition: hovered
                ? "opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s"
                : "opacity 0.05s ease, transform 0.05s ease",
            }}
          >
            voir →
          </span>
        </span>
      </div>

      <div
        ref={labelRef}
        className="absolute pointer-events-none"
        style={{ transform: "translate(-50%, 0%)", willChange: "left, top" }}
      >
        <span
          className="inline-block whitespace-nowrap font-semibold tracking-wide overflow-hidden"
          style={{
            fontSize: "clamp(14px, 1.3vw, 18px)",
            color: "#1a1a1a",
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(6px)",
            outline: "0.5px solid rgba(255,74,62,0.4)",
            outlineOffset: "-3px",
            padding: hovered ? "10px 20px" : "10px 0px",
            maxWidth: hovered ? "300px" : "0px",
            opacity: hovered ? 1 : 0,
            transition: hovered
              ? "max-width 1.2s cubic-bezier(0.22, 1, 0.36, 1), padding 1.2s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease"
              : "max-width 0.3s ease, padding 0.3s ease, opacity 0.2s ease",
          }}
        >
          {member.name}
        </span>
      </div>
    </div>
  );
}

export default function TeamPhotoInteractive({ className = "" }) {
  return (
    <div className={`relative w-full ${className}`}>
      <style>{`
        @keyframes teamDotPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
          50% { transform: translate(-50%, -50%) scale(1.6); opacity: 0; }
        }
      `}</style>

      <img
        src="/team-photo.jpg"
        alt="L'équipe GARY Real Estate"
        className="w-full h-auto"
        loading="lazy"
      />

      {/* Zones cliquables + points interactifs — desktop uniquement */}
      <div className="hidden md:block">
        {TEAM_DOTS.map((dot, i) => {
          const member = team.find((m) => m.slug === dot.slug);
          return <TeamMemberZone key={dot.slug} member={member} index={i} {...dot} />;
        })}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
