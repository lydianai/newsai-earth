import "./globals.css";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import LocaleSetter from "../../components/LocaleSetter";
import AIHubBackground from "../../components/AIHubBackground";
import type { Metadata } from "next";
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: {
    default: "AI HUB - NEWS | Ultimate AI Intelligence Platform",
    template: "%s | AI HUB - NEWS"
  },
  description: "AI HUB - NEWS - Revolutionary AI platform featuring advanced agriculture intelligence, global news analysis, and cutting-edge AI technologies.",
};

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // read nonce from cookie set by middleware
  const cookieStore = await cookies();
  const nonce = cookieStore.get('csp-nonce')?.value ?? '';

  return (
    <>
      {nonce ? <meta name="csp-nonce" content={nonce} /> : null}
      <AIHubBackground />
      <NavBar />
      <LocaleSetter />
      <main className="mt-4 relative z-10">
        {children}
      </main>
      <Footer />
      <noscript>
        <div style={{padding:16,background:'#111',color:'#fff',textAlign:'center'}}>
          JavaScript kapalı — bazı özellikler çalışmayabilir.
        </div>
      </noscript>
    </>
  );
}
