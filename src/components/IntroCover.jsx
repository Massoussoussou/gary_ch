import { useEffect, useState } from "react";

export default function IntroCover() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const mode = localStorage.getItem("gary-intro") || "off"; // "off" | "once" | "always"
    if (mode === "always") setShow(true);
    if (mode === "once" && !sessionStorage.getItem("intro-seen")) {
      setShow(true);
    }
  }, []);

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => {
      // auto-scroll léger
      window.scrollTo({ top: (document.querySelector("header")?.offsetHeight || 80) + 10, behavior: "smooth" });
      sessionStorage.setItem("intro-seen","1");
      setTimeout(()=>setShow(false), 900);
    }, 1400);
    return () => clearTimeout(t);
  }, [show]);

  if (!show) return null;
  return (
    <div className="intro-cover">
      <div className="text-center">
        <div className="text-5xl md:text-7xl font-bold tracking-wide">ACHETER</div>
        <div className="mt-10 mx-auto intro-arrow" />
      </div>
    </div>
  );
}
