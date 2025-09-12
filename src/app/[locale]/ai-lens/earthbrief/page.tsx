"use client";

import { useState, useEffect } from "react";

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  sourceRosette: string;
  publishedAt: string;
  category: string;
  language: string;
  originalUrl: string;
  factScore?: number;
  consensusScore?: number;
  country?: string;
}

export default function EarthBrief() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("tr");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchNews();
  }, [selectedLanguage, selectedCategory]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      // Mock data for now
      const mockArticles: NewsArticle[] = [
        {
          id: "1",
          title: "Küresel İklim Zirvesi 2025 Başladı",
          summary: "Dünya liderleri İstanbul&apos;da bir araya gelerek iklim değişikliği konusunda yeni anlaşmalar imzaladı. Karbon emisyonlarının 2030&apos;a kadar %50 azaltılması hedefleniyor.",
          sourceRosette: "Reuters",
          publishedAt: "2025-01-12T10:00:00Z",
          category: "environment",
          language: "tr",
          originalUrl: "https://example.com/news/1",
          factScore: 0.92,
          consensusScore: 0.87,
          country: "Turkey"
        },
        {
          id: "2",
          title: "AI Teknolojisinde Yeni Atılım",
          summary: "Quantum-AI hibrit sistemler artık gerçek zamanlı veri işleyebiliyor. Bu teknoloji finans ve sağlık sektörlerinde devrim yaratacak.",
          sourceRosette: "BBC",
          publishedAt: "2025-01-12T08:30:00Z",
          category: "technology",
          language: "tr",
          originalUrl: "https://example.com/news/2",
          factScore: 0.95,
          consensusScore: 0.91,
          country: "United States"
        },
        {
          id: "3",
          title: "Türkiye&apos;de Yenilenebilir Enerji Atılımı",
          summary: "2024 yılında rüzgar ve güneş enerjisinden elde edilen elektrik üretimi %35 arttı. Enerji bağımsızlığı hedefine bir adım daha yaklaşıldı.",
          sourceRosette: "Guardian",
          publishedAt: "2025-01-12T07:00:00Z",
          category: "energy",
          language: "tr",
          originalUrl: "https://example.com/news/3",
          factScore: 0.89,
          consensusScore: 0.84,
          country: "Turkey"
        }
      ];
      
      setArticles(mockArticles);
    } catch (error) {
      console.error("Failed to fetch news:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: "all", label: "Tüm Kategoriler" },
    { value: "politics", label: "Politik" },
    { value: "technology", label: "Teknoloji" },
    { value: "environment", label: "Çevre" },
    { value: "energy", label: "Enerji" },
    { value: "economics", label: "Ekonomi" },
    { value: "health", label: "Sağlık" }
  ];

  const languages = [
    { value: "tr", label: "Türkçe" },
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "fr", label: "Français" },
    { value: "ar", label: "العربية" },
    { value: "ja", label: "日本語" }
  ];

  const getScoreColor = (score?: number) => {
    if (!score) return "text-gray-400";
    if (score >= 0.9) return "text-green-400";
    if (score >= 0.7) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-orange-950/30 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
            EarthBrief
          </h1>
          <p className="text-gray-300 text-lg">Global Haber Motoru - Dünya&apos;dan Canlı Haberler</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium mb-2">Dil</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-orange-500"
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Kategori</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-orange-500"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1"></div>

          <button
            onClick={fetchNews}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all"
          >
            Yenile
          </button>
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-xl text-gray-400">Haberler yükleniyor...</div>
          </div>
        ) : (
          <div className="grid gap-6">
            {articles.map((article) => (
              <div
                key={article.id}
                className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-orange-500/50 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 text-orange-400">
                      {article.title}
                    </h3>
                    <p className="text-gray-300 mb-4">
                      {article.summary}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between text-sm">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full">
                      {article.sourceRosette}
                    </span>
                    <span className="text-gray-400">
                      {new Date(article.publishedAt).toLocaleDateString("tr-TR")}
                    </span>
                    {article.country && (
                      <span className="text-gray-400">
                        📍 {article.country}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {article.factScore && (
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400">Doğruluk:</span>
                        <span className={getScoreColor(article.factScore)}>
                          {Math.round(article.factScore * 100)}%
                        </span>
                      </div>
                    )}
                    {article.consensusScore && (
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400">Konsensüs:</span>
                        <span className={getScoreColor(article.consensusScore)}>
                          {Math.round(article.consensusScore * 100)}%
                        </span>
                      </div>
                    )}
                    <a
                      href={article.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-400 hover:text-orange-300 underline"
                    >
                      Kaynağı Gör
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Live Events Map Placeholder */}
        <div className="mt-12 p-6 bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl border border-slate-700">
          <h2 className="text-2xl font-semibold mb-4 text-orange-400">Canlı Etkinlik Haritası</h2>
          <div className="h-64 bg-slate-800/50 rounded-lg flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <p>Canlı etkinlik haritası yükleniyor...</p>
              <p className="text-sm mt-2">Depremler, politik olaylar, ekonomik veriler</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
