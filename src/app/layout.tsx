import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AI HUB - NEWS | Ultimate AI Intelligence Platform",
    template: "%s | AI HUB - NEWS"
  },
  description: "AI HUB - NEWS - Revolutionary AI platform featuring advanced agriculture intelligence, global news analysis, and cutting-edge AI technologies. The future of intelligent decision-making.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <head>
        {/* Google AdSense Script */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
        
        {/* Meta tags for monetization */}
        <meta name="google-adsense-account" content="ca-pub-YOUR_PUBLISHER_ID" />
        <meta name="monetag" content="YOUR_MONETAG_ID" />
        
        {/* Geo-targeting for ads */}
        <meta name="geo.region" content="TR" />
        <meta name="geo.country" content="Turkey" />
        <meta name="geo.placename" content="Turkey" />
        
        {/* Schema.org for better ad targeting */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "AI HUB - NEWS",
              "description": "Revolutionary AI platform for news analysis and intelligence",
              "url": "https://yourdomain.com",
              "inLanguage": "tr-TR",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://yourdomain.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen m-0`}>
        {children}
        
        {/* Analytics for monetization insights */}
        <Script id="monetization-analytics" strategy="afterInteractive">
          {`
            // Google Analytics 4 (GA4) for revenue tracking
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
            
            // Revenue tracking events
            function trackPurchase(value, currency, planId) {
              gtag('event', 'purchase', {
                transaction_id: Date.now(),
                value: value,
                currency: currency,
                items: [{
                  item_id: planId,
                  item_name: planId + ' subscription',
                  item_category: 'subscription',
                  price: value,
                  quantity: 1
                }]
              });
            }
            
            function trackAdClick(adUnit) {
              gtag('event', 'ad_click', {
                ad_unit: adUnit,
                event_category: 'monetization'
              });
            }
            
            // Make functions globally available
            window.trackPurchase = trackPurchase;
            window.trackAdClick = trackAdClick;
          `}
        </Script>
      </body>
    </html>
  );
}
