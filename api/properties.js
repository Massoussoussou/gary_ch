import { fetchPropertyLabels } from "./_labels-cache.js";

// Fallback mappings pour les types de biens courants
const CATEGORY_FALLBACK = {
  "100": "Appartement",
  "101": "Studio",
  "102": "Loft",
  "103": "Duplex",
  "104": "Triplex",
  "105": "Penthouse",
  "110": "Attique",
  "120": "Maison",
  "121": "Villa",
  "122": "Villa mitoyenne",
  "123": "Maison mitoyenne",
  "124": "Maison de maître",
  "125": "Maison de ville",
  "126": "Maison jumelée",
  "127": "Villa mitoyenne",
  "128": "Ferme",
  "129": "Château",
  "130": "Villa",
  "131": "Villa d'architecte",
  "139": "Propriété de prestige",
  "140": "Chalet",
  "150": "Terrain",
  "151": "Terrain constructible",
  "160": "Immeuble",
  "161": "Immeuble de rapport",
  "170": "Local commercial",
  "171": "Commerce",
  "172": "Boutique",
  "180": "Bureau",
  "181": "Espace de coworking",
  "190": "Parking",
  "191": "Garage",
  "192": "Box",
  "200": "Entrepôt",
  "201": "Dépôt",
};

// Fallback mappings pour les cantons suisses (par ID)
const CANTON_FALLBACK = {
  "1": "AG", "2": "AI", "3": "AR", "4": "BE", "5": "BL",
  "6": "BS", "7": "FR", "8": "GE", "9": "GL", "10": "GR",
  "11": "JU", "12": "LU", "13": "NE", "14": "NW", "15": "OW",
  "16": "SG", "17": "SH", "18": "SO", "19": "SZ", "20": "TG",
  "21": "TI", "22": "VD", "23": "VS", "24": "ZG", "25": "GE", "26": "ZH",
};

// Mapping codes postaux → noms de villes (Suisse romande principalement)
const ZIP_TO_CITY = {
  // Genève
  "1200": "Genève", "1201": "Genève", "1202": "Genève", "1203": "Genève",
  "1204": "Genève", "1205": "Genève", "1206": "Genève", "1207": "Genève",
  "1208": "Genève", "1209": "Genève", "1210": "Genève", "1211": "Genève",
  "1212": "Grand-Lancy", "1213": "Petit-Lancy", "1214": "Vernier",
  "1215": "Genève Aéroport", "1216": "Cointrin", "1217": "Meyrin",
  "1218": "Le Grand-Saconnex", "1219": "Châtelaine", "1220": "Les Avanchets",
  "1222": "Vésenaz", "1223": "Cologny", "1224": "Chêne-Bougeries",
  "1225": "Chêne-Bourg", "1226": "Thônex", "1227": "Carouge",
  "1228": "Plan-les-Ouates", "1231": "Conches", "1232": "Confignon",
  "1233": "Bernex", "1234": "Vessy", "1236": "Cartigny",
  "1241": "Puplinge", "1242": "Satigny", "1243": "Presinge",
  "1244": "Choulex", "1245": "Collonge-Bellerive", "1246": "Corsier",
  "1247": "Anières", "1248": "Hermance", "1251": "Gy",
  "1252": "Meinier", "1253": "Vandoeuvres", "1254": "Jussy",
  "1255": "Veyrier", "1256": "Troinex", "1257": "Croix-de-Rozon",
  "1258": "Perly", "1290": "Versoix", "1291": "Commugny",
  "1292": "Chambésy", "1293": "Bellevue", "1294": "Genthod",
  // Vaud - Lausanne et environs
  "1000": "Lausanne", "1003": "Lausanne", "1004": "Lausanne",
  "1005": "Lausanne", "1006": "Lausanne", "1007": "Lausanne",
  "1008": "Prilly", "1009": "Pully", "1010": "Lausanne",
  "1011": "Lausanne", "1012": "Lausanne", "1014": "Lausanne",
  "1015": "Lausanne", "1018": "Lausanne", "1020": "Renens",
  "1022": "Chavannes-près-Renens", "1023": "Crissier", "1024": "Écublens",
  "1025": "St-Sulpice", "1026": "Denges", "1027": "Lonay",
  "1028": "Préverenges", "1029": "Villars-Ste-Croix", "1030": "Bussigny",
  // Vaud - Riviera
  "1800": "Vevey", "1801": "Le Mont-Pèlerin", "1802": "Corseaux",
  "1803": "Chardonne", "1804": "Corsier-sur-Vevey", "1805": "Jongny",
  "1806": "St-Légier", "1807": "Blonay", "1808": "Les Monts-de-Corsier",
  "1809": "Fenil-sur-Corsier", "1814": "La Tour-de-Peilz",
  "1815": "Clarens", "1816": "Chailly-Montreux", "1817": "Brent",
  "1820": "Montreux", "1822": "Chernex", "1823": "Glion",
  "1824": "Caux", "1832": "Villard-sur-Chamby", "1833": "Les Avants",
  // Vaud - Nyon et environs
  "1260": "Nyon", "1261": "Longirod", "1262": "Eysins",
  "1263": "Crassier", "1264": "St-Cergue", "1266": "Duillier",
  "1267": "Coinsins", "1268": "Begnins", "1269": "Bassins",
  "1270": "Trélex", "1271": "Givrins", "1272": "Genolier",
  "1273": "Arzier", "1274": "Grens", "1275": "Chéserex",
  "1276": "Gingins", "1277": "Borex", "1278": "La Rippe",
  "1279": "Chavannes-de-Bogis", "1280": "Chavannes-des-Bois",
  "1281": "Russin", "1283": "Dardagny", "1284": "Chancy",
  "1285": "Athenaz", "1286": "Soral", "1287": "Laconnex",
  "1288": "Aire-la-Ville", "1295": "Mies", "1296": "Coppet",
  "1297": "Founex", "1298": "Céligny", "1299": "Crans-près-Céligny",
  // France voisine
  "74140": "Chens-sur-Léman", "74160": "Beaumont", "74200": "Thonon-les-Bains",
  "74500": "Évian-les-Bains", "74100": "Annemasse", "74240": "Gaillard",
  // Autres villes importantes
  "1950": "Sion", "3900": "Brig", "3920": "Zermatt",
  "1870": "Monthey", "1890": "St-Maurice", "1920": "Martigny",
};

