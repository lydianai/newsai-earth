"use client";

import { useState } from "react";

interface QuantumResults {
  algorithm: string;
  execTime: number;
  fidelity: number;
  shots: number;
  counts: Record<string, number>;
}

export default function QuantumLab() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>("grover");
  const [qubits, setQubits] = useState<number>(3);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [results, setResults] = useState<QuantumResults | null>(null);

  const algorithms = [
    { value: "grover", label: "Grover Algoritması", description: "Veri arama optimizasyonu" },
    { value: "shor", label: "Shor Algoritması", description: "Faktörizasyon algoritması" },
    { value: "qaoa", label: "QAOA", description: "Quantum Approximate Optimization" },
    { value: "vqe", label: "VQE", description: "Variational Quantum Eigensolver" },
    { value: "deutsch", label: "Deutsch-Jozsa", description: "Boolean fonksiyon analizi" },
    { value: "custom", label: "Özel Devre", description: "Kendi devrenizi oluşturun" }
  ];

  const executeCircuit = async () => {
    setIsExecuting(true);
    
    // Simulate quantum execution
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock results
    const mockResults = {
      algorithm: selectedAlgorithm,
      qubits: qubits,
      execTime: Math.random() * 1000 + 500,
      fidelity: 0.85 + Math.random() * 0.14,
      shots: 1024,
      counts: {
        "000": Math.floor(Math.random() * 200 + 100),
        "001": Math.floor(Math.random() * 150 + 50),
        "010": Math.floor(Math.random() * 150 + 50),
        "011": Math.floor(Math.random() * 100 + 25),
        "100": Math.floor(Math.random() * 150 + 50),
        "101": Math.floor(Math.random() * 100 + 25),
        "110": Math.floor(Math.random() * 100 + 25),
        "111": Math.floor(Math.random() * 200 + 100),
      },
      statevector: [
        { real: 0.707, imag: 0 },
        { real: 0, imag: 0.707 },
        { real: 0, imag: 0 },
        { real: 0, imag: 0 },
      ]
    };
    
    setResults(mockResults);
    setIsExecuting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-cyan-950/30 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Quantum Lab
          </h1>
          <p className="text-gray-300 text-lg">Quantum Algoritma Simülatörü ve Circuit Builder</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Algorithm Selection */}
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold mb-4 text-cyan-400">Algoritma Seçimi</h3>
              
              <div className="space-y-3">
                {algorithms.map((algo) => (
                  <button
                    key={algo.value}
                    onClick={() => setSelectedAlgorithm(algo.value)}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      selectedAlgorithm === algo.value
                        ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30"
                        : "bg-slate-800/30 hover:bg-slate-700/30"
                    }`}
                  >
                    <div className="font-medium">{algo.label}</div>
                    <div className="text-sm text-gray-400">{algo.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Circuit Configuration */}
            <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold mb-4 text-cyan-400">Devre Yapılandırması</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Qubit Sayısı</label>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={qubits}
                    onChange={(e) => setQubits(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-1">
                    <span>1</span>
                    <span className="font-medium text-cyan-400">{qubits}</span>
                    <span>8</span>
                  </div>
                </div>

                <button
                  onClick={executeCircuit}
                  disabled={isExecuting}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                    isExecuting
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  }`}
                >
                  {isExecuting ? "Çalıştırılıyor..." : "Devreyi Çalıştır"}
                </button>
              </div>
            </div>
          </div>

          {/* Circuit Visualization */}
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold mb-4 text-cyan-400">Quantum Circuit</h3>
              
              {/* Circuit Builder Placeholder */}
              <div className="bg-slate-800/50 rounded-lg p-4 h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-4">⚛️</div>
                  <p className="text-gray-300">Quantum Circuit Builder</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {selectedAlgorithm} - {qubits} Qubit
                  </p>
                </div>
              </div>
            </div>

            {/* Bloch Sphere */}
            <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold mb-4 text-blue-400">Bloch Sphere</h3>
              
              <div className="bg-slate-800/50 rounded-lg p-4 h-64 flex items-center justify-center relative">
                <div className="w-32 h-32 rounded-full border-2 border-blue-400/30 relative">
                  <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-cyan-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                  <div className="absolute top-0 left-1/2 text-xs text-blue-400 transform -translate-x-1/2 -translate-y-4">|0⟩</div>
                  <div className="absolute bottom-0 left-1/2 text-xs text-blue-400 transform -translate-x-1/2 translate-y-4">|1⟩</div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {results && (
              <>
                <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-xl font-semibold mb-4 text-green-400">Execution Results</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Algoritma:</span>
                      <span className="text-green-400 capitalize">{results.algorithm}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Execution Time:</span>
                      <span className="text-green-400">{results.execTime.toFixed(1)}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Fidelity:</span>
                      <span className="text-green-400">{(results.fidelity * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Shots:</span>
                      <span className="text-green-400">{results.shots}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-xl font-semibold mb-4 text-purple-400">Measurement Counts</h3>
                  
                  <div className="space-y-2">
                    {Object.entries(results.counts).map(([state, count]) => (
                      <div key={state} className="flex items-center justify-between">
                        <span className="text-gray-300 font-mono">|{state}⟩</span>
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded"
                            style={{ width: `${(count as number / 300) * 100}px` }}
                          ></div>
                          <span className="text-purple-400 text-sm">{count as number}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {!results && (
              <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-semibold mb-4 text-gray-400">Sonuçlar</h3>
                <div className="text-center text-gray-500">
                  <div className="text-3xl mb-2">📊</div>
                  <p>Bir algoritma çalıştırın ve sonuçları görün</p>
                </div>
              </div>
            )}

            {/* Quantum Gate Library */}
            <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold mb-4 text-yellow-400">Gate Library</h3>
              
              <div className="grid grid-cols-3 gap-2">
                {["X", "Y", "Z", "H", "S", "T", "RX", "RY", "RZ"].map((gate) => (
                  <button
                    key={gate}
                    className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded border border-yellow-500/20 hover:border-yellow-500/40 transition-all text-sm"
                  >
                    {gate}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
