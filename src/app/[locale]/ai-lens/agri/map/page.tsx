"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Map, 
  Layers, 
  Clock, 
  Satellite, 
  CloudRain, 
  Flame, 
  Activity,
  Droplets,
  Bug,
  Ship,
  BarChart3,
  RefreshCw,
  MapPin,
  Wifi,
  WifiOff
} from 'lucide-react';
import { SectionHero, LensCard, LensButton } from '@/components/lens';

interface RealTimeData {
  status?: string;
  [key: string]: string | number | boolean | undefined;
}

interface MapLayer {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  opacity: number;
  lastUpdated: string;
  description: string;
  source: string;
  dataPoints: number;
  coverage: string;
  realTimeData: RealTimeData;
}

interface MapData {
  layers: MapLayer[];
  meta: {
    totalLayers: number;
    enabledLayers: number;
    activeDataSources: Array<{
      name: string;
      status: string;
      latency: string;
    }>;
    lastUpdated: string;
    systemHealth: {
      overall: string;
      dataFreshness: string;
      apiResponsiveness: string;
    };
  };
  liveStats: {
    totalDataPoints: number;
    averageCoverage: number;
    activeMonitoring: number;
  };
}

export default function AgriMapPage() {
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchMapData, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  useEffect(() => {
    fetchMapData();
    
    // Check online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchMapData = async () => {
    try {
      const response = await fetch('/api/agri/map/layers');
      if (response.ok) {
        const data = await response.json();
        setMapData(data);
        setLastRefresh(new Date());
        setIsOnline(true);
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Failed to fetch map data:', error);
      setIsOnline(false);
      // Keep existing data on error, but show offline status
    } finally {
      setLoading(false);
    }
  };

  const toggleLayer = (layerId: string) => {
    if (!mapData) return;
    
    const updatedData = {
      ...mapData,
      layers: mapData.layers.map(layer => 
        layer.id === layerId 
          ? { ...layer, enabled: !layer.enabled }
          : layer
      )
    };
    setMapData(updatedData);
  };

  const getLayerIcon = (type: string) => {
    switch (type) {
      case 'satellite': return Satellite;
      case 'weather': return CloudRain;
      case 'disaster': return Flame;
      case 'climate': return Droplets;
      case 'infrastructure': return Ship;
      case 'analysis': return BarChart3;
      case 'monitoring': return Bug;
      default: return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'degraded': return 'text-yellow-400';
      case 'unavailable': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const formatDataValue = (value: string | number | boolean | undefined): string => {
    if (typeof value === 'number') {
      return value > 100 ? value.toLocaleString() : value.toFixed(1);
    }
    return String(value || 'N/A');
  };

  const activeLayersData = useMemo(() => {
    if (!mapData) return [];
    return mapData.layers.filter(layer => layer.enabled);
  }, [mapData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1d23] to-[#0f1419] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-brand-2 animate-spin mx-auto mb-4" />
          <p className="text-muted">Canlı veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1d23] to-[#0f1419]">
      <SectionHero
        title="Canlı Tarım Haritası"
        subtitle="Gerçek zamanlı uydu verileri, hava durumu koşulları ve tarım zekası"
        showParticles={false}
        className="pt-20 pb-12"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Map className="w-8 h-8 text-brand-2" />
            <div className="text-left">
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <Wifi className="w-4 h-4 text-green-400" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-400" />
                )}
                <span className="text-sm text-muted">
                  Son güncelleme: {lastRefresh.toLocaleTimeString()}
                </span>
              </div>
              {mapData && (
                <div className="text-xs text-muted mt-1">
                  {mapData.liveStats.totalDataPoints.toLocaleString()} veri noktası • 
                  %{mapData.liveStats.averageCoverage} kapsama
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <LensButton
              variant="ghost"
              size="sm"
              onClick={fetchMapData}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Yenile
            </LensButton>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                autoRefresh 
                  ? 'bg-brand-2 text-white' 
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              {autoRefresh ? 'Auto ON' : 'Auto OFF'}
            </button>
          </div>
        </div>

        {/* System Status Bar */}
        {mapData && (
          <div className="bg-black/20 backdrop-blur-sm border border-brand-2/20 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className={`text-lg font-bold ${getStatusColor(mapData.meta.systemHealth.overall)}`}>
                  {mapData.meta.systemHealth.overall.toUpperCase()}
                </div>
                <div className="text-xs text-muted">Sistem Durumu</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-brand-2">
                  {mapData.meta.systemHealth.dataFreshness}
                </div>
                <div className="text-xs text-muted">Veri Tazeliği</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">
                  {mapData.liveStats.activeMonitoring}/{mapData.meta.totalLayers}
                </div>
                <div className="text-xs text-muted">Aktif İzleme</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-400">
                  {mapData.meta.systemHealth.apiResponsiveness}
                </div>
                <div className="text-xs text-muted">API Yanıt</div>
              </div>
            </div>
          </div>
        )}
      </SectionHero>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Interactive Map Area */}
          <div className="lg:col-span-3">
            <LensCard className="h-[600px] relative overflow-hidden">
              <div className="absolute inset-4 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900">
                {/* Map Grid Background */}
                <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full"
                    style={{
                      backgroundImage: `
                        linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
                      `,
                      backgroundSize: '20px 20px'
                    }}
                  />
                </div>

                {/* Active Layer Visualizations */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-6 max-w-md">
                    <Map className="w-20 h-20 text-brand-2 mx-auto opacity-50" />
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Etkileşimli Harita
                      </h3>
                      <p className="text-muted text-sm mb-4">
                        {activeLayersData.length} aktif katman ile gerçek zamanlı görselleştirme
                      </p>
                    </div>

                    {/* Active Layers Preview */}
                    {activeLayersData.length > 0 && (
                      <div className="grid grid-cols-2 gap-3">
                        {activeLayersData.slice(0, 4).map((layer) => (
                          <motion.div
                            key={layer.id}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-black/30 rounded-lg p-3 border border-brand-2/20"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              {React.createElement(getLayerIcon(layer.type), { 
                                className: "w-4 h-4 text-brand-2" 
                              })}
                              <span className="text-xs font-medium text-foreground">
                                {layer.name}
                              </span>
                            </div>
                            <div className="text-xs text-muted space-y-1">
                              <div>📍 {formatDataValue(layer.dataPoints)} nokta</div>
                              <div>📊 {layer.coverage} kapsama</div>
                              {layer.realTimeData.status && (
                                <div className={`flex items-center gap-1 ${getStatusColor(layer.realTimeData.status)}`}>
                                  <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                                  {layer.realTimeData.status}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Map Coordinates Overlay */}
                <div className="absolute top-4 left-4 bg-black/50 rounded px-2 py-1 text-xs text-muted">
                  <MapPin className="w-3 h-3 inline mr-1" />
                  39.93°N, 32.86°E
                </div>

                {/* Data Source Status */}
                <div className="absolute bottom-4 right-4 bg-black/50 rounded px-2 py-1 text-xs">
                  {mapData && (
                    <div className="flex items-center gap-2">
                      {mapData.meta.activeDataSources.slice(0, 2).map((source) => (
                        <div key={source.name} className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${
                            source.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'
                          }`} />
                          <span className="text-muted text-xs">{source.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </LensCard>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            {/* Real-time Stats */}
            {mapData && (
              <LensCard>
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-brand-2" />
                  <h3 className="font-semibold text-foreground">Canlı İstatistikler</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gradient-to-br from-brand-2/10 to-brand-2/5 rounded-lg">
                    <div className="text-lg font-bold text-brand-2">
                      {mapData.liveStats.totalDataPoints.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted">Toplam Veri</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-lg">
                    <div className="text-lg font-bold text-green-400">
                      %{mapData.liveStats.averageCoverage}
                    </div>
                    <div className="text-xs text-muted">Kapsama</div>
                  </div>
                </div>
              </LensCard>
            )}

            {/* Layer Control */}
            <LensCard>
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5 text-brand-2" />
                <h3 className="font-semibold text-foreground">Harita Katmanları</h3>
                {mapData && (
                  <span className="text-xs text-muted ml-auto">
                    {mapData.meta.enabledLayers}/{mapData.meta.totalLayers} aktif
                  </span>
                )}
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {mapData?.layers.map((layer) => {
                  const IconComponent = getLayerIcon(layer.type);
                  return (
                    <motion.div 
                      key={layer.id} 
                      className="p-3 rounded-lg bg-card-dark border border-brand-2/20 hover:border-brand-2/40 transition-colors"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <IconComponent className="w-4 h-4 text-brand-2 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {layer.name}
                            </p>
                            <p className="text-xs text-muted truncate">
                              {layer.source}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleLayer(layer.id)}
                          className={`w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
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
                      
                      {/* Layer Statistics */}
                      <div className="text-xs text-muted space-y-1">
                        <div className="flex justify-between">
                          <span>Veri Noktası:</span>
                          <span className="text-brand-2">{formatDataValue(layer.dataPoints)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Kapsama:</span>
                          <span className="text-green-400">{layer.coverage}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Durum:</span>
                          <span className={getStatusColor(layer.realTimeData.status || 'unknown')}>
                            {layer.realTimeData.status || 'Bilinmiyor'}
                          </span>
                        </div>
                      </div>

                      {/* Real-time data preview */}
                      {layer.enabled && layer.realTimeData && (
                        <div className="mt-2 pt-2 border-t border-brand-2/10">
                          <div className="text-xs text-muted space-y-1">
                            {Object.entries(layer.realTimeData).slice(0, 3).map(([key, value]) => (
                              key !== 'status' && (
                                <div key={key} className="flex justify-between">
                                  <span className="capitalize">{key}:</span>
                                  <span className="text-white">{formatDataValue(value)}</span>
                                </div>
                              )
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </LensCard>

            {/* Data Sources Status */}
            {mapData && (
              <LensCard>
                <div className="flex items-center gap-2 mb-4">
                  <Wifi className="w-5 h-5 text-brand-2" />
                  <h3 className="font-semibold text-foreground">Veri Kaynakları</h3>
                </div>
                
                <div className="space-y-2">
                  {mapData.meta.activeDataSources.map((source) => (
                    <div key={source.name} className="flex items-center justify-between p-2 rounded bg-card-dark/50">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          source.status === 'active' ? 'bg-green-400 animate-pulse' : 
                          source.status === 'degraded' ? 'bg-yellow-400' : 'bg-red-400'
                        }`} />
                        <span className="text-sm text-foreground">{source.name}</span>
                      </div>
                      <div className="text-xs text-muted">{source.latency}</div>
                    </div>
                  ))}
                </div>
              </LensCard>
            )}

            {/* Time Control */}
            <LensCard>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-brand-2" />
                <h3 className="font-semibold text-foreground">Zaman Kontrolü</h3>
              </div>
              
              <div className="space-y-2">
                <LensButton variant="soft" size="sm" className="w-full justify-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2" />
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
              <h3 className="font-semibold text-foreground mb-4">Harita Açıklaması</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded animate-pulse"></div>
                  <span className="text-muted">Yüksek NDVI (Sağlıklı Bitki Örtüsü)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-muted">Orta NDVI (Normal Durum)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-muted">Düşük NDVI (Stresli Bitki Örtüsü)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-muted">Yağış ve Nem Oranı</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-orange-500 rounded animate-pulse"></div>
                  <span className="text-muted">Aktif Yangın Alanları</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <span className="text-muted">Sismik Aktivite</span>
                </div>
              </div>
            </LensCard>
          </div>
        </div>
      </div>
    </div>
  );
}
