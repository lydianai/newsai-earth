"use client";

import { useState } from "react";

export default function AIAgents() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const agents = [
    { id: "researcher", name: "Research Agent", icon: "🔬", description: "Bilimsel araştırma ve analiz", status: "active" },
    { id: "reporter", name: "News Agent", icon: "📰", description: "Haber toplama ve analiz", status: "active" },
    { id: "analyst", name: "Data Agent", icon: "📊", description: "Veri analizi ve raporlama", status: "active" },
    { id: "translator", name: "Language Agent", icon: "🌐", description: "Çok dilli çeviri", status: "idle" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            AI Agents
          </h1>
          <p className="text-gray-300 text-lg">Otonom Yapay Zeka Ajanları Marketplace</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {agents.map((agent) => (
            <div key={agent.id} className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="text-4xl mb-4">{agent.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{agent.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{agent.description}</p>
              <div className={`inline-flex px-3 py-1 rounded-full text-xs ${
                agent.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
              }`}>
                {agent.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
