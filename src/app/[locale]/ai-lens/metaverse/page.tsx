"use client";

import { useState } from "react";

interface VRScene {
  id: string;
  name: string;
  type: 'market_sphere' | 'news_wall' | 'weather_dome' | 'knowledge_nebula';
  participants: number;
  isActive: boolean;
}

export default function Metaverse() {
  const [selectedScene, setSelectedScene] = useState<string>("market_sphere");
  const [isVRMode, setIsVRMode] = useState<boolean>(false);
  const [avatarConnected, setAvatarConnected] = useState<boolean>(false);

  const vrScenes: VRScene[] = [
    {
      id: "market_sphere",
      name: "Markets Sphere",
      type: "market_sphere",
      participants: 23,
      isActive: true
    },
    {
      id: "news_wall",
      name: "News Wall",
      type: "news_wall", 
      participants: 45,
      isActive: true
    },
    {
      id: "weather_dome",
      name: "Weather Dome",
      type: "weather_dome",
      participants: 12,
      isActive: true
    },
    {
      id: "knowledge_nebula",
      name: "Knowledge Nebula",
      type: "knowledge_nebula",
      participants: 8,
      isActive: false
    }
  ];

  const toggleVRMode = () => {
    setIsVRMode(!isVRMode);
    if (!isVRMode) {
      // Simulate VR connection
      setTimeout(() => {
        setAvatarConnected(true);
      }, 2000);
    } else {
      setAvatarConnected(false);
    }
  };

  const getSceneDescription = (type: string) => {
    switch (type) {
      case 'market_sphere':
        return 'Global piyasa verilerinin 3D görselleştirildiği interaktif küre';
      case 'news_wall':
        return 'Dünya haberlerinin canlı akışının görüntülendiği dev duvar';
      case 'weather_dome':
        return 'Küresel hava durumu ve iklim verilerinin simüle edildiği kubbe';
      case 'knowledge_nebula':
        return 'Bilgi parçacıklarının uzayda dans ettiği etkileşimli nebula';
      default:
        return 'Bilinmeyen sahne';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-pink-950/30 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">
            Metaverse
          </h1>
          <p className="text-gray-300 text-lg">VR/AR İşbirlikçi Sahne - Cosmic Cockpit</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* VR Control Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl p-6 border border-slate-700 mb-6">
              <h3 className="text-xl font-semibold mb-4 text-pink-400">VR Kontrol</h3>
              
              <div className="space-y-4">
                <div className={`p-3 rounded-lg border ${
                  isVRMode 
                    ? 'bg-green-500/20 border-green-500/30' 
                    : 'bg-slate-800/50 border-slate-600'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">VR Mode</span>
                    <div className={`w-3 h-3 rounded-full ${
                      isVRMode ? 'bg-green-400 animate-pulse' : 'bg-gray-500'
                    }`}></div>
                  </div>
                  <button
                    onClick={toggleVRMode}
                    className={`w-full py-2 px-4 rounded-lg transition-all ${
                      isVRMode
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-gradient-to-r from-pink-500 to-red-600 hover:from-pink-600 hover:to-red-700"
                    }`}
                  >
                    {isVRMode ? "VR'dan Çık" : "VR Başlat"}
                  </button>
                </div>

                <div className={`p-3 rounded-lg border ${
                  avatarConnected
                    ? 'bg-blue-500/20 border-blue-500/30'
                    : 'bg-slate-800/50 border-slate-600'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Avatar</span>
                    <div className={`w-3 h-3 rounded-full ${
                      avatarConnected ? 'bg-blue-400 animate-pulse' : 'bg-gray-500'
                    }`}></div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {avatarConnected ? 'Avatar senkronize' : 'Avatar bekleniyor...'}
                  </div>
                </div>

                <div className="p-3 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                  <div className="font-medium mb-1">Voice Control</div>
                  <div className="text-sm text-gray-400">🎤 Çok dilli STT/TTS aktif</div>
                </div>
              </div>
            </div>

            {/* Scene Selection */}
            <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold mb-4 text-purple-400">Sahne Seçimi</h3>
              
              <div className="space-y-3">
                {vrScenes.map((scene) => (
                  <button
                    key={scene.id}
                    onClick={() => setSelectedScene(scene.id)}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      selectedScene === scene.id
                        ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30"
                        : "bg-slate-800/30 hover:bg-slate-700/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{scene.name}</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          scene.isActive ? 'bg-green-400' : 'bg-gray-500'
                        }`}></div>
                        <span className="text-xs text-gray-400">{scene.participants}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {getSceneDescription(scene.type)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main VR Viewport */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl p-6 border border-slate-700 h-96 mb-6">
              <h3 className="text-xl font-semibold mb-4 text-red-400">
                {vrScenes.find(s => s.id === selectedScene)?.name || "VR Sahne"}
              </h3>
              
              {/* VR Scene Visualization */}
              <div className="bg-slate-800/50 rounded-lg h-80 flex items-center justify-center relative overflow-hidden">
                {isVRMode ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-red-900/20 animate-pulse">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-4 animate-spin">🌌</div>
                        <p className="text-pink-300">VR Sahne Aktif</p>
                        <p className="text-sm text-gray-400 mt-2">
                          {selectedScene === 'market_sphere' && "Piyasa küresinde geziniyorsunuz"}
                          {selectedScene === 'news_wall' && "Haber duvarını inceliyorsunuz"}
                          {selectedScene === 'weather_dome' && "Hava durumu kubbesinde"}
                          {selectedScene === 'knowledge_nebula' && "Bilgi nebulasında"}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-6xl mb-4">🥽</div>
                    <p className="text-gray-300">VR Sahne Görüntüleyicisi</p>
                    <p className="text-sm text-gray-400 mt-2">VR Mode&apos;u başlatın</p>
                  </div>
                )}
              </div>
            </div>

            {/* Multiplayer Status */}
            <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold mb-4 text-yellow-400">Multiplayer Status</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">
                    {vrScenes.find(s => s.id === selectedScene)?.participants || 0}
                  </div>
                  <div className="text-xs text-gray-400">Aktif Kullanıcı</div>
                </div>
                
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">4</div>
                  <div className="text-xs text-gray-400">Sahneler</div>
                </div>
                
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">89</div>
                  <div className="text-xs text-gray-400">Widget Gallery</div>
                </div>
                
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-pink-400">15ms</div>
                  <div className="text-xs text-gray-400">Latency</div>
                </div>
              </div>
            </div>
          </div>

          {/* Widget Gallery & Tools */}
          <div className="lg:col-span-1 space-y-6">
            {/* Widget Gallery */}
            <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold mb-4 text-cyan-400">Widget Gallery</h3>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "Chart", icon: "📊" },
                  { name: "Globe", icon: "🌍" },
                  { name: "News", icon: "📰" },
                  { name: "Weather", icon: "🌤️" },
                  { name: "Market", icon: "💹" },
                  { name: "3D Model", icon: "🗿" },
                  { name: "Calculator", icon: "🧮" },
                  { name: "Timer", icon: "⏰" }
                ].map((widget) => (
                  <button
                    key={widget.name}
                    className="p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg text-center transition-all hover:scale-105"
                  >
                    <div className="text-2xl mb-1">{widget.icon}</div>
                    <div className="text-xs">{widget.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Collaboration Tools */}
            <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold mb-4 text-orange-400">İşbirliği Araçları</h3>
              
              <div className="space-y-3">
                <button className="w-full p-2 bg-orange-500/20 hover:bg-orange-500/30 rounded-lg text-left transition-all">
                  <div className="flex items-center gap-2">
                    <span>🎙️</span>
                    <span className="text-sm">Voice Chat</span>
                  </div>
                </button>
                
                <button className="w-full p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-left transition-all">
                  <div className="flex items-center gap-2">
                    <span>✏️</span>
                    <span className="text-sm">Shared Whiteboard</span>
                  </div>
                </button>
                
                <button className="w-full p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-left transition-all">
                  <div className="flex items-center gap-2">
                    <span>📺</span>
                    <span className="text-sm">Screen Share</span>
                  </div>
                </button>
                
                <button className="w-full p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-left transition-all">
                  <div className="flex items-center gap-2">
                    <span>🤝</span>
                    <span className="text-sm">Gesture Sync</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Scene Editor */}
            <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold mb-4 text-indigo-400">Sahne Editörü</h3>
              
              <div className="space-y-3">
                <button className="w-full py-2 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all text-sm">
                  Özel Sahne Oluştur
                </button>
                
                <div className="text-xs text-gray-400 space-y-1">
                  <div>• 3D Object Placement</div>
                  <div>• Lighting Setup</div>
                  <div>• Physics Engine</div>
                  <div>• Texture Mapping</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
