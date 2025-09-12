"use client";

import { motion } from 'framer-motion';
import { 
  Crown,
  Check,
  Star,
  Zap,
  Sparkles,
  Globe,
  Brain,
  Eye,
  MessageCircle,
  Database,
  Cpu,
  Atom,
  Headset
} from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: "Ücretsiz",
    price: "₺0",
    period: "/ay",
    description: "Temel özelliklere erişim",
    features: [
      "Günlük 10 AI analizi",
      "Temel haber özetleri",
      "Sınırlı modül erişimi",
      "Topluluk desteği",
      "Temel bildirimler"
    ],
    color: "gray",
    buttonText: "Mevcut Plan",
    current: true
  },
  {
    name: "Premium",
    price: "₺49",
    period: "/ay",
    description: "Gelişmiş AI özellikleri",
    features: [
      "Sınırsız AI analizi",
      "Gerçek zamanlı veri akışı",
      "Tüm modüllere tam erişim",
      "Öncelikli destek",
      "Gelişmiş bildirimler",
      "API erişimi (1000 call/gün)",
      "Özel raporlama",
      "Veri dışa aktarma"
    ],
    color: "yellow",
    buttonText: "Premium'a Geç",
    popular: true
  },
  {
    name: "Enterprise",
    price: "₺199",
    period: "/ay",
    description: "Kurumsal çözümler",
    features: [
      "Premium'daki tüm özellikler",
      "Sınırsız API erişimi",
      "Özel AI modelleri",
      "Beyaz etiket çözümler",
      "7/24 premium destek",
      "Özel entegrasyonlar",
      "Gelişmiş güvenlik",
      "SLA garantisi",
      "Özel eğitim"
    ],
    color: "purple",
    buttonText: "İletişime Geç"
  }
];

const modules = [
  { icon: Eye, name: "EarthBrief", description: "Global haber özetleri" },
  { icon: MessageCircle, name: "Global Discourse", description: "Canlı küresel tartışmalar" },
  { icon: Globe, name: "Digital Twin", description: "Dünya dijital ikizi" },
  { icon: Atom, name: "Quantum Lab", description: "Kuantum simülasyonları" },
  { icon: Headset, name: "Metaverse", description: "VR/AR deneyimleri" },
  { icon: Brain, name: "Research", description: "AI araştırma asistanı" },
  { icon: Database, name: "Knowledge", description: "Bilgi yönetim sistemi" },
  { icon: Cpu, name: "AI Agents", description: "Otonom AI ajanları" }
];

export default function PremiumPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              <Crown className="w-12 h-12 text-yellow-400 mr-4" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                NewsAI Premium
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              AI destekli global istihbarat platformunun tüm gücüne erişin. 
              Gerçek zamanlı analizler, sınırsız modül erişimi ve öncelikli destek.
            </p>
          </motion.div>

          {/* Premium Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          >
            {modules.map((module, index) => (
              <motion.div
                key={module.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4 hover:border-yellow-400/50 transition-all duration-300"
              >
                <module.icon className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold text-sm">{module.name}</h3>
                <p className="text-gray-400 text-xs mt-1">{module.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Planınızı Seçin</h2>
            <p className="text-gray-400 text-lg">İhtiyacınıza en uygun planla başlayın</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`relative bg-gray-900/50 backdrop-blur-sm border rounded-2xl p-8 hover:scale-105 transition-all duration-300 ${
                  plan.popular 
                    ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' 
                    : 'border-gray-800 hover:border-gray-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      En Popüler
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 ml-1">{plan.period}</span>
                  </div>
                  <p className="text-gray-400">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    plan.current
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : plan.popular
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-black hover:from-yellow-300 hover:to-orange-300'
                      : 'bg-purple-600 text-white hover:bg-purple-500'
                  }`}
                  disabled={plan.current}
                >
                  {plan.buttonText}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-16 px-4 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Premium Avantajları</h2>
            <p className="text-gray-400 text-lg">Premium üyelikle neler kazanırsınız?</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Zap,
                title: "Sınırsız Erişim",
                description: "Tüm AI modüllerine sınırsız erişim"
              },
              {
                icon: Sparkles,
                title: "Gerçek Zamanlı",
                description: "Anlık veri güncellemeleri"
              },
              {
                icon: Crown,
                title: "Öncelikli Destek",
                description: "7/24 premium destek hizmeti"
              },
              {
                icon: Database,
                title: "API Erişimi",
                description: "Güçlü API ile entegrasyon"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-yellow-400/50 transition-all duration-300"
              >
                <feature.icon className="w-12 h-12 text-yellow-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-yellow-400/10 via-orange-400/10 to-red-400/10 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-8"
          >
            <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Geleceğin AI Platformuna Katılın
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              NewsAI Premium ile global istihbarat ve analiz alanında bir adım öne çıkın. 
              Bugün başlayın, geleceği keşfedin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-semibold py-3 px-8 rounded-xl hover:from-yellow-300 hover:to-orange-300 transition-all duration-300"
              >
                Premium'a Başla
              </motion.button>
              <Link
                href="/tr/contact"
                className="border border-gray-600 text-white font-semibold py-3 px-8 rounded-xl hover:border-gray-500 hover:bg-gray-800 transition-all duration-300"
              >
                Demo Talep Et
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
