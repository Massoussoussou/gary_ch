import React, { Suspense, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import IntroCover from './components/layout/IntroCover.jsx'
import ScrollToTop from "./components/layout/ScrollToTop.jsx";
import { langFromPath } from "./routes.js";

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
const Legal = React.lazy(() => import('./pages/Legal.jsx'));
const Privacy = React.lazy(() => import('./pages/Privacy.jsx'));
const NotFound = React.lazy(() => import('./pages/NotFound.jsx'));

/* ---- Routes partagées FR/EN ---- */
function AppRoutes() {
  return (
    <Routes>
      {/* ===== FR (default) ===== */}
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
      <Route path="/mentions-legales" element={<Legal />} />
      <Route path="/politique-de-confidentialite" element={<Privacy />} />

      {/* ===== EN ===== */}
      <Route path="/en" element={<Home />} />
      <Route path="/en/buy" element={<BuyIntro />} />
      <Route path="/en/buy/catalogue" element={<Navigate to="/en/buy" replace />} />
      <Route path="/en/listing/:id" element={<ListingDetail />} />
      <Route path="/en/sell" element={<Sell />} />
      <Route path="/en/estimate" element={<EstimationLanding />} />
      <Route path="/en/estimate/confirmation" element={<EstimationConfirmationPreview />} />
      <Route path="/en/about" element={<About />} />
      <Route path="/en/contact" element={<Contact />} />
      <Route path="/en/team/:slug" element={<TeamMemberDetail />} />
      <Route path="/en/new-projects" element={<ProjetsNeufs />} />
      <Route path="/en/new-projects/:id" element={<ProjetNeufDetail />} />
      <Route path="/en/news" element={<Actualite />} />
      <Route path="/en/news/:id" element={<ActualiteDetail />} />
      <Route path="/en/press" element={<Presse />} />
      <Route path="/en/resources" element={<Ressources />} />
      <Route path="/en/legal" element={<Legal />} />
      <Route path="/en/privacy" element={<Privacy />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isEstimer = location.pathname.startsWith("/estimer") || location.pathname.startsWith("/en/estimate");
  const isHome = location.pathname === "/" || location.pathname === "/en";
  const isProjetsNeufs = location.pathname === "/projets-neufs" || location.pathname === "/en/new-projects";
  const showFooter = !isEstimer && !isHome && !isProjetsNeufs;

  /* Synchronise i18next avec l'URL */
  useEffect(() => {
    const lang = langFromPath(location.pathname);
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [location.pathname, i18n]);

  /* Set html lang attribute + document title */
  useEffect(() => {
    document.documentElement.lang = i18n.language;
    const t = i18n.getFixedT(i18n.language);
    document.title = t("meta.title");
  }, [i18n.language]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
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
            <p className="text-sm text-neutral-500 animate-pulse">{t("loading")}</p>
          </div>
        }>
          <AppRoutes />
        </Suspense>
      </main>
      {showFooter && <Footer />}
    </div>
  )
}
