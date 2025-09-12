"use client";

import { useState, useEffect } from "react";

interface GlobalData {
  type: string;
  country: string;
  value: number;
  latitude: number;
  longitude: number;
  color: string;
  label: string;
}

export default function DigitalTwin() {
  const [selectedMetric, setSelectedMetric] = useState<string>("energy");
  const [globalData, setGlobalData] = useState<GlobalData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchGlobalData();
  }, [selectedMetric]);

  const fetchGlobalData = async () => {
    setIsLoading(true);
    try {
      // Mock global data
      const mockData: GlobalData[] = [
        {
          type: "energy",
          country: "Turkey",
          value: 85.2,
          latitude: 39.0,
          longitude: 35.0,
          color: "#10b981",
          label: "Enerji Verimliliği: 85.2%"
        },
        {
          type: "energy",
          country: "Germany",
          value: 92.5,
          latitude: 51.0,
          longitude: 9.0,
          color: "#059669",
          label: "Enerji Verimliliği: 92.5%"
        },
        {
          type: "energy",
          country: "United States",
          value: 78.3,
          latitude: 40.0,
          longitude: -100.0,
          color: "#fbbf24",
          label: "Enerji Verimliliği: 78.3%"
        },
        {
          type: "energy",
          country: "China",
          value: 67.8,
          latitude: 35.0,
          longitude: 104.0,
          color: "#f59e0b",
          label: "Enerji Verimliliği: 67.8%"
        },
        {
          type: "energy",
          country: "Japan",
          value: 94.1,
          latitude: 36.0,
          longitude: 138.0,
          color: "#059669",
          label: "Enerji Verimliliği: 94.1%"
        }
      ];
      
      setGlobalData(mockData);
    } catch (error) {
      console.error("Failed to fetch global data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const metrics = [
    { value: "energy", label: "Enerji Akışı", icon: "⚡" },
    { value: "weather", label: "Hava Durumu", icon: "🌤️" },
    { value: "finance", label: "Piyasa Verileri", icon: "📈" },
    { value: "transport", label: "Ulaşım Ağı", icon: "🚀" },
    { value: "health", label: "Sağlık İndeksi", icon: "🏥" },
    { value: "environment", label: "Çevre Kalitesi", icon: "🌱" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950/30 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Digital Twin
          </h1>
          <p className="text-gray-300 text-lg">Dünya&apos;nın Gerçek Zamanlı Dijital Kopyası</p>
        </div>

        {/* Metric Selection */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {metrics.map((metric) => (
            <button
              key={metric.value}
              onClick={() => setSelectedMetric(metric.value)}
              className={`p-4 rounded-xl text-center transition-all ${
                selectedMetric === metric.value
                  ? "bg-gradient-to-r from-green-500 to-blue-500 shadow-lg shadow-green-500/25"
                  : "bg-slate-800/50 hover:bg-slate-700/50"
              }`}
            >
              <div className="text-2xl mb-2">{metric.icon}</div>
              <div className="text-sm font-medium">{metric.label}</div>
            </button>
          ))}
        </div>

        {/* Globe Visualization */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Globe Container */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl p-6 border border-slate-700 h-96">
              <h3 className="text-xl font-semibold mb-4 text-green-400">
                Global {metrics.find(m => m.value === selectedMetric)?.label} Haritası
              </h3>
              
              {/* 3D Globe Placeholder */}
              <div className="h-80 bg-slate-800/50 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-green-900/20 animate-pulse"></div>
                <div className="text-center z-10">
                  <div className="text-6xl mb-4">🌍</div>
                  <p className="text-gray-300">3D Globe yükleniyor...</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {selectedMetric === "energy" && "Enerji akışları ve neon çizgiler"}
                    {selectedMetric === "weather" && "Hava durumu overlay&apos;leri"}
                    {selectedMetric === "finance" && "Piyasa hareketleri"}
                    {selectedMetric === "transport" && "Ulaşım ağları"}
                    {selectedMetric === "health" && "Sağlık verileri"}
                    {selectedMetric === "environment" && "Çevre kalite indeksleri"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Panel */}
          <div className="space-y-6">
            {/* Live Stats */}
            <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4 text-green-400">Canlı İstatistikler</h3>
              
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-4 bg-slate-700 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {globalData.slice(0, 3).map((data, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: data.color }}
                        ></div>
                        <span className="text-sm text-gray-300">{data.country}</span>
                      </div>
                      <span className="text-sm font-medium">{data.value}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Predictive Analytics */}
            <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4 text-blue-400">Tahmin Analizi</h3>
              
              <div className="space-y-4">
                <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="text-sm font-medium text-blue-400 mb-1">Enerji Tüketimi</div>
                  <div className="text-xs text-gray-400">Önümüzdeki 24 saat: %12 artış bekleniyor</div>
                </div>
                
                <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <div className="text-sm font-medium text-yellow-400 mb-1">Hava Durumu</div>
                  <div className="text-xs text-gray-400">İstanbul&apos;da yağmur olasılığı: %75</div>
                </div>
                
                <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="text-sm font-medium text-green-400 mb-1">Çevre Kalitesi</div>
                  <div className="text-xs text-gray-400">Hava kalitesi: İyi seviyede</div>
                </div>
              </div>
            </div>

            {/* IoT Devices Status */}
            <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4 text-purple-400">IoT Cihazları</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded">
                  <span className="text-sm">Akıllı Sayaçlar</span>
                  <span className="text-green-400 text-xs">● Online (1,247)</span>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded">
                  <span className="text-sm">Hava Kalitesi Sensörleri</span>
                  <span className="text-green-400 text-xs">● Online (89)</span>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded">
                  <span className="text-sm">Enerji Monitörleri</span>
                  <span className="text-yellow-400 text-xs">● Kısmi (34/45)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alert System */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-xl p-6 border border-red-500/30">
            <h3 className="text-lg font-semibold mb-4 text-red-400">🚨 Acil Uyarılar</h3>
            <div className="space-y-2">
              <div className="text-sm text-gray-300">• İstanbul&apos;da enerji tüketimi normalin %20 üzerinde</div>
              <div className="text-sm text-gray-300">• Ankara&apos;da hava kalitesi endeksi düşük seviyede</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl p-6 border border-blue-500/30">
            <h3 className="text-lg font-semibold mb-4 text-blue-400">📊 Trend Analizi</h3>
            <div className="space-y-2">
              <div className="text-sm text-gray-300">• Yenilenebilir enerji kullanımı artıyor</div>
              <div className="text-sm text-gray-300">• Şehir içi ulaşım verimliliği iyileşiyor</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
