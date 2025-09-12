"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, 
  Building, 
  FileText, 
  Languages,
  Filter,
  Search,
  Calendar,
  ExternalLink,
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Sparkles,
  RefreshCw,
  Download
} from "lucide-react";
import { countries, ministries, decisionTypes, languages, Decision } from "../api/decisions/schema";
import { SectionHero, LensCard, LensButton, StatPill } from "@/components/lens";

// Tip renklerini AI LENS temasına uyarla
const getTypeColor = (type: string) => {
  const colors = {
    "Yasak": "from-red-500 to-red-600",
    "Teşvik": "from-accent-2 to-brand-1", 
    "Düzenleme": "from-brand-2 to-accent-1",
    "Duyuru": "from-accent-1 to-brand-1",
    "Karar": "from-brand-1 to-brand-2",
    "Onay": "from-accent-2 to-brand-2",
    "Genel": "from-gray-500 to-gray-600"
  };
  return colors[type as keyof typeof colors] || colors["Genel"];
};

// Tip ikonlarını tanımla
const getTypeIcon = (type: string) => {
  const icons = {
    "Yasak": AlertCircle,
    "Teşvik": TrendingUp,
    "Düzenleme": FileText,
    "Duyuru": Zap,
    "Karar": CheckCircle,
    "Onay": Sparkles,
    "Genel": Clock
  };
  return icons[type as keyof typeof icons] || Clock;
};

