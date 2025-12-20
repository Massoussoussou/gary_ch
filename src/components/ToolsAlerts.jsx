// src/components/ToolsAlerts.jsx
import React, { useMemo, useState } from "react";

/**
 * Module "Alertes nouvelles annonces"
 *
 * Props:
 * - zonesOptions: string[]  (ex: ["Genève","Coppet","Nyon","Lausanne","Montreux"])
 * - typeOptions:  string[]  (ex: ["Appartement","Maison","Villa","Attique","Loft"])
 * - onCreateAlert: (payload) => void | Promise<void>
 * - defaultEmail: string
 * - defaultCollapsed: boolean (par défaut true : 1 champ visible + "Options")
 *
 * Design: luxe minimal, accent orange #FF4A3E
 */
export default function ToolsAlerts({
  zonesOptions = ["Genève", "Coppet", "Nyon", "Lausanne", "Montreux"],
  typeOptions = ["Appartement", "Maison", "Villa", "Attique", "Loft"],
  onCreateAlert,
  defaultEmail = "",
  defaultCollapsed = true,
}) {
  const [email, setEmail] = useState(defaultEmail);
  const [open, setOpen] = useState(!defaultCollapsed);
  const [zones, setZones] = useState(new Set());
  const [types, setTypes] = useState(new Set());
  const [maxPrice, setMaxPrice] = useState(""); // string pour formater proprement
  const [frequency, setFrequency] = useState("immediate"); // 'immediate' | 'daily'
  const [waOptIn, setWaOptIn] = useState(false);
  const [waNumber, setWaNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [touchedEmail, setTouchedEmail] = useState(false);

  const emailValid = useMemo(() => {
    // Regex simple mais robuste (HTML5 + domaine)
    const r =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    return r.test(email.trim());
  }, [email]);

  const priceNumeric = useMemo(() => {
    const digits = (maxPrice || "").replace(/[^\d]/g, "");
    return digits ? Number(digits) : null;
  }, [maxPrice]);

  const canSubmit = emailValid && !submitting;

  function toggleSet(setter, currentSet, value) {
    const next = new Set(currentSet);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  }

  function formatCHF(n) {
    try {
      return new Intl.NumberFormat("fr-CH", {
        style: "currency",
        currency: "CHF",
        maximumFractionDigits: 0,
      }).format(n);
    } catch {
      return `CHF ${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`;
    }
  }

  function prettyPriceInput(value) {
    // Formate sur blur: "1500000" -> "1 500 000"
    const digits = value.replace(/[^\d]/g, "");
    if (!digits) return "";
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouchedEmail(true);
    if (!emailValid) return;

    const payload = {
      email: email.trim(),
      zones: Array.from(zones),
      types: Array.from(types),
      maxPrice: priceNumeric, // null si vide
      frequency, // 'immediate' | 'daily'
      whatsapp: waOptIn
        ? {
            optIn: true,
            phone: waNumber.trim() || null,
          }
        : { optIn: false, phone: null },
      // utile côté analytics:
      context: { source: "BuyIntro.ToolsAlerts" },
      createdAt: new Date().toISOString(),
    };

    try {
      setSubmitting(true);
      if (onCreateAlert) {
        await onCreateAlert(payload);
      } else {
        // fallback: log — à remplacer par un fetch vers /api/alerts
        // await fetch("/api/alerts", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(payload) })
        console.log("[ToolsAlerts] payload", payload);
      }
      // petite réassurance UX sans “sursignalement” visuel
      // (intégrer votre système de toast si dispo)
      alert("✅ Alerte créée. Vous recevrez les nouvelles annonces selon vos préférences.");
      // Optionnel: reset partiel (on garde l’email pour réutilisation)
      // setZones(new Set()); setTypes(new Set()); setMaxPrice(""); setFrequency("immediate"); setWaOptIn(false); setWaNumber("");
    } catch (err) {
      console.error(err);
      alert("Une erreur est survenue. Merci de réessayer.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      aria-label="Créer une alerte nouvelles annonces"
      className="border border-neutral-200 bg-white/70 supports-[backdrop-filter]:bg-white/60 backdrop-blur-md px-4 py-5 md:px-6 md:py-6 shadow-sm"
    >
      <form onSubmit={handleSubmit} noValidate>
        {/* Ligne principale : 1 champ visible + Options + CTA */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex-1">
            <label htmlFor="alert-email" className="sr-only">
              E-mail
            </label>
            <input
              id="alert-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouchedEmail(true)}
              aria-invalid={touchedEmail && !emailValid ? "true" : "false"}
              aria-describedby={
                touchedEmail && !emailValid ? "alert-email-error" : undefined
              }
              placeholder="Votre e-mail"
              className="w-full h-12 md:h-11 rounded-lg border border-neutral-300 bg-white/80 px-4 outline-none focus:border-[#FF4A3E] focus:ring-2 focus:ring-[#FF4A3E]/30 transition"
            />
            {touchedEmail && !emailValid && (
              <p
                id="alert-email-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                Entrez une adresse e-mail valide.
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="h-12 md:h-11 px-4 rounded-lg border border-neutral-300 bg-white hover:border-neutral-400 transition"
            >
              {open ? "Masquer les options" : "Options"}
            </button>

            <button
              type="submit"
              disabled={!canSubmit}
              className="h-12 md:h-11 px-5 rounded-lg bg-[#FF4A3E] text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:translate-y-[-1px] active:translate-y-0 transition"
            >
              {submitting ? "Création…" : "Créer mon alerte"}
            </button>
          </div>
        </div>

        {/* Options détaillées */}
        {open && (
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Zones */}
            <fieldset>
              <legend className="mb-2 text-sm font-medium text-neutral-700">
                Zones (multi)
              </legend>
              <div className="flex flex-wrap gap-2">
                {zonesOptions.map((z) => {
                  const active = zones.has(z);
                  return (
                    <button
                      key={z}
                      type="button"
                      onClick={() => toggleSet(setZones, zones, z)}
                      aria-pressed={active}
                      className={[
                        "px-3 py-1.5 rounded-full border text-sm transition",
                        active
                          ? "bg-neutral-900 text-white border-neutral-900"
                          : "border-neutral-300 hover:border-neutral-400",
                      ].join(" ")}
                    >
                      {z}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Types */}
            <fieldset>
              <legend className="mb-2 text-sm font-medium text-neutral-700">
                Type de bien (multi)
              </legend>
              <div className="flex flex-wrap gap-2">
                {typeOptions.map((t) => {
                  const active = types.has(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleSet(setTypes, types, t)}
                      aria-pressed={active}
                      className={[
                        "px-3 py-1.5 rounded-full border text-sm transition",
                        active
                          ? "bg-neutral-900 text-white border-neutral-900"
                          : "border-neutral-300 hover:border-neutral-400",
                      ].join(" ")}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Prix max */}
            <fieldset>
              <legend className="mb-2 text-sm font-medium text-neutral-700">
                Prix max
              </legend>
              <div className="relative">
                <label htmlFor="max-price" className="sr-only">
                  Prix maximum
                </label>
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-500">
                  CHF
                </div>
                <input
                  id="max-price"
                  inputMode="numeric"
                  pattern="[0-9  ]*"
                  placeholder="ex. 1 500 000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  onBlur={() => setMaxPrice(prettyPriceInput(maxPrice))}
                  className="w-full h-12 md:h-11 rounded-lg border border-neutral-300 bg-white/80 pl-14 pr-4 outline-none focus:border-[#FF4A3E] focus:ring-2 focus:ring-[#FF4A3E]/30 transition"
                />
                {priceNumeric ? (
                  <p className="mt-1 text-xs text-neutral-500">
                    {formatCHF(priceNumeric)}
                  </p>
                ) : null}
              </div>
            </fieldset>

            {/* Fréquence + WhatsApp */}
            <fieldset>
              <legend className="mb-2 text-sm font-medium text-neutral-700">
                Notifications
              </legend>

              {/* Fréquence (segmented) */}
              <div
                role="radiogroup"
                aria-label="Fréquence d'envoi"
                className="inline-flex rounded-lg border border-neutral-300 overflow-hidden"
              >
                {[
                  { key: "immediate", label: "Immédiat" },
                  { key: "daily", label: "Quotidien (9h)" },
                ].map((opt) => {
                  const active = frequency === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setFrequency(opt.key)}
                      className={[
                        "px-4 py-2 text-sm transition",
                        active
                          ? "bg-neutral-900 text-white"
                          : "bg-white hover:bg-neutral-50",
                      ].join(" ")}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              {/* WhatsApp opt-in */}
              <div className="mt-3 flex items-center gap-2">
                <input
                  id="wa-opt"
                  type="checkbox"
                  checked={waOptIn}
                  onChange={(e) => setWaOptIn(e.target.checked)}
                  className="h-4 w-4 rounded border-neutral-300 text-[#FF4A3E] focus:ring-[#FF4A3E]"
                />
                <label htmlFor="wa-opt" className="text-sm text-neutral-800">
                  Recevoir aussi sur WhatsApp (optionnel)
                </label>
              </div>

              {waOptIn && (
                <div className="mt-2">
                  <label htmlFor="wa-phone" className="sr-only">
                    Numéro WhatsApp
                  </label>
                  <input
                    id="wa-phone"
                    type="tel"
                    inputMode="tel"
                    placeholder="+41 79 123 45 67"
                    value={waNumber}
                    onChange={(e) => setWaNumber(e.target.value)}
                    className="w-full h-12 md:h-11 rounded-lg border border-neutral-300 bg-white/80 px-4 outline-none focus:border-[#FF4A3E] focus:ring-2 focus:ring-[#FF4A3E]/30 transition"
                  />
                  <p className="mt-1 text-xs text-neutral-500">
                    Nous n’enverrons que des alertes liées à vos critères. Vous
                    pouvez vous désinscrire à tout moment.
                  </p>
                </div>
              )}
            </fieldset>
          </div>
        )}

        {/* Disclaimer discret */}
        <p className="mt-4 text-xs text-neutral-500">
          En créant une alerte, vous acceptez nos conditions et notre politique
          de confidentialité.
        </p>
      </form>
    </section>
  );
}
