import React, { useState, useEffect, useMemo, useCallback } from "react";
import "../styles/landing-estimation.css";

import HeroSection from "../components/landing-estimation/HeroSection";
import EstimationForm from "../components/landing-estimation/EstimationForm";
import ConfirmationPage from "../components/landing-estimation/ConfirmationPage";
import MethodSection from "../components/landing-estimation/MethodSection";
import ComparisonSection from "../components/landing-estimation/ComparisonSection";
import TrustSection from "../components/landing-estimation/TrustSection";
import PortalsSection from "../components/landing-estimation/PortalsSection";
import FinalCTA from "../components/landing-estimation/FinalCTA";
import LandingFooter from "../components/landing-estimation/LandingFooter";
import StickyMobileCTA from "../components/landing-estimation/StickyMobileCTA";
import EbookModal from "../components/landing-estimation/EbookModal";

export default function EstimationLanding() {
  const [submitted, setSubmitted] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [ebookOpen, setEbookOpen] = useState(false);

  // Capture UTM params au mount
  const utmParams = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get("utm_source") || "",
      utm_campaign: params.get("utm_campaign") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_term: params.get("utm_term") || "",
      utm_content: params.get("utm_content") || "",
    };
  }, []);

  const handleSubmitSuccess = useCallback((name) => {
    setFirstName(name);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const openEbook = useCallback(() => {
    setEbookOpen(true);
  }, []);

  const closeEbook = useCallback(() => {
    setEbookOpen(false);
  }, []);

  // Set page title
  useEffect(() => {
    document.title = "GARY — Estimation Immobilière Gratuite à Genève";
    return () => { document.title = "GARY — Maquette"; };
  }, []);

  return (
    <div className="landing-estimation">

      {!submitted && (
        <HeroSection>
          <EstimationForm
            onSubmitSuccess={handleSubmitSuccess}
            utmParams={utmParams}
          />
        </HeroSection>
      )}

      {submitted && (
        <ConfirmationPage
          firstName={firstName}
          onOpenEbook={openEbook}
        />
      )}

      {/* Remaining sections — above fixed background */}
      <div className="relative" style={{ zIndex: 2 }}>
        <MethodSection />
        <ComparisonSection />
        <TrustSection />
        <PortalsSection />
        <FinalCTA />
        <LandingFooter />
      </div>

      <StickyMobileCTA hidden={submitted} />
      <EbookModal open={ebookOpen} onClose={closeEbook} />
    </div>
  );
}
