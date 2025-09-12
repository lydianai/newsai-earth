"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wheat, TrendingUp, AlertTriangle, Map, BarChart3, Upload, Brain, Users } from 'lucide-react';
import Link from 'next/link';
import { SectionHero, KPIGrid, LensCard, StatPill, LensButton } from '@/components/lens';

interface AgriStats {
  globalNDVI: number;
  activeAlerts: number;
  topMovers: Array<{
    name: string;
    change: number;
    price: number;
  }>;
  marketUpdatedAt: string;
  weatherAlerts: number;
}

export default function AgriLensPage() {
  const [stats, setStats] = useState<AgriStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgriStats();
  }, []);

  const fetchAgriStats = async () => {
    try {
      const response = await fetch('/api/agri/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch agri stats:', error);
      // Fallback data
      setStats({
        globalNDVI: 0.65,
        activeAlerts: 23,
        topMovers: [
          { name: 'Buğday', change: 2.3, price: 275.50 },
          { name: 'Mısır', change: -1.2, price: 185.25 },
          { name: 'Soya Fasulyesi', change: 0.8, price: 425.80 }
        ],
        marketUpdatedAt: new Date().toISOString(),
        weatherAlerts: 7
      });
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      icon: Map,
      title: "Canlı Harita",
      description: "NDVI, Hava Durumu, Uyarılar",
      href: "/ai-lens/agri/map",
      gradient: "from-green-500 to-emerald-600",
      count: stats?.activeAlerts || 0
    },
    {
      icon: BarChart3,
      title: "Piyasalar",
      description: "Emtia Fiyatları ve Tahminler",
      href: "/ai-lens/agri/markets",
      gradient: "from-blue-500 to-cyan-600",
      count: stats?.topMovers.length || 0
    },
    {
      icon: AlertTriangle,
      title: "Uyarılar",
      description: "Zararlı, Hastalık, Hava Durumu",
      href: "/ai-lens/agri/alerts",
      gradient: "from-red-500 to-orange-600",
      count: stats?.activeAlerts || 0
    },
    {
      icon: Brain,
      title: "Öngörüler",
      description: "AI Raporları ve Soru-Cevap",
      href: "/ai-lens/agri/insights",
      gradient: "from-purple-500 to-violet-600",
      count: 12
    },
    {
      icon: Upload,
      title: "Veri Yükle",
      description: "CSV, JSON, GeoJSON Analizi",
      href: "/ai-lens/agri/upload",
      gradient: "from-indigo-500 to-blue-600",
      count: 0
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1d23] to-[#0f1419]">
      {/* Hero Section */}
      <SectionHero
        title="TARIH LENS"
        subtitle="Küresel Tarım ve Hayvancılık Zekası Platformu"
        showParticles={true}
        className="pt-20 pb-12"
      >
        <div className="flex items-center gap-4 mb-8">
          <motion.div
            animate={{ rotate: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-3 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm"
          >
            <Wheat className="w-8 h-8 text-green-400" />
          </motion.div>
          <motion.div
            animate={{ rotate: [0, -5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="p-3 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm"
          >
            <Users className="w-8 h-8 text-amber-400" />
          </motion.div>
        </div>
        
        {!loading && stats && (
          <div className="flex flex-wrap gap-4 justify-center">
            <StatPill variant="success" className="bg-green-500/10 border-green-500/30">
              Küresel NDVI: {stats.globalNDVI.toFixed(2)}
            </StatPill>
            <StatPill variant="warning" className="bg-red-500/10 border-red-500/30">
              Aktif Uyarılar: {stats.activeAlerts}
            </StatPill>
            <StatPill variant="default" className="bg-orange-500/10 border-orange-500/30">
              Hava Durumu Uyarıları: {stats.weatherAlerts}
            </StatPill>
          </div>
        )}
      </SectionHero>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Quick Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {quickActions.map((action, index) => (
            <Link key={action.title} href={action.href}>
              <LensCard className="h-full hover:scale-[1.02] transition-transform cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${action.gradient}`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{action.title}</h3>
                    <p className="text-sm text-muted mb-4">{action.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted">
                        {action.count > 0 ? `${action.count} öğe` : 'Mevcut'}
                      </span>
                      <LensButton variant="ghost" size="sm">
                        Keşfet →
                      </LensButton>
                    </div>
                  </div>
                </div>
              </LensCard>
            </Link>
          ))}
        </motion.div>

        {/* Market Movers */}
        {!loading && stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <LensCard className="mb-8">
              <h3 className="font-semibold text-foreground mb-2">Öne Çıkan Piyasa Hareketleri</h3>
              <p className="text-sm text-muted mb-6">En son emtia fiyat hareketleri</p>
              
              <div className="space-y-4">
                {stats.topMovers.map((mover, index) => (
                  <div key={mover.name} className="flex items-center justify-between p-4 rounded-lg bg-card-dark border border-brand-2/20">
                    <div>
                      <h4 className="font-medium text-foreground">{mover.name}</h4>
                      <p className="text-sm text-muted">${mover.price.toFixed(2)}</p>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                      mover.change > 0 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      <TrendingUp className={`w-4 h-4 ${mover.change < 0 ? 'rotate-180' : ''}`} />
                      {Math.abs(mover.change)}%
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Link href="/ai-lens/agri/markets">
                  <LensButton variant="soft">
                    Tüm Piyasaları Görüntüle →
                  </LensButton>
                </Link>
              </div>
            </LensCard>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 text-muted">
              <div className="w-6 h-6 border-2 border-brand-2/30 border-t-brand-2 rounded-full animate-spin"></div>
              Tarım zekası yükleniyor...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
