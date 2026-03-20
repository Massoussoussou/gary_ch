import React, { Suspense, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import Header from './components/layout/Header.jsx'
import IntroCover from './components/layout/IntroCover.jsx'
import ScrollToTop from "./components/layout/ScrollToTop.jsx";

import Home from './pages/Home.jsx'

/* ---- Lazy-loaded pages (code-splitting) ---- */
const BuyIntro = React.lazy(() => import('./pages/BuyIntro.jsx'));
const ListingDetail = React.lazy(() => import('./pages/ListingDetail.jsx'));
const Sell = React.lazy(() => import('./pages/Sell.jsx'));
const EstimationLanding = React.lazy(() => import('./pages/EstimationLanding.jsx'));
const EstimationConfirmationPreview = React.lazy(() => import('./pages/EstimationConfirmationPreview.jsx'));
const About = React.lazy(() => import('./pages/About.jsx'));
const Contact = React.lazy(() => import('./pages/Contact.jsx'));
const TeamMemberDetail = React.lazy(() => import('./pages/TeamMemberDetail.jsx'));
const ProjetsNeufs = React.lazy(() => import('./pages/ProjetsNeufs.jsx'));
const ProjetNeufDetail = React.lazy(() => import('./pages/ProjetNeufDetail.jsx'));
const Actualite = React.lazy(() => import('./pages/Actualite.jsx'));
const ActualiteDetail = React.lazy(() => import('./pages/ActualiteDetail.jsx'));
const Presse = React.lazy(() => import('./pages/Presse.jsx'));
const Ressources = React.lazy(() => import('./pages/Ressources.jsx'));
const NotFound = React.lazy(() => import('./pages/NotFound.jsx'));

export default function App() {
  const location = useLocation();
  const isEstimer = location.pathname.startsWith("/estimer");

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
  }, [isEstimer]);

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text font-sans">
      <Header />
      {!isEstimer && <IntroCover />}
      <ScrollToTop />
      <main className="flex-1">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <p className="text-sm text-neutral-500 animate-pulse">Chargement…</p>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/acheter" element={<BuyIntro />} />
            <Route path="/acheter/catalogue" element={<Navigate to="/acheter" replace />} />
            <Route path="/annonce/:id" element={<ListingDetail />} />
            <Route path="/vendre" element={<Sell />} />
            <Route path="/estimer" element={<EstimationLanding />} />
            <Route path="/estimer/confirmation" element={<EstimationConfirmationPreview />} />
            <Route path="/a-propos" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/equipe/:slug" element={<TeamMemberDetail />} />
            <Route path="/projets-neufs" element={<ProjetsNeufs />} />
            <Route path="/projets-neufs/:id" element={<ProjetNeufDetail />} />
            <Route path="/actualites" element={<Actualite />} />
            <Route path="/actualites/:id" element={<ActualiteDetail />} />
            <Route path="/presse" element={<Presse />} />
            <Route path="/ressources" element={<Ressources />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}
