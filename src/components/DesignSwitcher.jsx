import { useEffect, useRef, useState } from "react";
import { SlidersHorizontal, GripVertical, X, RefreshCw } from "lucide-react";

const FONTS = [
  { v:"classic", label:"Inter / Playfair",  sans:'Inter',            serif:'Playfair Display' },
  { v:"modern",  label:"Manrope / Merriweather", sans:'Manrope',     serif:'Merriweather' },
  { v:"elegant", label:"Plus Jakarta / Playfair", sans:'Plus Jakarta Sans', serif:'Playfair Display' },
  { v:"dmLora",  label:"DM Sans / Lora",   sans:'DM Sans',           serif:'Lora' },
  { v:"popPrata",label:"Poppins / Prata",  sans:'Poppins',           serif:'Prata' },
];

const BGS = [
  { v:"neutral",   label:"Neutre (blanc)" },
  { v:"warm1",     label:"Chaud 1 (brand)" },
  { v:"warm2",     label:"Chaud 2" },
  { v:"warm3",     label:"Chaud 3 très léger" },
  { v:"cool",      label:"Froid (bleuté)" },
  { v:"imagePage", label:"Image maison (page)" },
  { v:"imageSite", label:"Image maison (partout)" },
  { v:"videoHero", label:"Vidéo en hero (Acheter)" },
  { v:"dark",      label:"Sombre (expérimental)" },
];

// précharger Google Fonts via index.html (voir plus bas)
const pick = (key, def) => window.localStorage.getItem(key) || def;

export default function DesignSwitcher() {
  // état
  const [open, setOpen] = useState(false);
  const [pos, setPos]   = useState(() => {
    const saved = localStorage.getItem("ds-pos");
    return saved ? JSON.parse(saved) : { x: 12, y: 120 };
  });

  const [fontKey, setFontKey] = useState(pick("gary-fontKey", "classic"));
  const [bgKey,   setBgKey]   = useState(pick("gary-bgKey",   "warm1"));
  const [brand,   setBrand]   = useState(pick("gary-brand",   "#FF4A3E"));
  const [accent,  setAccent]  = useState(pick("gary-accent",  "#FF4A3E"));
  const [intro,   setIntro]   = useState(pick("gary-intro",   "off")); // off | once | always

  // appliquer thème au <html>
  useEffect(() => {
    const html = document.documentElement;
    const f = FONTS.find(x => x.v === fontKey) || FONTS[0];
    html.style.setProperty("--font-sans", `"${f.sans}", system-ui, -apple-system, "Segoe UI", "Roboto", sans-serif`);
    html.style.setProperty("--font-serif", `"${f.serif}", "Georgia", serif`);
    html.dataset.font = fontKey;
    localStorage.setItem("gary-fontKey", fontKey);
  }, [fontKey]);

  useEffect(() => {
    const html = document.documentElement;
    html.dataset.bg = bgKey;
    localStorage.setItem("gary-bgKey", bgKey);
  }, [bgKey]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--brand", brand);
    localStorage.setItem("gary-brand", brand);
  }, [brand]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent", accent);
    localStorage.setItem("gary-accent", accent);
  }, [accent]);

  useEffect(() => {
    localStorage.setItem("gary-intro", intro);
  }, [intro]);

  // drag (handle uniquement)
  const boxRef = useRef(null);
  const handleRef = useRef(null);
  useEffect(() => {
    const handle = handleRef.current;
    if (!handle) return;
    let sx=0, sy=0, ox=pos.x, oy=pos.y, moving=false;
    const down = (e) => { moving=true; sx=e.clientX; sy=e.clientY; ox=pos.x; oy=pos.y; (boxRef.current)?.setPointerCapture?.(e.pointerId); };
    const move = (e) => {
      if (!moving) return;
      const nx = Math.max(8, Math.min(window.innerWidth  - 280, ox + (e.clientX - sx)));
      const ny = Math.max(70, Math.min(window.innerHeight - 200, oy + (e.clientY - sy)));
      setPos({ x:nx, y:ny });
    };
    const up = (e) => { if(!moving) return; moving=false; localStorage.setItem("ds-pos", JSON.stringify({ x:pos.x, y:pos.y })); (boxRef.current)?.releasePointerCapture?.(e.pointerId); };
    handle.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => { handle.removeEventListener("pointerdown", down); window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
  }, [pos]);

  // reset
  const resetAll = () => {
    setFontKey("classic"); setBgKey("warm1"); setBrand("#FF4A3E"); setAccent("#FF4A3E"); setIntro("off");
  };

  return (
    <div ref={boxRef} className="fixed z-50" style={{ left: pos.x, top: pos.y }}>
      {/* bouton compact */}
      <button aria-label="Maquette" onClick={() => setOpen(o=>!o)}
        className="h-8 w-8 rounded-full bg-white shadow-md border border-line/70 flex items-center justify-center hover:shadow-lg">
        <SlidersHorizontal className="w-4 h-4" />
      </button>

      {open && (
        <div className="mt-2 w-[280px] rounded-xl bg-white/95 backdrop-blur border border-line p-3 shadow-xl">
          <div ref={handleRef} className="flex items-center justify-between mb-2 cursor-grab active:cursor-grabbing">
            <div className="flex items-center gap-2 text-xs text-muted">
              <GripVertical className="w-3.5 h-3.5" /> Maquette (déplacer ici)
            </div>
            <div className="flex items-center gap-1">
              <button onClick={resetAll} className="p-1 rounded hover:bg-bgAlt" title="Réinitialiser">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button onClick={()=>setOpen(false)} className="p-1 rounded hover:bg-bgAlt" aria-label="Fermer">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <label className="block text-xs text-muted mb-1">Police</label>
          <select className="w-full text-xs border border-line rounded px-2 py-1 mb-2 bg-white" value={fontKey} onChange={e=>setFontKey(e.target.value)}>
            {FONTS.map(o => <option key={o.v} value={o.v}>{o.label}</option>)}
          </select>

          <label className="block text-xs text-muted mb-1">Fond</label>
          <select className="w-full text-xs border border-line rounded px-2 py-1 mb-2 bg-white" value={bgKey} onChange={e=>setBgKey(e.target.value)}>
            {BGS.map(o => <option key={o.v} value={o.v}>{o.label}</option>)}
          </select>

          <div className="grid grid-cols-2 gap-3 mt-2">
            <div>
              <label className="block text-xs text-muted mb-1">Couleur marque</label>
              <input type="color" className="w-full h-8 border border-line rounded" value={brand} onChange={e=>setBrand(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Couleur accent</label>
              <input type="color" className="w-full h-8 border border-line rounded" value={accent} onChange={e=>setAccent(e.target.value)} />
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-xs text-muted mb-1">Intro de page</label>
            <select className="w-full text-xs border border-line rounded px-2 py-1 bg-white" value={intro} onChange={e=>setIntro(e.target.value)}>
              <option value="off">Désactivée</option>
              <option value="once">Une seule fois</option>
              <option value="always">Toujours</option>
            </select>
          </div>

          <p className="mt-3 text-[11px] text-muted/80">
            Astuce : <em>Vidéo en hero</em> s’affiche en haut de la page Acheter.  
            <br/>“Image maison (partout)” met une image de fond globale.
          </p>
        </div>
      )}
    </div>
  );
}
