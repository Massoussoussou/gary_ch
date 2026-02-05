// src/pages/Sell.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Megaphone, Camera, Target, Users, FileText } from "lucide-react";
import ListingCardSold from "../components/cards/ListingCardSold.jsx";
import AlreadyOwner from "../components/AlreadyOwner.jsx";
import useProperties from "../hooks/useProperties.js";
import BandCarousel from "../components/BandCarousel.jsx";
import SellHero from "../components/sell/SellHero";
import StepsSection from "../components/sell/StepsSection";
import SellTrustStrip from "../components/sell/SellTrustStrip";

/* Hooks et utils partagés */
import { useRevealOnce } from "../hooks/useRevealOnce.js";
import { hasTag } from "../utils/data.js";

/* ---------- visuels étapes ---------- */
const HERO_URL =
  "https://images.pexels.com/photos/27303113/pexels-photo-27303113.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=1920";
const SELL_1 =
  "https://images.pexels.com/photos/8297537/pexels-photo-8297537.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=2400";
const SELL_2 =
  "https://images.pexels.com/photos/20451400/pexels-photo-20451400.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=2400";
const SELL_3 =
  "https://images.pexels.com/photos/6476808/pexels-photo-6476808.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=2000";
const SELL_4 =
  "https://images.pexels.com/photos/7641868/pexels-photo-7641868.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=2400";
const SELL_5 =
  "https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=2400";

/* ---------- contenu étapes ---------- */
const steps = [
  {
    id: "estimation-strategie",
    title: "Estimation & stratégie",
    icon: Target,
    bullets: [
      "Analyse des ventes comparables et tendances locales.",
      "Visite technique du bien (atouts & points d'attention).",
      "Prix d'affichage réaliste + stratégie de commercialisation.",
    ],
    cta: { label: "Demander une visite d'estimation", href: "/contact" },
  },
  {
    id: "mise-en-valeur",
    title: "Mise en valeur du bien",
    icon: Camera,
    bullets: [
      "Photos pro, vidéo ciné, drone, plans 2D/3D.",
      "Recommandations de home staging à fort impact.",
      "Annonce claire, premium et factuelle.",
    ],
  },
  {
    id: "diffusion-ciblage",
    title: "Diffusion & ciblage",
    icon: Megaphone,
    bullets: [
      "Portails premium, réseaux sociaux, base acquéreurs qualifiés.",
      "Pilotage de la portée + itérations visuels/accroches.",
      "Qualification stricte des contacts.",
    ],
  },
  {
    id: "visites-offres",
    title: "Visites qualifiées",
    icon: Users,
    bullets: [
      "Créneaux groupés intelligents, dossiers pré-validés.",
      "Compte-rendus à chaque visite.",
      "Aide à la négociation (preuves marché, alternatives).",
    ],
  },
  {
    id: "closing-notaire",
    title: "Signature & suivi",
    icon: FileText,
    bullets: [
      "Promesse/compromis, diagnostics, coordination notaire.",
      "Sécurisation des délais & conditions.",
      "Accompagnement jusqu'à l'acte authentique.",
    ],
  },
];

const stepImages = [SELL_1, SELL_2, SELL_3, SELL_4, SELL_5];

export default function Sell() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const { data } = useProperties();

  // ouvrir la bonne étape si hash présent
  useEffect(() => {
    const idx = steps.findIndex((s) => `#${s.id}` === window.location.hash);
    if (idx >= 0) setActive(idx);
  }, []);

  // données "déjà vendu"
  const vendus = useMemo(
    () => data.filter((d) => hasTag(d, /vendu/i) || d.vendu),
    [data]
  );

  // apparition "déjà vendu"
  const [vendRef, vendShown] = useRevealOnce();

  return (
    <main className="text-[#0F1115] overflow-x-clip">
      {/* HERO */}
      <SellHero bgSrc={HERO_URL} />

      {/* ÉTAPES */}
      <StepsSection
        steps={steps}
        stepImages={stepImages}
        active={active}
        setActive={setActive}
      />

      {/* BANDEAU KPI */}
      <SellTrustStrip />

      {/* DÉJÀ VENDU */}
      <section
        ref={vendRef}
        className={`relative py-24 bg-white transition-all duration-700 ${
          vendShown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <BandCarousel
            title="Déjà vendu"
            items={vendus}
            cta="Voir nos ventes"
            onCta={() => navigate("/ventes")}
            renderItem={ListingCardSold}
          />
        </div>
      </section>

      <AlreadyOwner toEstimate="/estimer" toSell="/contact" />
    </main>
  );
}