// Fallback pour les statuts de biens (status_id → label FR)
// Ces IDs seront confirmés/complétés par l'API get-choices-labels
const STATUS_FALLBACK = {
  "1":  "Actif",
  "2":  "Réservé",
  "3":  "Vendu",
  "4":  "Suspendu",
  "5":  "Coming soon",
  "6":  "En attente",
  "7":  "Loué",
  "8":  "Option",
  "9":  "Actif",
  "10": "Archivé",
};

// Détermine le type de bandeau à partir du label de statut
function statusToBandeau(statusLabel) {
  if (!statusLabel) return null;
  const s = statusLabel.toLowerCase();
  if (/vendu|sold/.test(s))                     return "Vendu";
  if (/réserv|reserv|option/.test(s))           return "Réservé";
  if (/coming|bientôt|prochainement/.test(s))   return "Coming soon";
  if (/suspendu|suspend|inactif|archiv/.test(s)) return "Suspendu";
  // "Actif", "En attente", etc. → pas de bandeau
  return null;
}

// Fallback pour les équipements/amenities courants
const AMENITY_FALLBACK = {
  "2": "Ascenseur", "3": "Balcon", "4": "Terrasse", "5": "Jardin",
  "6": "Piscine", "7": "Garage", "8": "Parking", "9": "Cave",
  "10": "Grenier", "11": "Cheminée", "12": "Climatisation",
  "14": "Alarme", "20": "Interphone", "22": "Vidéophone",
  "23": "Domotique", "24": "Double vitrage", "25": "Triple vitrage",
  "26": "Panneaux solaires", "28": "Pompe à chaleur",
  "30": "Buanderie", "34": "Local vélos", "36": "Vue lac",
  "40": "Vue montagne", "42": "Vue dégagée", "45": "Jacuzzi",
  "47": "Sauna", "49": "Fitness", "53": "Conciergerie",
  "54": "Réception", "60": "Cuisine équipée", "72": "Parquet",
  "92": "Stores électriques", "95": "Volets roulants",
  "103": "Fibre optique", "119": "Borne de recharge",
  "161": "Accès handicapés", "175": "Home cinéma",
  "266": "Portail électrique", "312": "Salle de sport",
  "353": "Proche transports", "360": "Proche commerces", "362": "Proche écoles",
};

