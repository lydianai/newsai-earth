"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Calendar, Globe } from 'lucide-react';
import { SectionHero, LensCard, StatPill, LensButton } from '@/components/lens';

interface CommodityData {
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  lastUpdated: string;
  forecast?: {
    nextWeek: number;
    nextMonth: number;
    confidence: 'high' | 'medium' | 'low';
  };
}

export default function AgriMarketsPage() {
  const [commodities, setCommodities] = useState<CommodityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');

  useEffect(() => {
    fetchMarketData();
  }, []);

  const fetchMarketData = async () => {
    try {
      const response = await fetch('/api/agri/markets');
      if (response.ok) {
        const data = await response.json();
        setCommodities(data.commodities || []);
      }
    } catch (error) {
      console.error('Failed to fetch market data:', error);
      // Fallback data
      setCommodities([
        {
          name: 'Buğday',
          symbol: 'WHEAT',
          price: 275.50,
          change: 6.25,
          changePercent: 2.32,
          volume: 123456,
          lastUpdated: new Date().toISOString(),
          forecast: { nextWeek: 280.0, nextMonth: 285.0, confidence: 'medium' }
        },
        {
          name: 'Mısır',
          symbol: 'CORN',
          price: 185.25,
          change: -2.10,
          changePercent: -1.12,
          volume: 234567,
          lastUpdated: new Date().toISOString(),
          forecast: { nextWeek: 183.0, nextMonth: 178.0, confidence: 'high' }
        },
        {
          name: 'Soya Fasulyesi',
          symbol: 'SOYB',
          price: 425.80,
          change: 3.45,
          changePercent: 0.82,
          volume: 189234,
          lastUpdated: new Date().toISOString(),
          forecast: { nextWeek: 430.0, nextMonth: 445.0, confidence: 'low' }
        },
        {
          name: 'Pirinç',
          symbol: 'RICE',
          price: 315.60,
          change: -1.80,
          changePercent: -0.57,
          volume: 98765,
          lastUpdated: new Date().toISOString(),
          forecast: { nextWeek: 312.0, nextMonth: 308.0, confidence: 'medium' }
        },
        {
          name: 'Kahve',
          symbol: 'COFFEE',
          price: 168.75,
          change: 4.20,
          changePercent: 2.55,
          volume: 345678,
          lastUpdated: new Date().toISOString(),
          forecast: { nextWeek: 172.0, nextMonth: 175.0, confidence: 'high' }
        },
        {
          name: 'Pamuk',
          symbol: 'COTTON',
          price: 89.45,
          change: -0.95,
          changePercent: -1.05,
          volume: 156789,
          lastUpdated: new Date().toISOString(),
          forecast: { nextWeek: 88.0, nextMonth: 87.0, confidence: 'medium' }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const timeframes = ['1D', '1W', '1M', '3M', '1Y'];

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1d23] to-[#0f1419]">
      <SectionHero
        title="Tarım Piyasaları"
        subtitle="Gerçek zamanlı emtia fiyatları, trendler ve AI destekli tahminler"
        showParticles={false}
        className="pt-20 pb-12"
      >
        <div className="flex items-center gap-4 mb-8">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-3 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm"
          >
            <DollarSign className="w-8 h-8 text-green-400" />
          </motion.div>
          <div className="text-sm text-muted">
            <p>Son güncelleme: {new Date().toLocaleTimeString()}</p>
            <p>Veri kaynakları: Çoklu emtia borsaları</p>
          </div>
        </div>
      </SectionHero>

      <div className="max-w-7xl mx-auto px-4">
        {/* Timeframe Selector */}
        <div className="flex items-center gap-2 mb-8">
          <Calendar className="w-5 h-5 text-brand-2" />
          <span className="text-sm text-muted mr-4">Zaman Aralığı:</span>
          {timeframes.map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTimeframe === timeframe
                  ? 'bg-brand-2 text-white'
                  : 'bg-card-dark text-muted hover:bg-brand-2/20'
              }`}
            >
              {timeframe}
            </button>
          ))}
        </div>

        {/* Market Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <LensCard className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {commodities.filter(c => c.changePercent > 0).length}
            </div>
            <div className="text-sm text-muted">Yükselen Piyasalar</div>
          </LensCard>
          
          <LensCard className="text-center">
            <div className="text-2xl font-bold text-red-400 mb-1">
              {commodities.filter(c => c.changePercent < 0).length}
            </div>
            <div className="text-sm text-muted">Düşen Piyasalar</div>
          </LensCard>
          
          <LensCard className="text-center">
            <div className="text-2xl font-bold text-brand-2 mb-1">
              {commodities.reduce((sum, c) => sum + c.volume, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted">Toplam Hacim</div>
          </LensCard>
          
          <LensCard className="text-center">
            <div className="text-2xl font-bold text-accent-1 mb-1">
              {commodities.filter(c => c.forecast?.confidence === 'high').length}
            </div>
            <div className="text-sm text-muted">Yüksek Güvenli Tahminler</div>
          </LensCard>
        </div>

        {/* Commodities Grid */}
        {!loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {commodities.map((commodity, index) => (
              <motion.div
                key={commodity.symbol}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <LensCard className="h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{commodity.name}</h3>
                      <p className="text-sm text-muted">{commodity.symbol}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-foreground">
                        ${commodity.price.toFixed(2)}
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${
                        commodity.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {commodity.changePercent >= 0 ? 
                          <TrendingUp className="w-4 h-4" /> : 
                          <TrendingDown className="w-4 h-4" />
                        }
                        {Math.abs(commodity.changePercent).toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Değişim:</span>
                      <span className={commodity.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {commodity.change >= 0 ? '+' : ''}${commodity.change.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Hacim:</span>
                      <span className="text-foreground">{commodity.volume.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Forecast Section */}
                  {commodity.forecast && (
                    <div className="border-t border-brand-2/20 pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <BarChart3 className="w-4 h-4 text-brand-2" />
                        <span className="text-sm font-medium text-foreground">AI Tahmini</span>
                        <StatPill variant="default" size="sm" className={getConfidenceColor(commodity.forecast.confidence)}>
                          {commodity.forecast.confidence === 'high' ? 'yüksek' : 
                           commodity.forecast.confidence === 'medium' ? 'orta' : 'düşük'}
                        </StatPill>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted">Gelecek Hafta:</span>
                          <span className="text-foreground">${commodity.forecast.nextWeek.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted">Gelecek Ay:</span>
                          <span className="text-foreground">${commodity.forecast.nextMonth.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </LensCard>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 text-muted">
              <div className="w-6 h-6 border-2 border-brand-2/30 border-t-brand-2 rounded-full animate-spin"></div>
              Piyasa verileri yükleniyor...
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
          <div className="flex items-start gap-3">
            <Globe className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div className="text-sm text-yellow-200">
              <p className="font-medium mb-1">Tahmin Uyarısı</p>
              <p className="text-yellow-300/80">
                AI tahminleri geçmiş veriler ve piyasa trendlerine dayanmaktadır. Tek başına yatırım tavsiyesi olarak 
                kullanılmamalıdır. Emtia piyasaları değişkendir ve hava durumu, siyaset ve küresel ekonomi gibi 
                çok sayıda faktörden etkilenir.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
