"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Eye, Search, BarChart3, Globe, Atom, Headset, Brain, Cpu, Zap, TrendingUp,
  Activity, Users, Database, Wifi, FileText, Cog, CreditCard
} from 'lucide-react';
import Link from "next/link";
import { SectionHero, KPIGrid, LensCard, StatPill, LensButton } from "@/components/lens";

interface ModuleStatus {
  id: string;
  name: string;
  status: 'online' | 'maintenance' | 'offline';
  users: number;
  lastUpdate: string;
}

interface LiveMetrics {
  totalQueries: number;
  activeUsers: number;
  quantumCircuits: number;
  dataSources: number;
  uptime: number;
}

export default function AILensDashboard() {
  const [liveMetrics, setLiveMetrics] = useState<LiveMetrics>({
    totalQueries: 2420847,
    activeUsers: 127834,
    quantumCircuits: 15892,
    dataSources: 342,
    uptime: 99.94
  });

  const [moduleStatuses, setModuleStatuses] = useState<ModuleStatus[]>([
    { id: 'dashboard', name: 'Dashboard', status: 'online', users: 1247, lastUpdate: '2s önce' },
    { id: 'earthbrief', name: 'EarthBrief', status: 'online', users: 8934, lastUpdate: '1s önce' },
    { id: 'digital-twin', name: 'Dijital İkiz', status: 'online', users: 3245, lastUpdate: '3s önce' },
    { id: 'search', name: 'Arama', status: 'online', users: 5623, lastUpdate: '1s önce' },
    { id: 'predict', name: 'Tahmin', status: 'online', users: 2156, lastUpdate: '5s önce' },
    { id: 'research', name: 'Araştırma', status: 'online', users: 1832, lastUpdate: '2s önce' },
    { id: 'quantum', name: 'Kuantum', status: 'online', users: 892, lastUpdate: '4s önce' },
    { id: 'metaverse', name: 'Metaverse', status: 'online', users: 1456, lastUpdate: '3s önce' },
    { id: 'agents', name: 'AI Ajanları', status: 'online', users: 2734, lastUpdate: '1s önce' },
    { id: 'media', name: 'Medya', status: 'online', users: 3421, lastUpdate: '2s önce' },
    { id: 'reports', name: 'Raporlar', status: 'online', users: 1687, lastUpdate: '6s önce' },
    { id: 'automation', name: 'Otomasyon', status: 'online', users: 945, lastUpdate: '4s önce' },
    { id: 'community', name: 'Topluluk', status: 'online', users: 4321, lastUpdate: '2s önce' },
    { id: 'analytics', name: 'Analitik', status: 'online', users: 2156, lastUpdate: '3s önce' },
    { id: 'iot', name: 'IoT Hub', status: 'online', users: 1534, lastUpdate: '5s önce' },
    { id: 'billing', name: 'Faturalandırma', status: 'online', users: 734, lastUpdate: '7s önce' },
  ]);

  useEffect(() => {
    // Simulate live metrics updates
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        ...prev,
        totalQueries: prev.totalQueries + Math.floor(Math.random() * 100) + 10,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 20) - 10,
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const moduleIcons: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
    'dashboard': BarChart3,
    'earthbrief': Eye,
    'digital-twin': Globe,
    'search': Search,
    'predict': TrendingUp,
    'research': Brain,
    'quantum': Atom,
    'metaverse': Headset,
    'agents': Cpu,
    'media': FileText,
    'reports': FileText,
    'automation': Cog,
    'community': Users,
    'analytics': BarChart3,
    'iot': Wifi,
    'billing': CreditCard,
  };

  const coreModules = [
    { 
      id: 'earthbrief', 
      name: 'EarthBrief', 
      description: 'Gerçek zamanlı analizli global haber zeka sistemi',
      gradient: 'from-brand-1 to-brand-2',
      href: '/ai-lens/earthbrief'
    },
    { 
      id: 'digital-twin', 
      name: 'Dijital İkiz', 
      description: 'Gerçek zamanlı Dünya simülasyonu ve modellemesi',
      gradient: 'from-accent-2 to-brand-1',
      href: '/ai-lens/digital-twin'
    },
    { 
      id: 'quantum', 
      name: 'Kuantum Laboratuvarı', 
      description: 'Gelişmiş kuantum bilgisayar algoritmaları',
      gradient: 'from-brand-2 to-accent-1',
      href: '/ai-lens/quantum'
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Dashboard Header */}
      <SectionHero 
        title="AI NEWS - HUB Dashboard"
        subtitle="Ultra Master Intelligence Hub - Gerçek Zamanlı Platform Kontrol Merkezi"
        showParticles={false}
        className="pb-16"
      >
        <div className="text-center space-y-6">
          {/* Live Status Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            <StatPill variant="live">🔴 CANLI - {liveMetrics.totalQueries.toLocaleString()}+ Sorgu</StatPill>
            <StatPill variant="success">✅ Tüm Sistemler Çevrimiçi</StatPill>
            <StatPill variant="default">⚡ %{liveMetrics.uptime} Çalışma Süresi</StatPill>
            <StatPill variant="default">📊 16 Modül Aktif</StatPill>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4">
            <LensButton 
              variant="primary" 
              leftIcon={<Eye />}
              className="font-semibold"
            >
              <Link href="/ai-lens/earthbrief">EarthBrief Başlat</Link>
            </LensButton>
            <LensButton variant="ghost" leftIcon={<Globe />}>
              <Link href="/ai-lens/digital-twin">Dijital İkiz</Link>
            </LensButton>
            <LensButton variant="ghost" leftIcon={<Atom />}>
              <Link href="/ai-lens/quantum">Kuantum Laboratuvarı</Link>
            </LensButton>
          </div>
        </div>
      </SectionHero>

      <div className="container mx-auto px-6 pb-24">
        {/* Live Metrics KPIs */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-heading font-bold text-text mb-8 text-center">
            Canlı Platform Metrikleri
          </h2>
          
          <KPIGrid columns={4} gap="md">
            <LensCard className="text-center">
              <div className="space-y-3">
                <Activity className="w-8 h-8 text-brand-1 mx-auto" />
                <div className="text-3xl font-bold text-brand-1">
                  {liveMetrics.totalQueries.toLocaleString()}
                </div>
                <div className="text-muted text-sm">İşlenen Toplam Sorgu</div>
                <StatPill variant="live" size="sm">Canlı</StatPill>
              </div>
            </LensCard>

            <LensCard className="text-center">
              <div className="space-y-3">
                <Users className="w-8 h-8 text-brand-2 mx-auto" />
                <div className="text-3xl font-bold text-brand-2">
                  {liveMetrics.activeUsers.toLocaleString()}
                </div>
                <div className="text-muted text-sm">Aktif Kullanıcı</div>
                <StatPill variant="success" size="sm">Çevrimiçi</StatPill>
              </div>
            </LensCard>

            <LensCard className="text-center">
              <div className="space-y-3">
                <Atom className="w-8 h-8 text-accent-1 mx-auto" />
                <div className="text-3xl font-bold text-accent-1">
                  {liveMetrics.quantumCircuits.toLocaleString()}
                </div>
                <div className="text-muted text-sm">Kuantum Devresi</div>
                <StatPill variant="default" size="sm">Kuantum</StatPill>
              </div>
            </LensCard>

            <LensCard className="text-center">
              <div className="space-y-3">
                <Database className="w-8 h-8 text-accent-2 mx-auto" />
                <div className="text-3xl font-bold text-accent-2">
                  {liveMetrics.dataSources}
                </div>
                <div className="text-muted text-sm">Canlı Veri Kaynağı</div>
                <StatPill variant="success" size="sm">Bağlı</StatPill>
              </div>
            </LensCard>
          </KPIGrid>
        </motion.section>

        {/* Core Modules */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-heading font-bold text-text mb-8 text-center">
            Çekirdek Intelligence Modülleri
          </h2>
          
          <KPIGrid columns={3} gap="lg">
            {coreModules.map((module) => {
              const moduleStatus = moduleStatuses.find(s => s.id === module.id);
              const IconComponent = moduleIcons[module.id];
              
              return (
                <Link key={module.id} href={module.href}>
                  <LensCard className="group cursor-pointer h-full" hoverable>
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div 
                          className={`p-4 rounded-xl bg-gradient-to-r ${module.gradient} shadow-glow group-hover:scale-110 transition-transform duration-300`}
                        >
                          <IconComponent className="w-8 h-8 text-bg" />
                        </div>
                        <div className="text-right">
                          <StatPill variant="success" size="sm">ÇEVRİMİÇİ</StatPill>
                          <div className="text-xs text-muted mt-1">
                            {moduleStatus?.users.toLocaleString()} kullanıcı
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-heading font-bold text-text mb-2 group-hover:text-brand-2 transition-colors">
                          {module.name}
                        </h3>
                        <p className="text-muted text-sm leading-relaxed">
                          {module.description}
                        </p>
                      </div>
                      
                      <div className="pt-2">
                        <div className="text-xs text-muted">
                          Son güncelleme: {moduleStatus?.lastUpdate}
                        </div>
                      </div>
                    </div>
                  </LensCard>
                </Link>
              );
            })}
          </KPIGrid>
        </motion.section>

        {/* All Modules Grid */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-heading font-bold text-text mb-8 text-center">
            Tüm Platform Modülleri
          </h2>
          
          <KPIGrid columns={4} gap="md">
            {moduleStatuses.map((module) => {
              const IconComponent = moduleIcons[module.id] || BarChart3;
              
              return (
                <Link key={module.id} href={`/ai-lens/${module.id}`}>
                  <LensCard className="group cursor-pointer text-center" hoverable>
                    <div className="space-y-3">
                      <IconComponent className="w-6 h-6 text-brand-2 mx-auto group-hover:text-accent-1 transition-colors" />
                      <div>
                        <h4 className="font-semibold text-text text-sm group-hover:text-brand-2 transition-colors">
                          {module.name}
                        </h4>
                        <div className="text-xs text-muted mt-1">
                          {module.users} aktif kullanıcı
                        </div>
                      </div>
                      <StatPill 
                        variant={module.status === 'online' ? 'success' : 'warning'} 
                        size="sm"
                      >
                        {module.status === 'online' ? 'ÇEVRİMİÇİ' : module.status.toUpperCase()}
                      </StatPill>
                    </div>
                  </LensCard>
                </Link>
              );
            })}
          </KPIGrid>
        </motion.section>

        {/* System Overview */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <h2 className="text-2xl font-heading font-bold text-text mb-8">
            Platform Durumu
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <LensCard className="text-center">
              <div className="space-y-3">
                <div className="text-6xl">🟢</div>
                <h3 className="font-bold text-text">Tüm Sistemler Çalışıyor</h3>
                <p className="text-muted text-sm">16/16 modül sorunsuz çalışıyor</p>
              </div>
            </LensCard>
            
            <LensCard className="text-center">
              <div className="space-y-3">
                <div className="text-6xl">⚡</div>
                <h3 className="font-bold text-text">Yüksek Performans</h3>
                <p className="text-muted text-sm">Bu ay %{liveMetrics.uptime} çalışma süresi</p>
              </div>
            </LensCard>
            
            <LensCard className="text-center">
              <div className="space-y-3">
                <div className="text-6xl">🚀</div>
                <h3 className="font-bold text-text">Sürekli İnovasyon</h3>
                <p className="text-muted text-sm">En son AI LENS v1.0.0 yayına alındı</p>
              </div>
            </LensCard>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