// Supprime les balises HTML pour le texte brut
function stripHtml(html) {
  if (!html || typeof html !== "string") return "";
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.REALFORCE_PUBLIC_API_KEY;
    const baseUrl = process.env.REALFORCE_PUBLIC_BASE_URL || "https://listings.realforce.ch";

    if (!apiKey) {
      return res.status(500).json({ error: "Missing REALFORCE_PUBLIC_API_KEY" });
    }

    // Params venant du front (avec valeurs par défaut)
    const perPage = Math.min(parseInt(req.query.per_page || "100", 10), 100);
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const lang = String(req.query.lang || "fr").toLowerCase().replace(/[^a-z|]/g, "");
    if (!lang) return res.status(400).json({ error: "Invalid lang" });

    // Langue principale (premier code avant le pipe)
    const primaryLang = lang.split("|")[0];

    const url = new URL(`${baseUrl}/api/v1/get-full-listings`);
    url.searchParams.set("per_page", String(perPage));
    url.searchParams.set("page", String(page));
    url.searchParams.set("lang", lang);

    // Optionnel: filtre sur date de mise à jour (format YYYY-MM-DD)
    const dateRe = /^\d{4}-\d{2}-\d{2}$/;
    if (req.query.update_date_min) {
      const d = String(req.query.update_date_min);
      if (dateRe.test(d)) url.searchParams.set("update_date_min", d);
    }
    if (req.query.update_date_max) {
      const d = String(req.query.update_date_max);
      if (dateRe.test(d)) url.searchParams.set("update_date_max", d);
    }

    // Fetch listings + labels en parallèle (labels peuvent échouer sans bloquer)
    console.log("[properties] Fetching from:", url.toString());

    const [rfResp, labels] = await Promise.all([
      fetch(url.toString(), { headers: { "X-API-KEY": apiKey } }),
      fetchPropertyLabels(primaryLang).catch((err) => {
        console.warn("[properties] Labels fetch failed:", err.message);
        return { cities: {}, categories: {}, amenities: {} };
      }),
    ]);

    console.log("[properties] Realforce response status:", rfResp.status);

    if (!rfResp.ok) {
      const text = await rfResp.text();
      return res.status(rfResp.status).json({
        error: "Realforce error",
        status: rfResp.status,
        details: text.slice(0, 300),
      });
    }

    const payload = await rfResp.json();
    console.log("[properties] Payload count:", payload.count, "data length:", (payload.data || []).length);

    // Helpers de résolution
    const { cities, categories, amenities, choices } = labels;

    // Log des choices pour debug (à retirer plus tard)
    if (choices && Object.keys(choices).length > 0) {
      console.log("[properties] Choices labels keys:", Object.keys(choices).slice(0, 20));
      // Log un échantillon pour comprendre la structure
      const sampleKey = Object.keys(choices)[0];
      if (sampleKey) console.log("[properties] Choices sample:", sampleKey, "→", JSON.stringify(choices[sampleKey]).slice(0, 200));
    } else {
      console.log("[properties] No choices labels received");
    }

    const resolveCity = (cityId, zip, cityName) => {
      // Priorité: nom de ville direct > labels API > ZIP mapping > ZIP brut
      if (cityName && typeof cityName === "string" && !cityName.startsWith("ZIP") && !/^\d+$/.test(cityName)) {
        return cityName;
      }
      const entry = cities[String(cityId)];
      if (entry) {
        const lbl = entry.labels || entry;
        const resolved = lbl[primaryLang] || lbl.fr || lbl.en;
        if (resolved) return resolved;
      }
      // Fallback: mapping ZIP → nom de ville
      if (zip && ZIP_TO_CITY[String(zip)]) {
        return ZIP_TO_CITY[String(zip)];
      }
      return zip ? `${zip}` : null;
    };

    const resolveCategory = (catId) => {
      // D'abord essayer les labels API
      const entry = categories[String(catId)];
      if (entry) {
        const resolved = entry[primaryLang] || entry.fr || entry.en;
        if (resolved) return resolved;
      }
      // Fallback sur notre mapping statique
      return CATEGORY_FALLBACK[String(catId)] || null;
    };

    const resolveCanton = (cantonId) => {
      return CANTON_FALLBACK[String(cantonId)] || String(cantonId);
    };

    // Résolution du statut (status_id → label localisé)
    const resolveStatus = (statusId) => {
      if (statusId == null) return null;
      const key = String(statusId);
      // D'abord essayer les labels API (choices)
      const entry = choices[key];
      if (entry) {
        // Structure possible: { "fr": "Vendu" } ou { "labels": { "fr": "Vendu" } } ou string
        if (typeof entry === "string") return entry;
        const lbl = entry.labels || entry;
        const resolved = lbl[primaryLang] || lbl.fr || lbl.en;
        if (resolved) return resolved;
      }
      // Fallback sur notre mapping statique
      return STATUS_FALLBACK[key] || null;
    };

    const resolveAmenity = (amenityId) => {
      const entry = amenities[String(amenityId)];
      if (entry) {
        const resolved = entry[primaryLang] || entry.fr || entry.en;
        if (resolved) return resolved;
      }
      // Fallback sur notre mapping statique
      return AMENITY_FALLBACK[String(amenityId)] || null;
    };

    // Cache: CDN 5 min, navigateur 0 (force revalidation)
    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=300, stale-while-revalidate=600");

    // Mapping vers le format front
    const data = (payload.data || []).map((p) => {
      // Gestion de la description (peut être string ou objet)
      let descriptionHtml = "";
      let title = "";

      if (typeof p.description === "string") {
        descriptionHtml = p.description;
      } else if (p.description && typeof p.description === "object") {
        const desc = p.description[primaryLang] || p.description.fr || p.description.en || {};
        descriptionHtml = typeof desc === "string" ? desc : (desc.description || "");
        title = desc.title || "";
      }

      // Le titre peut venir de plusieurs sources
      title = p.title || title || p.reference || "Annonce";

      // Surface: habitable > usable > m2
      const surface =
        (p.habitable != null ? Number(p.habitable) : null) ??
        (p.usable != null ? Number(p.usable) : null) ??
        (p.m2 != null ? Number(p.m2) : null);

      // Résolution du type de bien
      const typeId = p.sub_category_id || p.main_category_id;
      const typeLabel = resolveCategory(p.sub_category_id) || resolveCategory(p.main_category_id);

      // Résolution des amenities (IDs → noms lisibles), filtre les non résolus
      const rawAmenities = Array.isArray(p.amenities) ? p.amenities : [];
      const equipements = rawAmenities.map((id) => resolveAmenity(id)).filter(Boolean);

      return {
        id: p.id,
        reference: p.reference || null,
        titre: title,
        prix: p.price != null ? Number(p.price) : null,
        devise: "CHF",
        ville: resolveCity(p.city_id, p.zip, p.city),
        zip: p.zip || null,
        canton: resolveCanton(p.canton_id),
        pays: "CH",
        type: typeLabel || (typeId ? `Type ${typeId}` : null),
        typeId: typeId || null,
        pieces: p.rooms != null ? Number(p.rooms) : null,
        chambres: p.bedrooms != null ? Number(p.bedrooms) : null,
        sdb: p.bathrooms != null ? Number(p.bathrooms) : null,
        surface_m2: surface,
        surfaceTerrain: p.land != null ? Number(p.land) : null,
        surfaceBalcon: p.balcony != null ? Number(p.balcony) : null,
        surfaceTerrasse: p.terrace != null ? Number(p.terrace) : null,
        etage: p.floor || null,
        meuble: p.furnish_id != null,
        dispo: p.availability_date || null,
        images: Array.isArray(p.photos) ? p.photos : [],
        // Description en 2 formats
        description: stripHtml(descriptionHtml),      // Texte brut pour les cards/previews
        descriptionHtml: descriptionHtml,             // HTML pour la page détail
        equipements,
        // Statut du bien basé sur status_id (API RealForce)
        statusId: p.status_id || null,
        status: resolveStatus(p.status_id),
        bandeau: statusToBandeau(resolveStatus(p.status_id)),
        vendu: /vendu|sold/i.test(resolveStatus(p.status_id) || ""),
        reserve: /réserv|reserv|option/i.test(resolveStatus(p.status_id) || ""),
        comingSoon: /coming|bientôt|prochainement/i.test(resolveStatus(p.status_id) || ""),
        tags: [],
        createdAt: p.lastupdate || p.publication_date || p.creation || null,
        coords: {
          lat: p.latitude != null ? Number(p.latitude) : null,
          lng: p.longitude != null ? Number(p.longitude) : null,
        },
        broker: {
          name: [p.broker_firstname, p.broker_lastname].filter(Boolean).join(" ") || null,
          email: p.broker_email || null,
          phone: p.broker_phone || p.broker_mobile || null,
          avatar: p.broker_avatar || null,
          slug: `${(p.broker_firstname || "agent")}-${(p.broker_lastname || "gary")}`.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
        },
      };
    });

    return res.status(200).json({
      count: payload.count ?? data.length,
      page: payload.page ?? page,
      per_page: payload.per_page ?? perPage,
      data,
    });
  } catch (err) {
    console.error("API /properties error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
