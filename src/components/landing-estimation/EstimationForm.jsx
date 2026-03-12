import React, { useState, useCallback } from "react";
import FormStep1 from "./FormStep1";
import FormStep2 from "./FormStep2";
import FormStep3 from "./FormStep3";
import useSmsVerification from "../../hooks/useSmsVerification";
import useSendLead from "../../hooks/useSendLead";

const pushGTM = (event, data = {}) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...data });
};

export default function EstimationForm({ onSubmitSuccess, utmParams }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formError, setFormError] = useState("");

  const [step1, setStep1] = useState({
    type: "", rooms: "", surface: "", address: "", npa: "", city: "",
  });
  const [step2, setStep2] = useState({
    project: "", alreadySelling: "non",
    sellingDuration: "", portals: [], priceReduced: "non",
  });
  const [step3, setStep3] = useState({
    lastName: "", firstName: "", phone: "", email: "",
    _touched: {},
  });

  const sms = useSmsVerification();
  const { send, sending } = useSendLead();

  const goToStep = useCallback((n) => {
    setCurrentStep(n);
    setFormError("");
    pushGTM("form_step_complete", { from_step: n - 1, to_step: n });
  }, []);

  const stepState = (n) => {
    if (n === currentStep) return "expanded";
    return "collapsed";
  };

  const handleSubmit = async () => {
    setFormError("");

    // Validate required fields
    if (!step3.lastName.trim() || !step3.firstName.trim()) {
      setFormError("Merci de renseigner votre nom et prénom.");
      setStep3((prev) => ({
        ...prev,
        _touched: { ...prev._touched, lastName: true, firstName: true },
      }));
      return;
    }

    const phoneVal = step3.phone.trim().replace(/\s/g, "");
    if (!phoneVal || phoneVal.length < 10) {
      setFormError("Merci de renseigner un numéro de téléphone valide.");
      setStep3((prev) => ({
        ...prev,
        _touched: { ...prev._touched, phone: true },
      }));
      return;
    }

    // Build message
    const parts = [
      `[Landing Estimation]`,
      `Type: ${step1.type || "N/A"}`,
      `Pièces: ${step1.rooms || "N/A"}`,
      `Surface: ${step1.surface || "N/A"}`,
      `Adresse: ${step1.address || "N/A"}, ${step1.npa || ""} ${step1.city || ""}`,
      `Projet: ${step2.project || "N/A"}`,
      `Déjà en vente: ${step2.alreadySelling}`,
    ];
    if (step2.alreadySelling === "oui") {
      parts.push(`Depuis: ${step2.sellingDuration || "N/A"}`);
      parts.push(`Portails: ${(step2.portals || []).join(", ") || "N/A"}`);
      parts.push(`Prix baissé: ${step2.priceReduced}`);
    }
    if (sms.status === "verified") parts.push("Tel vérifié: Oui");
    if (utmParams) {
      const utmStr = Object.entries(utmParams).filter(([,v]) => v).map(([k,v]) => `${k}=${v}`).join(", ");
      if (utmStr) parts.push(`UTM: ${utmStr}`);
    }

    const payload = {
      sender_firstname: step3.firstName.trim(),
      sender_lastname: step3.lastName.trim(),
      sender_email: step3.email.trim() || undefined,
      sender_number: step3.phone.trim(),
      sender_message: parts.join("\n"),
      website: "", // honeypot
    };

    const ok = await send(payload);
    if (ok) {
      pushGTM("form_submit", {
        property_type: step1.type,
        sms_verified: sms.status === "verified",
      });
      onSubmitSuccess(step3.firstName.trim());
    } else {
      setFormError("Une erreur est survenue. Veuillez réessayer ou nous contacter directement.");
    }
  };

  return (
    <div className="hero-form-wrap" id="form">
      <div className="form-title">Estimez votre bien</div>
      <div className="form-sub">Commencez par nous décrire votre bien</div>

      <FormStep1
        data={step1}
        onChange={setStep1}
        onNext={() => goToStep(2)}
        stepState={stepState(1)}
      />

      <FormStep2
        data={step2}
        onChange={setStep2}
        onNext={() => goToStep(3)}
        stepState={stepState(2)}
      />

      <FormStep3
        data={step3}
        onChange={setStep3}
        onSubmit={handleSubmit}
        submitting={sending}
        stepState={stepState(3)}
        sms={sms}
      />

      <div className={`form-error${formError ? " visible" : ""}`}>
        {formError}
      </div>
    </div>
  );
}
