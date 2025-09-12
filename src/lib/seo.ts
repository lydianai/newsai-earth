import type { Metadata } from "next";

// Global SEO metadata
export const seoConfig = {
  siteName: "AI LENS by newsai.earth",
  siteUrl: "https://newsai.earth", 
  description: "Revolutionary AI-powered scientific intelligence platform featuring EarthBrief, Digital Twin, Quantum Computing, Metaverse, Research Intelligence, Knowledge Discovery, AI Agents, IoT Integration and Advanced Analytics Dashboard.",
  keywords: [
    "AI LENS", "artificial intelligence", "newsai.earth", "EarthBrief", "Digital Twin", 
    "Quantum Computing", "Metaverse", "Research Intelligence", "Knowledge Discovery", 
    "AI Agents", "IoT", "Analytics Dashboard", "scientific intelligence", "global platform",
    "machine learning", "data science", "earth science", "climate AI", "agriculture AI",
    "biology AI", "chemistry AI", "history AI", "elements AI", "news AI", "decision AI"
  ],
  social: {
    twitter: "@newsai_earth",
    facebook: "newsai.earth",
    linkedin: "newsai-earth",
    github: "newsai-earth"
  }
};

export function generatePageMetadata({
  title,
  description,
  path = "",
  image = "/icon.svg",
  noIndex = false
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const pageTitle = title 
    ? `${title} | ${seoConfig.siteName}`
    : seoConfig.siteName;
    
  const pageDescription = description || seoConfig.description;
  const pageUrl = `${seoConfig.siteUrl}${path}`;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: seoConfig.keywords,
    authors: [{ name: "newsai.earth Team" }],
    creator: "newsai.earth",
    publisher: "newsai.earth",
    metadataBase: new URL(seoConfig.siteUrl),
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
      siteName: seoConfig.siteName,
      images: [
        {
          url: image,
          width: image === "/icon.svg" ? 512 : 1200,
          height: image === "/icon.svg" ? 512 : 630,
          alt: `${title || "AI LENS"} - ${seoConfig.siteName}`,
        }
      ],
      locale: "tr_TR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      site: seoConfig.social.twitter,
      creator: seoConfig.social.twitter,
      images: [image],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      nocache: true,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        noimageindex: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
