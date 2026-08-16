import { SITE_META } from "@/lib/constants";

export default function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_META.name,
    jobTitle: "UGC Creator & Videographer",
    description: SITE_META.description,
    url: SITE_META.url,
    email: SITE_META.email,
    telephone: SITE_META.whatsapp,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Shebeen El-Kom",
      addressCountry: "EG",
    },
    sameAs: [SITE_META.instagram, SITE_META.tiktok, SITE_META.youtube],
    knowsAbout: [
      "UGC Content Creation",
      "Videography",
      "Video Editing",
      "Reel Creation",
      "Medical Content",
      "Healthcare Videography",
    ],
    worksFor: {
      "@type": "Organization",
      name: "Freelance",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "UGC Creator Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "UGC Content Creation",
            description: "Authentic, high-converting user-generated content tailored to your brand voice.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Reel Creation",
            description: "Cinematic short-form reels that captivate audiences and drive engagement.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Videography",
            description: "Professional on-location video production for beauty centers, clinics, and lifestyle brands.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Video Editing",
            description: "Expert post-production with color grading, motion graphics, and sound design.",
          },
        },
      ],
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
