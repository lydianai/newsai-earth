"use client";

export default function Knowledge() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Knowledge & RAG
          </h1>
          <p className="text-gray-300 text-lg">Çok Dilli Bilgi Bankası ve Arama Sistemi</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-semibold mb-4 text-purple-400">RAG Arama</h3>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Bilgi ara..." 
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white"
              />
              <button className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                Ara
              </button>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-semibold mb-4 text-pink-400">Vault</h3>
            <p className="text-gray-400">AES-256-GCM şifrelenmiş kişisel vault</p>
          </div>
        </div>
      </div>
    </div>
  );
}
