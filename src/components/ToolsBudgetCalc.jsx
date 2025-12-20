// src/components/ToolsBudgetCalc.jsx
import React, { useEffect, useMemo, useState } from "react";

/**
 * Calculette de budget (grand format, sans carte)
 * Entrées : revenus nets (€/CHF par mois), apport, taux (%), durée (années)
 * Sorties : mensualité estimée + budget max; warning si endettement > 33%
 *
 * Props:
 * - defaultIncomeMonthly?: number   // ex: 9000
 * - defaultDownPayment?: number     // ex: 200000
 * - defaultRate?: number            // en %, ex: 2.5
 * - defaultYears?: number           // ex: 25
 * - currency?: "CHF" | "EUR" | string
 * - onSearch?: (budgetMax: number) => void // callback CTA
 */
export default function ToolsBudgetCalc({
  defaultIncomeMonthly = 9000,
  defaultDownPayment = 200000,
  defaultRate = 2.5,
  defaultYears = 25,
  currency = "CHF",
  onSearch,
}) {
  // --- Local state (immédiat) ---
  const [incomeMonthlyRaw, setIncomeMonthlyRaw] = useState(String(defaultIncomeMonthly));
  const [downPaymentRaw, setDownPaymentRaw] = useState(String(defaultDownPayment));
  const [rateRaw, setRateRaw] = useState(String(defaultRate));
  const [yearsRaw, setYearsRaw] = useState(String(defaultYears));

  // --- Debounce 200 ms pour stabiliser le calcul pendant la frappe ---
  const [debounced, setDebounced] = useState({
    incomeMonthly: defaultIncomeMonthly,
    downPayment: defaultDownPayment,
    rate: defaultRate,
    years: defaultYears,
  });
  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced({
        incomeMonthly: toNumber(incomeMonthlyRaw),
        downPayment: toNumber(downPaymentRaw),
        rate: toNumber(rateRaw),
        years: Math.max(1, Math.round(toNumber(yearsRaw) || 0)),
      });
    }, 200);
    return () => clearTimeout(t);
  }, [incomeMonthlyRaw, downPaymentRaw, rateRaw, yearsRaw]);

  // --- Calculs financiers ---
  const {
    allowedMonthly,
    loanMax,
    budgetMax,
    monthlyForBudgetMax,
    debtRatio, // 0..1
  } = useMemo(() => {
    const incomeMonthly = Math.max(0, debounced.incomeMonthly || 0);
    const downPayment = Math.max(0, debounced.downPayment || 0);
    const years = Math.max(1, debounced.years || 0);
    const rMonthly = Math.max(0, (debounced.rate || 0) / 100 / 12);
    const n = years * 12;

    // Plafond d'endettement (33% du revenu net mensuel)
    const allowedMonthly = incomeMonthly * 0.33;

    // Montant d'emprunt max pour respecter allowedMonthly
    let loanMax = 0;
    if (rMonthly === 0) {
      loanMax = allowedMonthly * n; // cas taux 0
    } else {
      const factor = (1 - Math.pow(1 + rMonthly, -n)) / rMonthly;
      loanMax = allowedMonthly * factor;
    }

    const budgetMax = Math.max(0, downPayment + loanMax);

    // Mensualité estimée pour ce budget max (≈ plafond)
    const monthlyForBudgetMax = allowedMonthly;

    const debtRatio = incomeMonthly > 0 ? monthlyForBudgetMax / incomeMonthly : 0;

    return {
      allowedMonthly,
      loanMax,
      budgetMax,
      monthlyForBudgetMax,
      debtRatio,
    };
  }, [debounced]);

  const warnDebt = debtRatio > 0.33 + 0.001; // marge de tolérance flottante

  // --- Helpers ---
  function toNumber(v) {
    if (typeof v === "number") return v;
    if (!v) return 0;
    // Accepte "1 200 000", "1.200.000", "1,2", etc.
    const normalized = String(v).replace(/[^\d.,-]/g, "").replace(",", ".");
    const parsed = parseFloat(normalized);
    return isFinite(parsed) ? parsed : 0;
  }

  const fmt = useMemo(
    () =>
      new Intl.NumberFormat("fr-CH", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }),
    [currency]
  );

  const fmtNum = useMemo(
    () =>
      new Intl.NumberFormat("fr-CH", {
        maximumFractionDigits: 0,
      }),
    []
  );

  // --- UI ---
  return (
    <section className="w-full">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12 items-start">
          {/* Colonne formulaire */}
          <div className="space-y-6">
            <header className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Calculette de budget
              </h2>
              <p className="text-sm text-neutral-500">
                Estimation indicative – hors assurance, frais de notaire et entretien.
              </p>
            </header>

            <div className="space-y-5">
              <FieldCurrency
                label="Revenus nets (par mois)"
                value={incomeMonthlyRaw}
                onChange={setIncomeMonthlyRaw}
                currency={currency}
                placeholder="ex. 9 000"
                data-testid="income-input"
              />

              <FieldCurrency
                label={`Apport (${currency})`}
                value={downPaymentRaw}
                onChange={setDownPaymentRaw}
                currency={currency}
                placeholder="ex. 200 000"
                data-testid="downpayment-input"
              />

              <FieldPercent
                label="Taux d’intérêt"
                value={rateRaw}
                onChange={setRateRaw}
                step="0.05"
                placeholder="2,50"
                data-testid="rate-input"
              />

              <FieldYears
                label="Durée"
                value={yearsRaw}
                onChange={setYearsRaw}
                min={5}
                max={35}
                data-testid="years-input"
              />
            </div>

            {warnDebt && (
              <div
                role="alert"
                className="rounded-xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-amber-800"
              >
                Votre endettement dépasse 33%. Réduisez la durée, le taux ou le budget.
              </div>
            )}

            <p className="text-xs text-neutral-500 leading-relaxed">
              * Règle d’accessibilité: la mensualité recommandée ne doit pas dépasser{" "}
              <span className="tabular-nums font-medium">33%</span> de vos revenus nets mensuels.
            </p>
          </div>

          {/* Colonne résultat */}
          <div className="md:pl-8">
            <div className="relative">
              <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white to-neutral-50/60 rounded-3xl" />
              <div className="space-y-8 rounded-3xl px-6 py-8 md:px-10 md:py-12 border border-neutral-200">
                <div className="space-y-6">
                  <ResultBlock
                    title="Budget maximum estimé"
                    value={fmt.format(Math.max(0, Math.floor(budgetMax)))}
                    subtitle="Inclut votre apport et la capacité d’emprunt"
                  />
                  <Divider />
                  <ResultBlock
                    title="Mensualité estimée"
                    value={fmt.format(Math.max(0, Math.floor(monthlyForBudgetMax)))}
                    subtitle={`À ~${fmtNum.format( Math.max(1, debounced.years) )} ans • ${
                      debounced.rate?.toLocaleString?.("fr-CH", {maximumFractionDigits:2}) ?? debounced.rate
                    }%`}
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Endettement</span>
                    <span
                      className={
                        "tabular-nums font-medium " +
                        (warnDebt ? "text-amber-700" : "text-neutral-900")
                      }
                    >
                      {(debtRatio * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => onSearch?.(Math.max(0, Math.floor(budgetMax)))}
                    className="w-full rounded-2xl bg-[#FF4A3E] px-6 py-4 text-white text-base md:text-lg font-medium hover:opacity-95 active:opacity-90 transition"
                    data-testid="cta-search"
                  >
                    Voir les biens dans mon budget
                  </button>
                  <p className="mt-3 text-xs text-neutral-500">
                    Nous filtrerons vos résultats autour de votre budget maximum.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* /col résultat */}
        </div>
      </div>
    </section>
  );
}

