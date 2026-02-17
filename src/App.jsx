import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import Header from './components/layout/Header.jsx'
import DesignSwitcher from './components/DesignSwitcher.jsx'
import IntroCover from './components/layout/IntroCover.jsx'
import ScrollToTop from "./components/layout/ScrollToTop.jsx";


import Home from './pages/Home.jsx'
// Listings.jsx kept as reference but no longer routed directly
import BuyIntro from './pages/BuyIntro.jsx'
import ListingDetail from './pages/ListingDetail.jsx'
import Sell from './pages/Sell.jsx'
import Estimate from './pages/Estimate.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'

import TeamMemberDetail from './pages/TeamMemberDetail.jsx'

import ProjetsNeufs from "./pages/ProjetsNeufs";
import ProjetNeufDetail from "./pages/ProjetNeufDetail";
import Actualite from './pages/Actualite.jsx';
import ActualiteDetail from './pages/ActualiteDetail.jsx';




export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    // Expose l'instance pour ScrollToTop et autres composants
    window.__lenis = lenis;
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => { lenis.destroy(); window.__lenis = null; };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text font-sans">
      <Header />
      <IntroCover />
      <ScrollToTop behavior="auto" />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/acheter" element={<BuyIntro />} />
          <Route path="/acheter/catalogue" element={<Navigate to="/acheter" replace />} />
          <Route path="/annonce/:id" element={<ListingDetail />} />
          <Route path="/vendre" element={<Sell />} />
          <Route path="/estimer" element={<Estimate />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/equipe/:slug" element={<TeamMemberDetail />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/projets-neufs" element={<ProjetsNeufs />} />
          <Route path="/projets-neufs/:id" element={<ProjetNeufDetail />} />
          <Route path="/actualites" element={<Actualite />} />
          <Route path="/actualites/:id" element={<ActualiteDetail />} />
        </Routes>
      </main>
      
    </div>
  
  )
}
