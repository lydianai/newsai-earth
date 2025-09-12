import "./globals.css";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import LocaleSetter from "../../components/LocaleSetter";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from 'next/headers';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '../../i18n';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  preload: false, // disable automatic preload to avoid preload-not-used warnings
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "AI HUB - NEWS | Ultimate AI Intelligence Platform",
    template: "%s | AI HUB - NEWS"
  },
  description: "AI HUB - NEWS - Revolutionary AI platform featuring advanced agriculture intelligence, global news analysis, and cutting-edge AI technologies. The future of intelligent decision-making.",
  keywords: [
    "AI HUB - NEWS", "artificial intelligence", "agriculture AI", "AGRI LENS",
    "crop forecasting", "yield prediction", "plant health detection", "ESG tracking",
    "supply chain monitoring", "NDVI analysis", "digital agriculture",
    "sustainable farming", "smart agriculture", "precision farming",
    "agricultural advisory", "climate intelligence", "food security"
  ],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://newsai.earth",
    title: "AI HUB - NEWS | Ultimate AI Intelligence Platform",
    description: "Revolutionary AI platform featuring AGRI LENS v2 agricultural intelligence, crop forecasting, yield prediction, plant health detection, ESG tracking, and comprehensive agricultural analytics.",
    siteName: "AI HUB - NEWS",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI HUB - NEWS - Advanced Agricultural Intelligence Platform",
        type: "image/png",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI HUB - NEWS | Agricultural Intelligence Platform",
    description: "🌱 AGRI LENS v2: Advanced crop forecasting, yield prediction, plant health detection, ESG tracking & agricultural analytics. The future of smart farming.",
    site: "@newsai_earth",
    creator: "@newsai_earth",
    images: {
      url: "/og-image.png",
      alt: "AI HUB - NEWS Agricultural Intelligence",
    },
  },
  alternates: {
    canonical: "https://newsai.earth"
  }
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  
  // Ensure that the incoming `locale` is valid
  if (!locales.includes(locale)) {
    notFound();
  }

  // read nonce from cookie set by middleware
  const cookieStore = await cookies();
  const nonce = cookieStore.get('csp-nonce')?.value ?? '';
  
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        {/* Provide nonce for any inline scripts if needed */}
        {nonce ? <meta name="csp-nonce" content={nonce} /> : null}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen m-0`}
      >
        <NextIntlClientProvider messages={messages}>
          <NavBar />
          <LocaleSetter />
          <main className="mt-4">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
        <noscript>
          <div style={{padding:16,background:'#111',color:'#fff',textAlign:'center'}}>JavaScript kapalı — bazı özellikler çalışmayabilir.</div>
        </noscript>
      </body>
    </html>
  );
}
