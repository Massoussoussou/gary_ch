/**
 * Annonce fictive pour le développement local.
 * Utilisée automatiquement quand l'API ne renvoie aucun résultat.
 */
const MOCK_LISTING = {
  id: "mock-001",
  slug: "villa-prestige-cologny",
  titre: "Villa d'exception avec vue lac",
  ville: "Cologny",
  canton: "Genève",
  pays: "Suisse",
  type: "Villa",
  prix: 8950000,
  devise: "CHF",
  surface_m2: 420,
  terrain_m2: 1200,
  pieces: 9,
  chambres: 5,
  sdb: 4,
  meuble: false,
  dispo: "",
  createdAt: "2026-01-15T10:00:00Z",
  tags: ["exclusivité", "nouveau"],
  bandeau: "Exclusivité",
  equipements: [
    "Jardin",
    "Piscine extérieure",
    "Vue lac",
    "Garage double",
    "Cave à vin",
    "Terrasse panoramique",
    "Domotique",
    "Alarme",
    "Cheminée",
  ],
  coords: { lat: 46.2118, lng: 6.1823 },
  coordsFake: { lat: 46.2118, lng: 6.1823 },
  agentSlug: null,
  description:
    "Nichée sur les hauteurs de Cologny, cette villa d'architecte offre une vue imprenable sur le lac Léman et le Mont-Blanc. Construite en 2019 avec des matériaux nobles, elle allie modernité et élégance intemporelle.",
  descriptionHtml: `
    <p><b>Situation exceptionnelle</b><br>
    Nichée sur les hauteurs de Cologny, l'une des communes les plus prisées de Genève, cette villa d'architecte offre une <b>vue panoramique imprenable</b> sur le lac Léman, le jet d'eau et la chaîne du Mont-Blanc.</p>

    <p><b>Prestations haut de gamme</b><br>
    Construite en 2019 avec des matériaux nobles — pierre naturelle, chêne massif, baies vitrées sol-plafond — elle allie modernité et élégance intemporelle. La domotique intégrale (KNX) pilote éclairage, stores, chauffage et sécurité.</p>

    <p><b>Espaces de vie</b></p>
    <ul>
      <li>Grand séjour double hauteur (~85 m²) avec cheminée design</li>
      <li>Cuisine ouverte Bulthaup entièrement équipée</li>
      <li>Suite parentale avec dressing et salle de bain en marbre</li>
      <li>4 chambres supplémentaires, chacune avec salle d'eau</li>
      <li>Bureau / bibliothèque au calme</li>
      <li>Salle de cinéma au sous-sol</li>
    </ul>

    <p><b>Extérieurs</b></p>
    <ul>
      <li>Jardin paysager de 1'200 m² clos et arboré</li>
      <li>Piscine à débordement chauffée (12 × 5 m)</li>
      <li>Terrasse panoramique de 60 m² orientée sud-ouest</li>
      <li>Pool house avec cuisine d'été</li>
    </ul>

    <p><b>Commodités</b><br>
    Garage double automatisé, cave à vin climatisée (200 bouteilles), buanderie, local technique. À 5 min du centre de Cologny, 10 min de Genève centre, accès autoroute immédiat.</p>
  `,
  images: [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80",
    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1920&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=80",
  ],
  heroIdx: 0,
  spotlight: null,
  vendu: false,
  broker: null,
};

export default MOCK_LISTING;
