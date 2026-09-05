import type { Metadata } from "next";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://krvbuilders.com";
export const siteName = "KRV Builders & Developers";
export const siteDescription =
  "KRV Builders & Developers is a Ramanagara construction company offering turnkey building construction, Vastu house plans, structural design, 3D elevations, and interior design across Karnataka.";

export const localBusiness = {
  name: siteName,
  url: siteUrl,
  telephone: "+918123758878",
  email: "krvbuildersndevelopers@gmail.com",
  address: {
    streetAddress: "1st Floor, Above Canara Bank ATM, Moti Nagar Extension",
    addressLocality: "Ramanagara",
    addressRegion: "Karnataka",
    postalCode: "562159",
    addressCountry: "IN",
  },
  geo: {
    latitude: 12.7213,
    longitude: 77.2815,
  },
  areaServed: ["Ramanagara", "Karnataka"],
};

const pageDefaults = {
  home: {
    title: "Builders in Ramanagara | KRV Builders & Developers",
    description:
      "Trusted builders in Ramanagara for turnkey construction, Vastu house plans, structural design, 3D elevations, interiors, and commercial projects across Karnataka.",
    path: "/",
  },
  services: {
    title: "Construction & Architectural Services in Ramanagara",
    description:
      "Explore KRV Builders services in Ramanagara: Vastu house plans, structural RCC design, 3D elevations, interior design, turnkey construction, and estimation.",
    path: "/services",
  },
  workInProgress: {
    title: "Work In Progress Construction Sites in Ramanagara",
    description:
      "Follow live KRV Builders construction projects in Ramanagara with active site photos, execution phases, and structural progress updates.",
    path: "/work-in-progress",
  },
  gallery: {
    title: "Construction, 3D Elevation & Interior Design Gallery",
    description:
      "Browse KRV Builders completed construction projects, Vastu plans, 3D elevations, and interior design work from Ramanagara and Karnataka.",
    path: "/gallery",
  },
  about: {
    title: "About KRV Builders & Developers in Ramanagara",
    description:
      "Learn how KRV Builders combines structural engineering, Vastu principles, and construction craftsmanship in Ramanagara and across Karnataka.",
    path: "/about",
  },
  contact: {
    title: "Contact Builders and Contractors in Ramanagara",
    description:
      "Contact KRV Builders in Ramanagara for building construction, Vastu house plans, structural design, 3D elevations, interiors, site visits, and estimates.",
    path: "/contact",
  },
} as const;

export type SeoPage = keyof typeof pageDefaults;

export function createPageMetadata(page: SeoPage): Metadata {
  const details = pageDefaults[page];
  const canonical = new URL(details.path, siteUrl).toString();
  const image = new URL("/logo.png", siteUrl).toString();

  return {
    title: details.title,
    description: details.description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: canonical,
      siteName,
      title: details.title,
      description: details.description,
      images: [{ url: image, alt: `${siteName} logo` }],
    },
    twitter: {
      card: "summary",
      title: details.title,
      description: details.description,
      images: [image],
    },
  };
}

export function getLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "GeneralContractor", "HomeAndConstructionBusiness"],
        "@id": `${siteUrl}/#localbusiness`,
        name: localBusiness.name,
        url: localBusiness.url,
        image: `${siteUrl}/logo.png`,
        logo: `${siteUrl}/logo.png`,
        telephone: localBusiness.telephone,
        email: localBusiness.email,
        priceRange: "$$",
        address: { "@type": "PostalAddress", ...localBusiness.address },
        geo: {
          "@type": "GeoCoordinates",
          latitude: localBusiness.geo.latitude,
          longitude: localBusiness.geo.longitude,
        },
        areaServed: localBusiness.areaServed.map((name) => ({ "@type": "AdministrativeArea", name })),
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "20:00",
          },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Construction and architectural services",
          itemListElement: [
            "Turnkey building construction",
            "Vastu house plan design",
            "Structural engineering and RCC design",
            "3D elevation design",
            "Interior design",
            "Estimation and consultancy",
          ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: siteName,
        url: siteUrl,
        logo: `${siteUrl}/logo.png`,
        telephone: localBusiness.telephone,
        email: localBusiness.email,
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: siteName,
        publisher: { "@id": `${siteUrl}/#organization` },
        inLanguage: "en-IN",
      },
    ],
  };
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
