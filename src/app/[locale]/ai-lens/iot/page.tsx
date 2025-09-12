"use client";

export default function IoTHub() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            IoT Hub
          </h1>
          <p className="text-gray-300 text-lg">Akıllı Cihaz Entegrasyonu ve Kontrol Merkezi</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">Akıllı Sayaçlar</h3>
            <div className="flex items-center justify-between">
              <span>Online Cihaz:</span>
              <span className="text-green-400">1,247</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-semibold mb-4 text-cyan-400">Sensörler</h3>
            <div className="flex items-center justify-between">
              <span>Hava Kalitesi:</span>
              <span className="text-green-400">89</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-semibold mb-4 text-purple-400">Enerji Monitörleri</h3>
            <div className="flex items-center justify-between">
              <span>Kısmi Online:</span>
              <span className="text-yellow-400">34/45</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
