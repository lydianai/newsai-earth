"use client";

import { motion } from "framer-motion";
import { Eye, Search, BarChart3, Globe, Atom, Headset, Brain, Cpu, Zap, TrendingUp } from 'lucide-react';
import Link from "next/link";
import { useEffect, useState } from "react";
import { SectionHero, KPIGrid, LensCard, StatPill, LensButton } from "@/components/lens";
import LiveDiscourseStream from "@/components/LiveDiscourseStream";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "AI NEWS - HUB by newsai.earth",
    "description": "Ultra Master AI Hub - Intelligence platform featuring EarthBrief global news, Digital Twin technology, Quantum Computing, Metaverse experiences, Research Intelligence, AI Agents, IoT connectivity and comprehensive Analytics Dashboard.",
    "url": "https://newsai.earth",
    "applicationCategory": "ScientificApplication",
    "operatingSystem": "Web Browser",
    "browserRequirements": "Requires JavaScript. Supported browsers: Chrome, Firefox, Safari, Edge",
    "softwareVersion": "1.0.0",
    "releaseNotes": "Revolutionary AI NEWS - HUB platform launch with comprehensive intelligence modules",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "creator": {
      "@type": "Organization",
      "name": "newsai.earth",
      "url": "https://newsai.earth",
      "logo": "https://newsai.earth/icon.svg"
    },
    "featureList": [
      "EarthBrief - Global News Intelligence Engine",
      "Digital Twin - Real-time Earth Simulation Technology", 
      "Quantum Computing - Advanced Algorithm Integration",
      "Metaverse - VR/AR Collaborative Environments",
      "Research Intelligence - Scientific Discovery Lab",
      "AI Agents - Autonomous Intelligence Systems",
      "IoT Hub - Smart Device Integration Platform",
      "Advanced Analytics Dashboard - Comprehensive Insights",
      "Predict - Future Trend Analysis",
      "Search - Intelligent Information Discovery"
    ],
    "applicationSubCategory": [
      "Artificial Intelligence",
      "Scientific Computing", 
      "Data Analytics",
      "Virtual Reality",
      "Internet of Things",
      "Quantum Computing",
      "Knowledge Management"
    ]
  };

  const moduleFeatures = [
    { 
      icon: BarChart3, 
      title: "Dashboard", 
      description: "Kapsamlı AI kontrol paneli ile tüm modülleri tek ekranda yönetin", 
      href: "/ai-lens/dashboard",
      gradient: "from-brand-2 to-accent-1",
      badge: "LIVE"
    },
    { 
      icon: Eye, 
      title: "EarthBrief", 
      description: "Global haber ve analiz motoru - gerçek zamanlı dünya istihbaratı", 
      href: "/ai-lens/earthbrief",
      gradient: "from-brand-1 to-brand-2",
      badge: "MULTI-SOURCE"
    },
    { 
      icon: Globe, 
      title: "Digital Twin", 
      description: "Dünya'nın canlı dijital kopyası - interaktif 3D simülasyon", 
      href: "/ai-lens/digital-twin",
      gradient: "from-accent-2 to-brand-1",
      badge: "3D"
    },
    { 
      icon: Search, 
      title: "Search", 
      description: "Çok kaynaklı akıllı arama - hibrit sonuçlar ve citation sistemli", 
      href: "/ai-lens/search",
      gradient: "from-brand-2 to-accent-2",
      badge: "AI"
    },
    { 
      icon: TrendingUp, 
      title: "Predict", 
      description: "Gelecek trend analizi - makine öğrenmesi ile tahminleme", 
      href: "/ai-lens/predict",
      gradient: "from-accent-1 to-brand-2",
      badge: "ML"
    },
    { 
      icon: Brain, 
      title: "Research", 
      description: "Bilimsel araştırma laboratuvarı - yayın ve patent analizi", 
      href: "/ai-lens/research",
      gradient: "from-brand-1 to-accent-2",
      badge: "SCIENTIFIC"
    },
    { 
      icon: Atom, 
      title: "Quantum", 
      description: "Quantum computing simülatörü - gelişmiş algoritma devresi", 
      href: "/ai-lens/quantum",
      gradient: "from-brand-2 to-brand-1",
      badge: "QUANTUM"
    },
    { 
      icon: Headset, 
      title: "Metaverse", 
      description: "VR/AR işbirlikçi ortamlar - sanal gerçeklik deneyimi", 
      href: "/ai-lens/metaverse",
      gradient: "from-accent-1 to-accent-2",
      badge: "VR/AR"
    },
    { 
      icon: Cpu, 
      title: "AI Agents", 
      description: "Otonom yapay zeka ajanları - akıllı görev otomasyonu", 
      href: "/ai-lens/agents",
      gradient: "from-brand-2 to-accent-1",
      badge: "AUTONOMOUS"
    },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Live Discourse Stream - Sol tarafta sabit */}
      <LiveDiscourseStream />
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <SectionHero 
          title="AI NEWS - HUB"
          subtitle="Ultra Master AI Hub - Dünyayı Tek Bakışta Gören Intelligence Platform"
          showParticles={true}
          className="min-h-screen flex items-center"
        >
          <div className="text-center space-y-8">
            {/* Main CTA */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4"
            >
              <LensButton 
                variant="primary" 
                size="lg"
                leftIcon={<Zap className="w-5 h-5" />}
                className="text-lg font-bold w-full sm:w-auto min-w-[200px]"
                style={{
                  background: 'var(--grad-accent)',
                  color: 'var(--bg)',
                }}
              >
                <Link href="/ai-lens/dashboard" className="block w-full text-center">
                  AI LENS&apos;e Gir
                </Link>
              </LensButton>
              
              <LensButton 
                variant="ghost" 
                size="lg"
                leftIcon={<Eye className="w-5 h-5" />}
                className="text-lg w-full sm:w-auto min-w-[200px]"
              >
                <Link href="/ai-lens/earthbrief" className="block w-full text-center">
                  Dünya Özeti Başlat
                </Link>
              </LensButton>
            </motion.div>

            {/* Live Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-wrap justify-center gap-4 pt-8"
            >
              <StatPill variant="live">🔴 LIVE - 2.4M+ Queries</StatPill>
              <StatPill variant="success">✅ Multi-Source</StatPill>
              <StatPill variant="default">⚡ SSE Real-time</StatPill>
              <StatPill variant="default">🌐 100+ Languages</StatPill>
            </motion.div>
          </div>
        </SectionHero>

        {/* Modules Grid */}
        <section className="py-24 px-6">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-heading font-bold mb-6 bg-lens-accent bg-clip-text text-transparent"
                style={{
                  background: 'var(--grad-accent)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Intelligence Modules
              </h2>
              <p className="text-xl text-muted max-w-3xl mx-auto">
                AI LENS platform&apos;unda bulunan 9 temel modül ile dünyayı keşfedin, 
                analiz edin ve geleceği öngörün. Her modül özel olarak tasarlanmış 
                yapay zeka teknolojileri içerir.
              </p>
            </motion.div>

            <KPIGrid columns={3} gap="lg" className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {moduleFeatures.map((feature) => (
                <Link key={feature.title} href={feature.href}>
                  <LensCard className="group cursor-pointer h-full" hoverable>
                    <div className="space-y-4">
                      {/* Icon & Badge */}
                      <div className="flex items-start justify-between">
                        <div 
                          className={`p-4 rounded-xl bg-gradient-to-r ${feature.gradient} shadow-glow group-hover:scale-110 transition-transform duration-300`}
                        >
                          <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-bg" />
                        </div>
                        <StatPill variant="default" size="sm">
                          {feature.badge}
                        </StatPill>
                      </div>
                      
                      {/* Content */}
                      <div>
                        <h3 className="text-lg sm:text-xl font-heading font-bold text-text mb-3 group-hover:text-brand-2 transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-sm sm:text-base text-muted leading-relaxed group-hover:text-text transition-colors">
                          {feature.description}
                        </p>
                      </div>
                      
                      {/* Launch Button */}
                      <div className="pt-2">
                        <LensButton 
                          variant="ghost" 
                          size="sm"
                          rightIcon={<Zap className="w-4 h-4" />}
                          className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Modülü Başlat
                        </LensButton>
                      </div>
                    </div>
                  </LensCard>
                </Link>
              ))}
            </KPIGrid>
          </div>
        </section>

        {/* Platform Stats */}
        <section className="py-24 px-6 bg-panel/30">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h2 className="text-3xl font-heading font-bold mb-12 text-text">
                Platform İstatistikleri
              </h2>
              
              <KPIGrid columns={4} gap="lg" className="grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { 
                    label: "Aktif Kullanıcı", 
                    value: "127K+", 
                    icon: "👥",
                    color: "text-brand-1" 
                  },
                  { 
                    label: "İşlenen Sorgu", 
                    value: "2.4M+", 
                    icon: "⚡",
                    color: "text-brand-2" 
                  },
                  { 
                    label: "Quantum Devre", 
                    value: "15.8K+", 
                    icon: "⚛️",
                    color: "text-accent-1" 
                  },
                  { 
                    label: "Canlı Veri Kaynağı", 
                    value: "340+", 
                    icon: "📡",
                    color: "text-accent-2" 
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <LensCard className="text-center">
                      <div className="space-y-3">
                        <div className="text-2xl sm:text-3xl">{stat.icon}</div>
                        <div className={`text-2xl sm:text-3xl font-bold ${stat.color}`}>
                          {stat.value}
                        </div>
                        <div className="text-muted text-xs sm:text-sm font-medium">
                          {stat.label}
                        </div>
                      </div>
                    </LensCard>
                  </motion.div>
                ))}
              </KPIGrid>
            </motion.div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 px-6">
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl mx-auto space-y-8"
            >
              <h2 className="text-4xl font-heading font-bold text-text">
                Geleceği Bugün Yaşayın
              </h2>
              <p className="text-xl text-muted">
                AI LENS ile yapay zekanın gücünü keşfedin. Quantum computing&apos;den 
                metaverse&apos;e, global haberlerden IoT&apos;ye kadar tüm teknolojiler 
                tek platformda.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
                <LensButton 
                  variant="primary" 
                  size="lg"
                  leftIcon={<Zap className="w-5 h-5" />}
                  className="font-bold w-full sm:w-auto min-w-[200px]"
                >
                  <Link href="/ai-lens/dashboard" className="block w-full text-center">
                    AI LENS&apos;e Başla
                  </Link>
                </LensButton>
                <LensButton 
                  variant="ghost" 
                  size="lg"
                  leftIcon={<Globe className="w-5 h-5" />}
                  className="w-full sm:w-auto min-w-[200px]"
                >
                  <Link href="/about" className="block w-full text-center">
                    Platform Hakkında
                  </Link>
                </LensButton>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
