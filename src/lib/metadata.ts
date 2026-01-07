import type { Metadata } from "next";

export const siteConfig = {
  name: "Parkside",
  description: "Parkside - featuring Parkside Harmony (a cappella chorus) and Parkside Melody (treble-voiced ensemble). Bringing barbershop harmony to our community.",
  url: "https://parksideharmony.org", // Replace with your actual domain when available
  ogImage: "/og-image.jpg",
  links: {
    twitter: "https://twitter.com/parksideharmony",
    facebook: "https://facebook.com/parksideharmony",
    instagram: "https://instagram.com/parksideharmony",
  },
};

export const defaultMetadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "barbershop",
    "chorus",
    "harmony",
    "melody",
    "singing",
    "a cappella",
    "music",
    "vocal",
    "parkside",
    "parkside harmony",
    "parkside melody",
    "performance",
    "community",
  ],
  authors: [
    {
      name: "Parkside",
      url: siteConfig.url,
    },
  ],
  creator: "Parkside",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@parksideharmony",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
};

export function generateMetadata({
  title,
  description,
  ogImage,
}: {
  title?: string;
  description?: string;
  ogImage?: string;
}): Metadata {
  return {
    title: title,
    description: description || defaultMetadata.description,
    openGraph: {
      ...defaultMetadata.openGraph,
      title: title || defaultMetadata.openGraph?.title,
      description: description || defaultMetadata.openGraph?.description,
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: title || siteConfig.name,
            },
          ]
        : defaultMetadata.openGraph?.images,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: title || defaultMetadata.twitter?.title,
      description: description || defaultMetadata.twitter?.description,
      images: ogImage ? [ogImage] : defaultMetadata.twitter?.images,
    },
  };
} 