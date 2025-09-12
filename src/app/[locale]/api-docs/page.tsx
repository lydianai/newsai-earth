"use client";

import { motion } from 'framer-motion';
import { 
  Code2,
  Database,
  Zap,
  Lock,
  Globe,
  BookOpen,
  Terminal,
  Key,
  CheckCircle,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useState } from 'react';

const apiEndpoints = [
  {
    method: "GET",
    path: "/api/ai-lens/earthbrief",
    description: "Global haber özetlerini getirir",
    params: ["lang", "limit", "category"],
    response: "EarthBrief verileri"
  },
  {
    method: "GET", 
    path: "/api/ai-lens/global-discourse",
    description: "Canlı tartışma verilerini getirir",
    params: ["include_messages", "topic_id"],
    response: "Discourse verileri"
  },
  {
    method: "GET",
    path: "/api/decisions",
    description: "Hükümet kararlarını getirir", 
    params: ["lang", "date", "ministry"],
    response: "Karar verileri"
  },
  {
    method: "POST",
    path: "/api/search",
    description: "AI destekli global arama",
    params: ["query", "sources", "lang"],
    response: "Arama sonuçları"
  }
];

const codeExamples = {
  javascript: `// NewsAI Earth API Kullanımı
const apiKey = 'YOUR_API_KEY';

async function getEarthBrief() {
  const response = await fetch('https://newsai.earth/api/ai-lens/earthbrief?lang=tr', {
    headers: {
      'Authorization': \`Bearer \${apiKey}\`,
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  console.log(data);
}`,

  python: `# NewsAI Earth API Kullanımı
import requests

api_key = 'YOUR_API_KEY'
headers = {
    'Authorization': f'Bearer {api_key}',
    'Content-Type': 'application/json'
}

def get_earth_brief():
    response = requests.get(
        'https://newsai.earth/api/ai-lens/earthbrief?lang=tr',
        headers=headers
    )
    return response.json()

data = get_earth_brief()
print(data)`,

  curl: `# NewsAI Earth API Kullanımı
curl -X GET "https://newsai.earth/api/ai-lens/earthbrief?lang=tr" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`
};

export default function ApiDocsPage() {
  const [activeExample, setActiveExample] = useState('javascript');
  const [copiedCode, setCopiedCode] = useState(false);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <Code2 className="w-12 h-12 text-blue-400 mr-4" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                NewsAI API
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Güçlü AI destekli global istihbarat verilerine programatik erişim. 
              RESTful API ile uygulamalarınızı geliştirin.
            </p>
          </motion.div>

          {/* Quick Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Zap, title: "Hızlı", desc: "< 100ms" },
              { icon: Lock, title: "Güvenli", desc: "OAuth 2.0" },
              { icon: Globe, title: "Global", desc: "CDN" },
              { icon: Database, title: "Reliable", desc: "99.9%" }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4 text-center hover:border-blue-400/50 transition-all duration-300"
              >
                <feature.icon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="py-16 px-4 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Hızlı Başlangıç</h2>
            <p className="text-gray-400 text-lg">3 adımda API'yi kullanmaya başlayın</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "API Anahtarı Alın",
                description: "Premium hesabınızdan API anahtarınızı oluşturun",
                icon: Key
              },
              {
                step: "2", 
                title: "İlk Çağrınızı Yapın",
                description: "RESTful endpoint'leri kullanarak veri çekin",
                icon: Terminal
              },
              {
                step: "3",
                title: "Entegre Edin",
                description: "Uygulamanıza AI destekli özellikleri ekleyin", 
                icon: CheckCircle
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-blue-400/50 transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {step.step}
                    </div>
                    <step.icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
                
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-700"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Kod Örnekleri</h2>
            <p className="text-gray-400 text-lg">Farklı programlama dillerinde örnek kullanımlar</p>
          </motion.div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
            {/* Language Tabs */}
            <div className="flex border-b border-gray-800">
              {Object.keys(codeExamples).map((lang) => (
                <motion.button
                  key={lang}
                  whileHover={{ backgroundColor: "rgba(55, 65, 81, 0.5)" }}
                  onClick={() => setActiveExample(lang)}
                  className={`px-6 py-3 text-sm font-medium transition-colors ${
                    activeExample === lang
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {lang === 'javascript' ? 'JavaScript' : lang === 'python' ? 'Python' : 'cURL'}
                </motion.button>
              ))}
            </div>

            {/* Code Block */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => copyCode(codeExamples[activeExample as keyof typeof codeExamples])}
                className="absolute top-4 right-4 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white p-2 rounded-lg transition-colors"
              >
                {copiedCode ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </motion.button>
              
              <pre className="bg-black p-6 text-green-400 text-sm overflow-x-auto">
                <code>{codeExamples[activeExample as keyof typeof codeExamples]}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* API Endpoints */}
      <section className="py-16 px-4 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">API Endpoint'leri</h2>
            <p className="text-gray-400 text-lg">Mevcut tüm API servislerimiz</p>
          </motion.div>

          <div className="space-y-6">
            {apiEndpoints.map((endpoint, index) => (
              <motion.div
                key={endpoint.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold mr-4 ${
                      endpoint.method === 'GET' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'
                    }`}>
                      {endpoint.method}
                    </span>
                    <code className="text-blue-400 font-mono text-lg">{endpoint.path}</code>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400" />
                </div>
                
                <p className="text-gray-300 mb-4">{endpoint.description}</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Parametreler:</h4>
                    <div className="flex flex-wrap gap-2">
                      {endpoint.params.map((param) => (
                        <span 
                          key={param}
                          className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs font-mono"
                        >
                          {param}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-semibold mb-2">Yanıt:</h4>
                    <span className="text-gray-400 text-sm">{endpoint.response}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rate Limits */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-yellow-900/20 border border-yellow-600/50 rounded-xl p-8"
          >
            <div className="flex items-center mb-4">
              <Zap className="w-8 h-8 text-yellow-400 mr-3" />
              <h3 className="text-2xl font-bold text-white">Rate Limits</h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Ücretsiz Plan</h4>
                <p className="text-2xl font-bold text-yellow-400 mb-1">100</p>
                <p className="text-gray-400 text-sm">istek/gün</p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Premium Plan</h4>
                <p className="text-2xl font-bold text-yellow-400 mb-1">1,000</p>
                <p className="text-gray-400 text-sm">istek/gün</p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Enterprise Plan</h4>
                <p className="text-2xl font-bold text-yellow-400 mb-1">Sınırsız</p>
                <p className="text-gray-400 text-sm">özel limit</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 backdrop-blur-sm border border-blue-400/30 rounded-2xl p-8"
          >
            <BookOpen className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">
              API'yi Kullanmaya Başlayın
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Premium hesabınızdan API anahtarınızı alın ve güçlü AI destekli verilerimizi uygulamanızda kullanın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-400 to-purple-400 text-white font-semibold py-3 px-8 rounded-xl hover:from-blue-300 hover:to-purple-300 transition-all duration-300"
              >
                API Anahtarı Al
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-gray-600 text-white font-semibold py-3 px-8 rounded-xl hover:border-gray-500 hover:bg-gray-800 transition-all duration-300"
              >
                Dokümantasyon
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
