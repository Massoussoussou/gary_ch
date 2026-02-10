import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from './components/layout/Header.jsx'
import IntroCover from './components/layout/IntroCover.jsx'
import ScrollToTop from "./components/layout/ScrollToTop.jsx";

import Home from './pages/Home.jsx'

/* ---- Lazy-loaded pages (code-splitting) ---- */
const BuyIntro = React.lazy(() => import('./pages/BuyIntro.jsx'));
const ListingDetail = React.lazy(() => import('./pages/ListingDetail.jsx'));
const Sell = React.lazy(() => import('./pages/Sell.jsx'));
const Estimate = React.lazy(() => import('./pages/Estimate.jsx'));
const About = React.lazy(() => import('./pages/About.jsx'));
const Contact = React.lazy(() => import('./pages/Contact.jsx'));
const TeamMemberDetail = React.lazy(() => import('./pages/TeamMemberDetail.jsx'));
const ProjetsNeufs = React.lazy(() => import('./pages/ProjetsNeufs.jsx'));
const ProjetNeufDetail = React.lazy(() => import('./pages/ProjetNeufDetail.jsx'));
const Actualite = React.lazy(() => import('./pages/Actualite.jsx'));
const ActualiteDetail = React.lazy(() => import('./pages/ActualiteDetail.jsx'));
const NotFound = React.lazy(() => import('./pages/NotFound.jsx'));

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-text font-sans">
      <Header />
      <IntroCover />
      <ScrollToTop behavior="auto" />
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
            <Route path="/estimer" element={<Estimate />} />
            <Route path="/a-propos" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/equipe/:slug" element={<TeamMemberDetail />} />
            <Route path="/projets-neufs" element={<ProjetsNeufs />} />
            <Route path="/projets-neufs/:id" element={<ProjetNeufDetail />} />
            <Route path="/actualites" element={<Actualite />} />
            <Route path="/actualites/:id" element={<ActualiteDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}
