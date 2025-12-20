import { useEffect, useState } from "react";

export default function HeroVideo(){
  const [enabled, setEnabled] = useState(false);
  useEffect(() => { setEnabled(document.documentElement.dataset.bg === "videoHero"); }, []);
  if (!enabled) return null;
  return (
    <section className="max-w-6xl mx-auto px-4 pt-6">
      <div id="hero-video-wrap" style={{position:"relative",height:"56vh",minHeight:420,overflow:"hidden",borderRadius:24}}>
        <video autoPlay muted loop playsInline style={{width:"100%",height:"100%",objectFit:"cover"}}>
          <source src="/hero-house.mp4" type="video/mp4" />
        </video>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(0,0,0,.25),rgba(0,0,0,.10))"}}/>
      </div>
    </section>
  );
}
