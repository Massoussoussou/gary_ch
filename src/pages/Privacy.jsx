// src/pages/Privacy.jsx
import { useLocale } from "../hooks/useLocale.js";

export default function Privacy() {
  const { lang } = useLocale();
  const isEn = lang === "en";

  return (
    <main className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-[780px] mx-auto px-6 md:px-8">

        <h1 className="font-serif text-4xl md:text-5xl tracking-wide text-gray-900 mb-4">
          {isEn ? "Privacy Policy" : "Politique de confidentialit\u00e9"}
        </h1>
        <p className="text-sm text-gray-400 mb-12">
          {isEn ? "Last updated:" : "Derni\u00e8re mise \u00e0 jour :"}{" "}
          <span className="text-[#FF4A3E]">[À compl\u00e9ter]</span>
        </p>

        {/* ── Introduction ── */}
        <section className="mb-10">
          <p className="text-gray-600 leading-relaxed">
            {isEn
              ? "GARY is committed to protecting your personal data. This privacy policy explains what data we collect, why, and how we use it, in accordance with the Swiss Federal Act on Data Protection (nFADP/nLPD)."
              : "GARY s\u2019engage \u00e0 prot\u00e9ger vos donn\u00e9es personnelles. La pr\u00e9sente politique de confidentialit\u00e9 explique quelles donn\u00e9es nous collectons, pourquoi et comment nous les utilisons, conform\u00e9ment \u00e0 la Loi f\u00e9d\u00e9rale sur la protection des donn\u00e9es (nLPD)."}
          </p>
        </section>

        {/* ── Responsable du traitement ── */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            {isEn ? "Data Controller" : "Responsable du traitement"}
          </h2>
          <div className="text-gray-600 leading-relaxed space-y-1">
            <p><span className="text-[#FF4A3E]">[Raison sociale \u2014 \u00e0 compl\u00e9ter par Gary]</span></p>
            <p><span className="text-[#FF4A3E]">[Adresse \u2014 \u00e0 compl\u00e9ter par Gary]</span></p>
            <p><span className="text-[#FF4A3E]">[Email de contact DPO \u2014 \u00e0 compl\u00e9ter par Gary]</span></p>
          </div>
        </section>

        {/* ── Donn\u00e9es collect\u00e9es ── */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            {isEn ? "Data We Collect" : "Donn\u00e9es que nous collectons"}
          </h2>

          <h3 className="text-lg font-medium text-gray-800 mt-5 mb-2">
            {isEn ? "Contact & estimation forms" : "Formulaires de contact et d\u2019estimation"}
          </h3>
          <p className="text-gray-600 leading-relaxed mb-3">
            {isEn
              ? "When you submit a form on our site, we collect the following information:"
              : "Lorsque vous soumettez un formulaire sur notre site, nous collectons les informations suivantes :"}
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
            <li>{isEn ? "Last name, first name" : "Nom, pr\u00e9nom"}</li>
            <li>{isEn ? "Email address" : "Adresse email"}</li>
            <li>{isEn ? "Phone number" : "Num\u00e9ro de t\u00e9l\u00e9phone"}</li>
            <li>{isEn ? "Message content (property description, request type)" : "Contenu du message (description du bien, type de demande)"}</li>
            <li>{isEn ? "Property details (type, surface, location) for valuations" : "D\u00e9tails du bien (type, surface, localisation) pour les estimations"}</li>
          </ul>

          <h3 className="text-lg font-medium text-gray-800 mt-5 mb-2">
            {isEn ? "Browsing data" : "Donn\u00e9es de navigation"}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {isEn
              ? "We do not currently use analytics cookies or third-party tracking tools. No browsing data is collected automatically beyond what is technically necessary for the site to function (e.g. language preference stored in localStorage)."
              : "Nous n\u2019utilisons actuellement aucun cookie d\u2019analyse ni outil de suivi tiers. Aucune donn\u00e9e de navigation n\u2019est collect\u00e9e automatiquement au-del\u00e0 de ce qui est techniquement n\u00e9cessaire au fonctionnement du site (ex. : pr\u00e9f\u00e9rence de langue stock\u00e9e dans le localStorage)."}
          </p>
        </section>

        {/* ── Finalit\u00e9s ── */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            {isEn ? "Purpose of Data Processing" : "Finalit\u00e9s du traitement"}
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
            <li>{isEn ? "Responding to your contact requests" : "R\u00e9pondre \u00e0 vos demandes de contact"}</li>
            <li>{isEn ? "Processing property valuation requests" : "Traiter vos demandes d\u2019estimation immobili\u00e8re"}</li>
            <li>{isEn ? "Connecting you with the appropriate broker" : "Vous mettre en relation avec le courtier adapt\u00e9"}</li>
            <li>{isEn ? "Sending the requested e-book or documents" : "Envoyer le e-book ou les documents demand\u00e9s"}</li>
          </ul>
        </section>

        {/* ── Sous-traitants ── */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            {isEn ? "Third-Party Processors" : "Sous-traitants"}
          </h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            {isEn
              ? "Your data may be shared with the following service providers, solely for the purposes described above:"
              : "Vos donn\u00e9es peuvent \u00eatre partag\u00e9es avec les prestataires suivants, uniquement dans le cadre des finalit\u00e9s d\u00e9crites ci-dessus :"}
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
            <li><strong>Realforce SA</strong> {isEn ? "\u2014 Real estate management platform (lead processing, listings)" : "\u2014 Plateforme de gestion immobili\u00e8re (traitement des leads, annonces)"}</li>
            <li><strong>Vercel Inc.</strong> {isEn ? "\u2014 Website hosting (USA)" : "\u2014 H\u00e9bergement du site (USA)"}</li>
          </ul>
        </section>

        {/* ── Dur\u00e9e de conservation ── */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            {isEn ? "Data Retention" : "Dur\u00e9e de conservation"}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {isEn
              ? "Your personal data is retained for the duration necessary to process your request and for any applicable legal retention period. Contact and valuation data is managed within the Realforce platform according to their own retention policies."
              : "Vos donn\u00e9es personnelles sont conserv\u00e9es pendant la dur\u00e9e n\u00e9cessaire au traitement de votre demande et pendant toute dur\u00e9e l\u00e9gale de conservation applicable. Les donn\u00e9es de contact et d\u2019estimation sont g\u00e9r\u00e9es au sein de la plateforme Realforce selon ses propres politiques de conservation."}
          </p>
        </section>

        {/* ── Droits ── */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            {isEn ? "Your Rights" : "Vos droits"}
          </h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            {isEn
              ? "Under the Swiss Federal Act on Data Protection (nFADP), you have the right to:"
              : "Conform\u00e9ment \u00e0 la Loi f\u00e9d\u00e9rale sur la protection des donn\u00e9es (nLPD), vous avez le droit de :"}
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
            <li>{isEn ? "Access your personal data" : "Acc\u00e9der \u00e0 vos donn\u00e9es personnelles"}</li>
            <li>{isEn ? "Request correction of inaccurate data" : "Demander la rectification de donn\u00e9es inexactes"}</li>
            <li>{isEn ? "Request deletion of your data" : "Demander la suppression de vos donn\u00e9es"}</li>
            <li>{isEn ? "Object to the processing of your data" : "Vous opposer au traitement de vos donn\u00e9es"}</li>
            <li>{isEn ? "Request data portability" : "Demander la portabilit\u00e9 de vos donn\u00e9es"}</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-3">
            {isEn
              ? "To exercise these rights, contact us at: "
              : "Pour exercer ces droits, contactez-nous \u00e0 : "}
            <span className="text-[#FF4A3E]">[Email \u2014 \u00e0 compl\u00e9ter par Gary]</span>
          </p>
        </section>

        {/* ── Cookies ── */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            {isEn ? "Cookies" : "Cookies"}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {isEn
              ? "This site uses only technically necessary storage (language preference in localStorage). No advertising, analytics or third-party cookies are used. Should this change in the future, this policy will be updated and a consent mechanism will be implemented."
              : "Ce site utilise uniquement un stockage techniquement n\u00e9cessaire (pr\u00e9f\u00e9rence de langue dans le localStorage). Aucun cookie publicitaire, analytique ou tiers n\u2019est utilis\u00e9. Si cela venait \u00e0 changer, cette politique sera mise \u00e0 jour et un m\u00e9canisme de consentement sera mis en place."}
          </p>
        </section>

        {/* ── Modifications ── */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            {isEn ? "Changes to This Policy" : "Modifications de cette politique"}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {isEn
              ? "GARY reserves the right to update this privacy policy at any time. Any changes will be published on this page with an updated date."
              : "GARY se r\u00e9serve le droit de modifier cette politique de confidentialit\u00e9 \u00e0 tout moment. Toute modification sera publi\u00e9e sur cette page avec une date de mise \u00e0 jour."}
          </p>
        </section>

      </div>
    </main>
  );
}