/* ---------- Sous-composants UI ----------- */

function FieldCurrency({ label, value, onChange, currency = "CHF", placeholder, ...rest }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-neutral-600">{label}</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
          {currency}
        </span>
        <input
          {...rest}
          inputMode="numeric"
          pattern="[0-9]*"
          className="w-full rounded-2xl border border-neutral-200 bg-white px-14 py-3 text-base outline-none ring-0 placeholder:text-neutral-300 focus:border-neutral-300"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    </label>
  );
}

function FieldPercent({ label, value, onChange, step = "0.05", placeholder, ...rest }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-neutral-600">{label}</span>
      <div className="relative">
        <input
          {...rest}
          type="number"
          step={step}
          className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-base outline-none focus:border-neutral-300"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
          %
        </span>
      </div>
    </label>
  );
}

function FieldYears({ label, value, onChange, min = 5, max = 35, ...rest }) {
  const years = Math.max(min, Math.min(max, Math.round(Number(value) || min)));
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-neutral-600">{label}</span>
      <div className="flex items-center gap-3">
        <input
          {...rest}
          type="range"
          min={min}
          max={max}
          value={years}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
        />
        <input
          type="number"
          min={min}
          max={max}
          value={years}
          onChange={(e) => onChange(e.target.value)}
          className="w-20 rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-base outline-none focus:border-neutral-300"
        />
        <span className="text-neutral-500 text-sm">ans</span>
      </div>
    </label>
  );
}

function ResultBlock({ title, value, subtitle }) {
  return (
    <div className="space-y-2">
      <p className="text-sm uppercase tracking-wide text-neutral-500">{title}</p>
      <div className="text-3xl md:text-4xl lg:text-5xl font-semibold tabular-nums tracking-tight">
        {value}
      </div>
      {subtitle && <p className="text-sm text-neutral-500">{subtitle}</p>}
    </div>
  );
}

function Divider() {
  return <div className="h-px w-full bg-neutral-200" />;
}
