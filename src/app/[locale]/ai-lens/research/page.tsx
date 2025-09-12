"use client";

import { useState } from "react";

interface ResearchProject {
  id: string;
  title: string;
  description: string;
  status: 'planning' | 'active' | 'completed' | 'paused';
  progress: number;
  type: 'hypothesis' | 'simulation' | 'data_analysis' | 'ml_experiment';
}

export default function ResearchLab() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const mockProjects: ResearchProject[] = [
    {
      id: '1',
      title: 'İklim Değişikliği Tahmin Modeli',
      description: 'Makine öğrenmesi kullanarak iklim değişikliği etkilerini tahmin etme',
      status: 'active',
      progress: 65,
      type: 'ml_experiment'
    },
    {
      id: '2',
      title: 'Quantum Algoritma Optimizasyonu',
      description: 'QAOA algoritmasının performansını artırma araştırması',
      status: 'planning',
      progress: 15,
      type: 'hypothesis'
    },
    {
      id: '3',
      title: 'Enerji Verimliliği Analizi',
      description: 'Akıllı şehir enerji tüketim paternlerinin analizi',
      status: 'completed',
      progress: 100,
      type: 'data_analysis'
    }
  ];

  const runExperiment = async () => {
    setIsRunning(true);
    // Simulate experiment run
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsRunning(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'completed': return 'text-blue-400';
      case 'paused': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hypothesis': return '🔬';
      case 'simulation': return '🧮';
      case 'data_analysis': return '📊';
      case 'ml_experiment': return '🤖';
      default: return '🔍';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-teal-950/30 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-green-400 bg-clip-text text-transparent">
            Research Lab
          </h1>
          <p className="text-gray-300 text-lg">Bilimsel Araştırma ve Deney Platformu</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Project List */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold mb-4 text-teal-400">Araştırma Projeleri</h3>
              
              <div className="space-y-3">
                {mockProjects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(project.id)}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      selectedProject === project.id
                        ? "bg-gradient-to-r from-teal-500/20 to-green-500/20 border border-teal-500/30"
                        : "bg-slate-800/30 hover:bg-slate-700/30"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{getTypeIcon(project.type)}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="font-medium text-sm">{project.title}</div>
                    <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                      <div 
                        className="bg-gradient-to-r from-teal-500 to-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{project.progress}% Complete</div>
                  </button>
                ))}
              </div>

              <button className="w-full mt-4 p-3 bg-gradient-to-r from-teal-500 to-green-600 rounded-lg hover:from-teal-600 hover:to-green-700 transition-all">
                + Yeni Proje
              </button>
            </div>
          </div>

          {/* Main Workspace */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hypothesis Testing */}
            <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold mb-4 text-green-400">Hipotez Testi</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Hipotez</label>
                  <textarea
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white resize-none"
                    rows={3}
                    placeholder="Hipotezinizi buraya yazın..."
                    defaultValue="İklim değişikliği ile enerji tüketimi arasında pozitif korelasyon vardır."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Test Türü</label>
                    <select className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white">
                      <option>Pearson Korelasyon</option>
                      <option>Spearman Korelasyon</option>
                      <option>T-Test</option>
                      <option>Chi-Square</option>
                      <option>ANOVA</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Güven Düzeyi</label>
                    <select className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white">
                      <option>%95 (α = 0.05)</option>
                      <option>%99 (α = 0.01)</option>
                      <option>%90 (α = 0.10)</option>
                    </select>
                  </div>
                </div>
                
                <button
                  onClick={runExperiment}
                  disabled={isRunning}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                    isRunning
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
                  }`}
                >
                  {isRunning ? "Test Çalıştırılıyor..." : "Hipotezi Test Et"}
                </button>
              </div>
            </div>

            {/* ML Sandbox */}
            <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold mb-4 text-purple-400">ML Sandbox</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Algoritma</label>
                  <select className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white">
                    <option>Linear Regression</option>
                    <option>Random Forest</option>
                    <option>Neural Network</option>
                    <option>SVM</option>
                    <option>K-Means</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Dataset</label>
                  <select className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white">
                    <option>İklim Verileri</option>
                    <option>Enerji Tüketimi</option>
                    <option>Piyasa Verileri</option>
                    <option>IoT Sensör Verileri</option>
                  </select>
                </div>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
                <div className="text-sm text-gray-400 mb-2">Model Performance</div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Accuracy:</span>
                    <span className="text-green-400">87.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Precision:</span>
                    <span className="text-blue-400">89.1%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recall:</span>
                    <span className="text-purple-400">85.7%</span>
                  </div>
                </div>
              </div>
              
              <button className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all">
                Model Eğit
              </button>
            </div>
          </div>

          {/* Results & Analytics */}
          <div className="lg:col-span-1 space-y-6">
            {/* Test Results */}
            <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold mb-4 text-blue-400">Test Sonuçları</h3>
              
              <div className="space-y-4">
                <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="text-sm font-medium text-green-400 mb-1">Hipotez Kabul</div>
                  <div className="text-xs text-gray-400">p-değeri: 0.003 &lt; 0.05</div>
                  <div className="text-xs text-gray-400">Korelasyon: r = 0.74</div>
                </div>
                
                <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="text-sm font-medium text-blue-400 mb-1">İstatistik</div>
                  <div className="text-xs text-gray-400">t-istatistiği: 3.42</div>
                  <div className="text-xs text-gray-400">df: 98</div>
                </div>
                
                <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <div className="text-sm font-medium text-purple-400 mb-1">Güven Aralığı</div>
                  <div className="text-xs text-gray-400">%95 CI: [0.61, 0.83]</div>
                </div>
              </div>
            </div>

            {/* Data Visualization */}
            <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold mb-4 text-yellow-400">Veri Görselleştirme</h3>
              
              <div className="bg-slate-800/50 rounded-lg p-4 h-48 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl mb-2">📈</div>
                  <p className="text-gray-400 text-sm">Scatter Plot</p>
                  <p className="text-xs text-gray-500 mt-1">R² = 0.847</p>
                </div>
              </div>
            </div>

            {/* Experiment Log */}
            <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold mb-4 text-orange-400">Deney Geçmişi</h3>
              
              <div className="space-y-2">
                <div className="text-sm p-2 bg-slate-800/50 rounded">
                  <div className="text-orange-400 font-medium">14:32</div>
                  <div className="text-gray-400">Hipotez testi tamamlandı</div>
                </div>
                
                <div className="text-sm p-2 bg-slate-800/50 rounded">
                  <div className="text-orange-400 font-medium">14:15</div>
                  <div className="text-gray-400">Veri seti yüklendi (1000 kayıt)</div>
                </div>
                
                <div className="text-sm p-2 bg-slate-800/50 rounded">
                  <div className="text-orange-400 font-medium">14:08</div>
                  <div className="text-gray-400">Yeni proje başlatıldı</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
