"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Map, Layers, Clock, Satellite, CloudRain, Flame, Activity } from 'lucide-react';
import { SectionHero, LensCard, LensButton } from '@/components/lens';

interface MapLayer {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  opacity: number;
  lastUpdated: string;
}

export default function AgriMapPage() {
  const [layers, setLayers] = useState<MapLayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLayers();
  }, []);

  const fetchLayers = async () => {
    try {
      const response = await fetch('/api/agri/map/layers');
      if (response.ok) {
        const data = await response.json();
        setLayers(data.layers || []);
      }
    } catch (error) {
      console.error('Failed to fetch map layers:', error);
      // Fallback data
      setLayers([
        {
          id: 'ndvi',
          name: 'NDVI Bitki Örtüsü',
          type: 'satellite',
          enabled: true,
          opacity: 0.8,
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'weather',
          name: 'Hava Durumu Koşulları',
          type: 'weather',
          enabled: true,
          opacity: 0.7,
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'fires',
          name: 'Aktif Yangınlar',
          type: 'disaster',
          enabled: false,
          opacity: 0.9,
          lastUpdated: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleLayer = (layerId: string) => {
    setLayers(prev => 
      prev.map(layer => 
        layer.id === layerId 
          ? { ...layer, enabled: !layer.enabled }
          : layer
      )
    );
  };

  const getLayerIcon = (type: string) => {
    switch (type) {
      case 'satellite': return Satellite;
      case 'weather': return CloudRain;
      case 'disaster': return Flame;
      default: return Activity;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1d23] to-[#0f1419]">
      <SectionHero
        title="Canlı Tarım Haritası"
        subtitle="Gerçek zamanlı uydu verileri, hava durumu koşulları ve tarım zekası"
        showParticles={false}
        className="pt-20 pb-12"
      >
        <div className="flex items-center gap-2 mb-8">
          <Map className="w-8 h-8 text-brand-2" />
          <span className="text-sm text-muted">
            Son güncelleme: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </SectionHero>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map Area */}
          <div className="lg:col-span-3">
            <LensCard className="h-[600px] relative">
              <div className="absolute inset-4 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Map className="w-16 h-16 text-brand-2 mx-auto opacity-50" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Etkileşimli Harita</h3>
                    <p className="text-muted">
                      Gerçek zamanlı katmanlar ile harita entegrasyonu buraya eklenecek
                    </p>
                  </div>
                  <div className="text-xs text-muted space-y-1">
                    <p>• NDVI Bitki Örtüsü İndeksi</p>
                    <p>• Hava Durumu Desenleri</p>
                    <p>• Yangın ve Afet Uyarıları</p>
                    <p>• Tarım Bölgeleri</p>
                  </div>
                </div>
              </div>
            </LensCard>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            {/* Layer Control */}
            <LensCard>
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5 text-brand-2" />
                <h3 className="font-semibold text-foreground">Harita Katmanları</h3>
              </div>
              
              <div className="space-y-3">
                {layers.map((layer) => {
                  const IconComponent = getLayerIcon(layer.type);
                  return (
                    <div key={layer.id} className="flex items-center justify-between p-3 rounded-lg bg-card-dark border border-brand-2/20">
                      <div className="flex items-center gap-3">
                        <IconComponent className="w-4 h-4 text-brand-2" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{layer.name}</p>
                          <p className="text-xs text-muted">
                            {new Date(layer.lastUpdated).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleLayer(layer.id)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          layer.enabled 
                            ? 'bg-brand-2' 
                            : 'bg-gray-600'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          layer.enabled ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </LensCard>

            {/* Time Control */}
            <LensCard>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-brand-2" />
                <h3 className="font-semibold text-foreground">Zaman Aralığı</h3>
              </div>
              
              <div className="space-y-3">
                <LensButton variant="soft" size="sm" className="w-full justify-start">
                  Gerçek zamanlı
                </LensButton>
                <LensButton variant="ghost" size="sm" className="w-full justify-start">
                  Son 24 saat
                </LensButton>
                <LensButton variant="ghost" size="sm" className="w-full justify-start">
                  Geçen hafta
                </LensButton>
                <LensButton variant="ghost" size="sm" className="w-full justify-start">
                  Özel aralık
                </LensButton>
              </div>
            </LensCard>

            {/* Legend */}
            <LensCard>
              <h3 className="font-semibold text-foreground mb-4">Açıklama</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-muted">Yüksek NDVI (Sağlıklı)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-muted">Orta NDVI</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-muted">Düşük NDVI (Stresli)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-muted">Yağış</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-orange-500 rounded animate-pulse"></div>
                  <span className="text-muted">Aktif Yangınlar</span>
                </div>
              </div>
            </LensCard>
          </div>
        </div>
      </div>
    </div>
  );
}
