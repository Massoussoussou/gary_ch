import { useEffect, useMemo, useRef } from "react";
import "../styles/dome-gallery.css"; 

const DEFAULT_IMAGES = [
  "https://images.pexels.com/photos/2583494/pexels-photo-2583494.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=1600&h=900",
  "https://images.pexels.com/photos/29672245/pexels-photo-29672245.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=1600&h=900",
  "https://images.pexels.com/photos/7746566/pexels-photo-7746566.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=1600&h=900",
  "https://images.pexels.com/photos/13041118/pexels-photo-13041118.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=1600&h=900",
  "https://images.pexels.com/photos/13752348/pexels-photo-13752348.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=1600&h=900",
  "https://images.unsplash.com/photo-1515263487990-61b07816b324?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=2000&auto=format&fit=crop",
  
  "https://images.pexels.com/photos/18559611/pexels-photo-18559611.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=1600&h=900",
  "https://images.pexels.com/photos/32312775/pexels-photo-32312775.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=1600&h=900",
  "https://images.pexels.com/photos/30278097/pexels-photo-30278097.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=1200&h=800",
      
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop"
];

function buildItems(pool, seg) {
  const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2);
  const evenYs = [-4, -2, 0, 2, 4];
  const oddYs = [-3, -1, 1, 3, 5];

  const coords = xCols.flatMap((x, c) => {
    const ys = c % 2 === 0 ? evenYs : oddYs;
    return ys.map((y) => ({ x, y, sizeX: 2, sizeY: 2 }));
  });

  const imgs = (pool?.length ? pool : DEFAULT_IMAGES).map((img) =>
    typeof img === "string" ? { src: img, alt: "" } : { src: img.src || "", alt: img.alt || "" }
  );

  return coords.map((c, i) => ({
    ...c,
    ...imgs[i % imgs.length],
  }));
}

/**
 * Dôme 3D non interactif, rotation constante, bande blanche centrale.
 *
 * Props:
 * - images: string[] | {src,alt}[]
 * - segments: number (densité des tuiles)
 * - speedDegPerSec: number (6 par défaut)
 * - fit, fitBasis, minRadius, maxRadius, padFactor, grayscale: idem lib d’origine
 */
export default function DomeGallery({
  images = DEFAULT_IMAGES,
  segments = 35,
  speedDegPerSec = 6,
  fit = 0.5,
  fitBasis = "auto",
  minRadius = 600,
  maxRadius = Infinity,
  padFactor = 0.25,
  overlayBlurColor = "#060010",
  imageBorderRadius = "30px",
  grayscale = true,
  className = "",
}) {
  const rootRef = useRef(null);
  const mainRef = useRef(null);
  const sphereRef = useRef(null);
  const rotationRef = useRef({ x: 0, y: 0 });
  const lockedRadiusRef = useRef(null);

  const items = useMemo(() => buildItems(images, segments), [images, segments]);

  // Resize → calcule le rayon et les variables CSS
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0].contentRect;
      const w = Math.max(1, cr.width);
      const h = Math.max(1, cr.height);
      const minDim = Math.min(w, h);
      const maxDim = Math.max(w, h);
      const aspect = w / h;

      let basis;
      switch (fitBasis) {
        case "min":
          basis = minDim;
          break;
        case "max":
          basis = maxDim;
          break;
        case "width":
          basis = w;
          break;
        case "height":
          basis = h;
          break;
        default:
          basis = aspect >= 1.3 ? w : minDim;
      }

      let radius = basis * fit;
      const heightGuard = h * 1.35;
      radius = Math.min(radius, heightGuard);
      radius = Math.max(minRadius, Math.min(radius, maxRadius));
      lockedRadiusRef.current = Math.round(radius);

      const viewerPad = Math.max(8, Math.round(minDim * padFactor));

      root.style.setProperty("--radius", `${lockedRadiusRef.current}px`);
      root.style.setProperty("--viewer-pad", `${viewerPad}px`);
      root.style.setProperty("--overlay-blur-color", overlayBlurColor);
      root.style.setProperty("--tile-radius", imageBorderRadius);
      root.style.setProperty("--image-filter", grayscale ? "grayscale(1)" : "none");
      root.style.setProperty("--segments-x", segments);
      root.style.setProperty("--segments-y", segments);
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [fit, fitBasis, minRadius, maxRadius, padFactor, overlayBlurColor, grayscale, imageBorderRadius, segments]);

  // Rotation constante
  useEffect(() => {
    let raf;
    let last = performance.now();
    const applyTransform = (xDeg, yDeg) => {
      const el = sphereRef.current;
      if (el) {
        el.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;
      }
    };
    const tick = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      rotationRef.current.y += speedDegPerSec * dt;
      // on garde l’axe X proche de 0 pour éviter un basculement vertical
      rotationRef.current.x = 0;
      applyTransform(rotationRef.current.x, rotationRef.current.y);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [speedDegPerSec]);

  return (
    <div ref={rootRef} className={`sphere-root ${className}`} aria-hidden="true">
      <main ref={mainRef} className="sphere-main">
        <div className="stage">
          <div ref={sphereRef} className="sphere">
            {items.map((it, i) => (
              <div
                key={`${it.x},${it.y},${i}`}
                className="item"
                style={{
                  ["--offset-x"]: it.x,
                  ["--offset-y"]: it.y,
                  ["--item-size-x"]: it.sizeX,
                  ["--item-size-y"]: it.sizeY,
                }}
              >
                <div className="item__image">
                  <img src={it.src} draggable={false} alt={it.alt || ""} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overlays doux en haut/bas (optionnel) */}
        <div className="overlay" />
        <div className="overlay overlay--blur" />
        <div className="edge-fade edge-fade--top" />
        <div className="edge-fade edge-fade--bottom" />

        
      </main>
    </div>
  );
}
