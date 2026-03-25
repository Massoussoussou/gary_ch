// src/pages/Legal.jsx
import { useLocale } from "../hooks/useLocale.js";
import { Link } from "react-router-dom";

export default function Legal() {
  const { t, lang, link } = useLocale();
  const isEn = lang === "en";

  return (
    <main className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-[780px] mx-auto px-6 md:px-8">

        <h1 className="font-serif text-4xl md:text-5xl tracking-wide text-gray-900 mb-10">
          {isEn ? "Legal Notice" : "Mentions l\u00e9gales"}
        </h1>

        {/* ── Identit\u00e9 de l'entreprise ── */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            {isEn ? "Company Information" : "Identit\u00e9 de l\u2019entreprise"}
          </h2>
          <div className="text-gray-600 leading-relaxed space-y-1">
            <p><strong>{isEn ? "Company name" : "Raison sociale"} :</strong> <span className="text-[#FF4A3E]">[À compl\u00e9ter par Gary]</span></p>
            <p><strong>{isEn ? "Legal form" : "Forme juridique"} :</strong> <span className="text-[#FF4A3E]">[À compl\u00e9ter par Gary]</span></p>
            <p><strong>{isEn ? "Registered office" : "Si\u00e8ge social"} :</strong> <span className="text-[#FF4A3E]">[À compl\u00e9ter par Gary]</span></p>
            <p><strong>{isEn ? "Trade register no." : "N\u00b0 RC"} :</strong> <span className="text-[#FF4A3E]">[À compl\u00e9ter par Gary]</span></p>
            <p><strong>{isEn ? "VAT number" : "N\u00b0 TVA"} :</strong> <span className="text-[#FF4A3E]">[À compl\u00e9ter par Gary]</span></p>
            <p><strong>{isEn ? "Phone" : "T\u00e9l\u00e9phone"} :</strong> +41 22 557 07 00</p>
            <p><strong>{isEn ? "Email" : "Email"} :</strong> <span className="text-[#FF4A3E]">[À compl\u00e9ter par Gary]</span></p>
          </div>
        </section>

        {/* ── Responsable de la publication ── */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            {isEn ? "Publication Manager" : "Responsable de la publication"}
          </h2>
          <p className="text-gray-600">
            <span className="text-[#FF4A3E]">[À compl\u00e9ter par Gary \u2014 g\u00e9n\u00e9ralement le CEO]</span>
          </p>
        </section>

        {/* ── H\u00e9bergement ── */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            {isEn ? "Hosting" : "H\u00e9bergement"}
          </h2>
          <div className="text-gray-600 leading-relaxed space-y-1">
            <p>Vercel Inc.</p>
            <p>440 N Barranca Ave #4133, Covina, CA 91723, USA</p>
            <p>vercel.com</p>
          </div>
        </section>

        {/* ── Conception du site ── */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            {isEn ? "Website Design & Development" : "Conception et d\u00e9veloppement du site"}
          </h2>
          <p className="text-gray-600">
            T&M
          </p>
        </section>

        {/* ── Propri\u00e9t\u00e9 intellectuelle ── */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            {isEn ? "Intellectual Property" : "Propri\u00e9t\u00e9 intellectuelle"}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {isEn
              ? "All content on this website (texts, images, logos, videos) is the property of GARY or its partners and is protected by intellectual property laws. Any reproduction, even partial, is prohibited without prior written consent."
              : "L\u2019ensemble du contenu de ce site (textes, images, logos, vid\u00e9os) est la propri\u00e9t\u00e9 de GARY ou de ses partenaires et est prot\u00e9g\u00e9 par les lois sur la propri\u00e9t\u00e9 intellectuelle. Toute reproduction, m\u00eame partielle, est interdite sans autorisation \u00e9crite pr\u00e9alable."}
          </p>
        </section>

        {/* ── Limitation de responsabilit\u00e9 ── */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            {isEn ? "Limitation of Liability" : "Limitation de responsabilit\u00e9"}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {isEn
              ? "GARY makes every effort to ensure that the information published on this site is accurate and up-to-date. However, the information is provided for indicative purposes only and GARY cannot be held liable for any errors, omissions, or results obtained from the use of this information. Property listings, prices and availability are subject to change without notice."
              : "GARY s\u2019efforce de fournir des informations exactes et \u00e0 jour sur ce site. Toutefois, les informations sont fournies \u00e0 titre indicatif et GARY ne saurait \u00eatre tenu responsable des erreurs, omissions ou r\u00e9sultats obtenus suite \u00e0 l\u2019utilisation de ces informations. Les annonces immobili\u00e8res, prix et disponibilit\u00e9s sont susceptibles d\u2019\u00eatre modifi\u00e9s sans pr\u00e9avis."}
          </p>
        </section>

        {/* ── Lien vers politique de confidentialit\u00e9 ── */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            {isEn ? "Data Protection" : "Protection des donn\u00e9es"}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {isEn
              ? "For information on how we collect and process your personal data, please consult our "
              : "Pour conna\u00eetre les modalit\u00e9s de collecte et de traitement de vos donn\u00e9es personnelles, veuillez consulter notre "}
            <Link to={link("privacy")} className="text-[#FF4A3E] underline underline-offset-2 hover:no-underline">
              {isEn ? "Privacy Policy" : "Politique de confidentialit\u00e9"}
            </Link>.
          </p>
        </section>

        {/* ── Droit applicable ── */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            {isEn ? "Applicable Law" : "Droit applicable"}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {isEn
              ? "This website and its legal notices are governed by Swiss law. Any dispute shall fall under the exclusive jurisdiction of the courts of Geneva, Switzerland."
              : "Le pr\u00e9sent site et ses mentions l\u00e9gales sont r\u00e9gis par le droit suisse. Tout litige rel\u00e8ve de la comp\u00e9tence exclusive des tribunaux de Gen\u00e8ve, Suisse."}
          </p>
        </section>

      </div>
    </main>
  );
}
