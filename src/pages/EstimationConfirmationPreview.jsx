import React, { useState, useEffect } from "react";
import "../styles/landing-estimation.css";
import ConfirmationPage from "../components/landing-estimation/ConfirmationPage";
import EbookModal from "../components/landing-estimation/EbookModal";

export default function EstimationConfirmationPreview() {
  const [ebookOpen, setEbookOpen] = useState(false);

  useEffect(() => {
    document.title = "GARY — Preview Confirmation";
    return () => { document.title = "GARY — Maquette"; };
  }, []);

  return (
    <div className="landing-estimation">
      <ConfirmationPage
        firstName="Jean"
        onOpenEbook={() => setEbookOpen(true)}
      />
      <EbookModal open={ebookOpen} onClose={() => setEbookOpen(false)} />
    </div>
  );
}