export default function DecisionsPage() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [country, setCountry] = useState("");
  const [ministry, setMinistry] = useState("");
  const [type, setType] = useState("");
  const [lang, setLang] = useState("tr");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchDecisions = async (forceRefresh = false) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (country) params.append("country", country);
      if (ministry) params.append("ministry", ministry);
      if (type) params.append("type", type);
      if (lang) params.append("lang", lang);
      if (forceRefresh) params.append("refresh", "true");

      const res = await fetch(`/api/decisions?${params.toString()}`, {
        cache: forceRefresh ? 'no-cache' : 'default'
      });
      if (!res.ok) throw new Error("Veri alınamadı");
      const data = await res.json();
      setDecisions(data.decisions || []);
      setLastUpdated(new Date());
    } catch {
      setError("Veri alınamadı - API bağlantısı kontrol ediliyor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecisions();
  }, [country, ministry, type, lang]);

  // Arama filtresi - geliştirilmiş
  const filteredDecisions = decisions.filter(d => {
    const searchLower = searchTerm.toLowerCase();
    return (
      d.subject.toLowerCase().includes(searchLower) ||
      d.description.toLowerCase().includes(searchLower) ||
      d.country.toLowerCase().includes(searchLower) ||
      d.ministry.toLowerCase().includes(searchLower) ||
      d.field.toLowerCase().includes(searchLower) ||
      d.type.toLowerCase().includes(searchLower)
    );
  });

  // İstatistikler
  const stats = {
    total: filteredDecisions.length,
    countries: new Set(filteredDecisions.map(d => d.country)).size,
    ministries: new Set(filteredDecisions.map(d => d.ministry)).size,
    types: new Set(filteredDecisions.map(d => d.type)).size
  };

  const exportData = () => {
    const dataStr = JSON.stringify(filteredDecisions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `ai-lens-decisions-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <SectionHero 
        title="AI NEWS - HUB Decisions"
        subtitle="Global Government Decisions Intelligence • Real-time Policy Tracking"
        showParticles={true}
        className="pb-16"
      >
        <div className="text-center space-y-6">
          {/* Live Stats */}
          <div className="flex flex-wrap justify-center gap-3">
            <StatPill variant="live">🔴 LIVE - {stats.total} Active Decisions</StatPill>
            <StatPill variant="success">✅ {stats.countries} Countries</StatPill>
            <StatPill variant="default">🏛️ {stats.ministries} Ministries</StatPill>
            <StatPill variant="default">📋 {stats.types} Decision Types</StatPill>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4">
            <LensButton 
              variant="primary" 
              leftIcon={<RefreshCw />}
              onClick={() => fetchDecisions(true)}
              disabled={loading}
            >
              Refresh Data
            </LensButton>
            <LensButton 
              variant="ghost" 
              leftIcon={<Download />}
              onClick={exportData}
              disabled={filteredDecisions.length === 0}
            >
              Export JSON
            </LensButton>
          </div>

          {lastUpdated && (
            <div className="text-sm text-muted">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>
      </SectionHero>

      <div className="container mx-auto px-6 pb-24">
        {/* Enhanced Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          {/* Advanced Search Bar */}
          <LensCard className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-2 w-5 h-5" />
              <input
                type="text"
                placeholder="Search decisions, countries, ministries, types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-transparent text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand-2/30 transition-all duration-300 text-lg"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted hover:text-text transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </LensCard>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <LensCard hoverable>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-1 w-4 h-4" />
                <select
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-transparent text-text appearance-none focus:outline-none focus:ring-2 focus:ring-brand-1/30 transition-all duration-300"
                >
                  <option value="" className="bg-panel text-text">🌍 All Countries</option>
                  {countries.map(c => <option key={c} value={c} className="bg-panel text-text">{c}</option>)}
                </select>
              </div>
            </LensCard>

            <LensCard hoverable>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-2 w-4 h-4" />
                <select
                  value={ministry}
                  onChange={e => setMinistry(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-transparent text-text appearance-none focus:outline-none focus:ring-2 focus:ring-brand-2/30 transition-all duration-300"
                >
                  <option value="" className="bg-panel text-text">🏛️ All Ministries</option>
                  {ministries.map(m => <option key={m} value={m} className="bg-panel text-text">{m} Bakanlığı</option>)}
                </select>
              </div>
            </LensCard>

            <LensCard hoverable>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-1 w-4 h-4" />
                <select
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-transparent text-text appearance-none focus:outline-none focus:ring-2 focus:ring-accent-1/30 transition-all duration-300"
                >
                  <option value="" className="bg-panel text-text">📋 All Types</option>
                  {decisionTypes.map(t => <option key={t} value={t} className="bg-panel text-text">{t}</option>)}
                </select>
              </div>
            </LensCard>

            <LensCard hoverable>
              <div className="relative">
                <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-2 w-4 h-4" />
                <select
                  value={lang}
                  onChange={e => setLang(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-transparent text-text appearance-none focus:outline-none focus:ring-2 focus:ring-accent-2/30 transition-all duration-300"
                >
                  {languages.map(l => <option key={l} value={l} className="bg-panel text-text">🗣️ {l.toUpperCase()}</option>)}
                </select>
              </div>
            </LensCard>
          </div>
        </motion.div>

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <LensCard className="inline-block">
                <div className="flex items-center gap-4 px-8 py-6">
                  <motion.div
                    className="w-6 h-6 border-2 border-brand-2 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="text-text">Loading global decisions...</span>
                </div>
              </LensCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center py-12"
            >
              <LensCard className="inline-block border-red-500/20">
                <div className="px-8 py-6">
                  <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <p className="text-red-400 text-lg mb-4">{error}</p>
                  <LensButton onClick={() => fetchDecisions(true)} variant="primary">
                    Retry
                  </LensButton>
                </div>
              </LensCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decisions Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredDecisions.map((decision, idx) => {
              const TypeIcon = getTypeIcon(decision.type);
              return (
                <motion.div
                  key={`${decision.country}-${decision.subject}-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="group"
                >
                  <LensCard hoverable className="h-full">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${getTypeColor(decision.type)} shadow-glow`}>
                          <TypeIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-right">
                          <StatPill variant="default" size="sm">
                            {decision.language.toUpperCase()}
                          </StatPill>
                          <div className="text-xs text-muted mt-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {decision.date}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div>
                        <h3 className="text-lg font-heading font-bold text-text mb-3 line-clamp-2 group-hover:text-brand-2 transition-colors">
                          {decision.subject}
                        </h3>
                        
                        <p className="text-muted text-sm mb-4 line-clamp-4 leading-relaxed">
                          {decision.description}
                        </p>
                      </div>

                      {/* Meta Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Globe className="w-4 h-4 text-brand-1" />
                          <span className="text-text font-medium">{decision.country}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Building className="w-4 h-4 text-brand-2" />
                          <span className="text-muted">{decision.ministry}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <StatPill 
                            variant={decision.type === 'Yasak' ? 'warning' : 'success'} 
                            size="sm"
                          >
                            {decision.type}
                          </StatPill>
                          <span className="text-muted">{decision.field}</span>
                        </div>
                      </div>

                      {/* Source Link */}
                      <div className="pt-2 border-t border-gray-600/20">
                        <motion.a
                          href={decision.source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between text-sm text-brand-2 hover:text-accent-1 transition-colors group/link"
                          whileHover={{ x: 2 }}
                        >
                          <span className="font-medium">View Source</span>
                          <ExternalLink className="w-4 h-4 group-hover/link:scale-110 transition-transform" />
                        </motion.a>
                      </div>
                    </div>
                  </LensCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {!loading && !error && filteredDecisions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <LensCard className="inline-block">
              <div className="px-12 py-8">
                <FileText className="w-16 h-16 text-muted mx-auto mb-6" />
                <h3 className="text-xl font-heading font-bold text-text mb-2">No decisions found</h3>
                <p className="text-muted mb-6">Try adjusting your filters or search terms</p>
                <LensButton onClick={() => {
                  setCountry("");
                  setMinistry("");
                  setType("");
                  setSearchTerm("");
                }}>
                  Clear All Filters
                </LensButton>
              </div>
            </LensCard>
          </motion.div>
        )}

        {/* Enhanced Footer Stats */}
        {filteredDecisions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <LensCard className="inline-block">
              <div className="px-8 py-6">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-brand-1" />
                    <span className="text-text">
                      <span className="font-bold text-brand-1">{stats.total}</span> decisions
                    </span>
                  </div>
                  <div className="w-px h-6 bg-gray-600/20"></div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-brand-2" />
                    <span className="text-text">
                      <span className="font-bold text-brand-2">{stats.countries}</span> countries
                    </span>
                  </div>
                  <div className="w-px h-6 bg-gray-600/20"></div>
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-accent-1" />
                    <span className="text-text">
                      <span className="font-bold text-accent-1">{stats.ministries}</span> ministries
                    </span>
                  </div>
                </div>
              </div>
            </LensCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}
