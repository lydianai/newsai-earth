"use client";

import { motion } from 'framer-motion';
import { Check, Crown, Zap, Shield, Star } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: "Başlangıç",
    price: "₺0",
    period: "/ay",
    description: "Bireysel kullanım için ideal",
    features: [
      "Günlük 10 AI analizi",
      "Temel haber özetleri", 
      "3 modüle erişim",
      "Topluluk desteği",
      "Temel bildirimler"
    ],
    limitations: [
      "Sınırlı API erişimi",
      "Su markası mevcut"
    ],
    buttonText: "Ücretsiz Başla",
    popular: false,
    color: "gray"
  },
  {
    name: "Premium",
    price: "₺49",
    period: "/ay", 
    description: "Profesyoneller için gelişmiş özellikler",
    features: [
      "Sınırsız AI analizi",
      "Tüm modüllere tam erişim", 
      "Gerçek zamanlı veri akışı",
      "Öncelikli destek",
      "Gelişmiş bildirimler",
      "API erişimi (1000 çağrı/gün)",
      "Özel raporlama",
      "Veri dışa aktarma",
      "Su markası yok"
    ],
    buttonText: "Premium'a Geç",
    popular: true,
    color: "yellow"
  },
  {
    name: "Enterprise", 
    price: "₺199",
    period: "/ay",
    description: "Kurumsal çözümler ve özelleştirme",
    features: [
      "Premium'daki tüm özellikler",
      "Sınırsız API erişimi",
      "Özel AI modelleri", 
      "Beyaz etiket çözümler",
      "7/24 premium destek",
      "Özel entegrasyonlar",
      "Gelişmiş güvenlik",
      "SLA garantisi",
      "Özel eğitim",
      "Yerinde kurulum desteği"
    ],
    buttonText: "Satış Ekibi ile Görüş",
    popular: false,
    color: "purple"
  }
];

const faqs = [
  {
    question: "Premium aboneliğimi istediğim zaman iptal edebilir miyim?",
    answer: "Evet, aboneliğinizi istediğiniz zaman iptal edebilirsiniz. İptal işlemi sonrası mevcut dönemin sonuna kadar hizmetiniz devam eder."
  },
  {
    question: "API erişimi nasıl çalışır?",
    answer: "Premium plan ile günde 1000 API çağrısı hakkınız bulunur. Enterprise plan ile sınırsız erişim sağlanır. Tüm API dokumentasyonu üyelik sonrası erişilebilir."
  },
  {
    question: "Kurumsal destek ne içerir?",
    answer: "Enterprise planında 7/24 öncelikli destek, özel hesap yöneticisi, SLA garantisi ve telefon desteği dahildir."
  },
  {
    question: "Veri güvenliği nasıl sağlanıyor?", 
    answer: "Tüm veriler 256-bit SSL şifreleme ile korunur. SOC 2 Type II uyumluluk ve KVKK/GDPR standartlarına uygun işlem yapılır."
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
              İhtiyacınıza Uygun Plan Seçin
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              AI destekli global istihbarat platformunun tüm gücünden yararlanın. 
              14 günlük ücretsiz deneme ile başlayın.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`relative bg-gray-900/50 backdrop-blur-sm border rounded-2xl p-8 hover:scale-105 transition-all duration-300 ${
                  plan.popular 
                    ? 'border-yellow-400 shadow-xl shadow-yellow-400/20 scale-105' 
                    : 'border-gray-800 hover:border-gray-700'
                }`}
              >
                {plan.popular && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                  >
                    <div className="bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      En Popüler Plan
                    </div>
                  </motion.div>
                )}

                <div className="text-center mb-8">
                  <div className="mb-4">
                    {plan.name === "Premium" && <Crown className="w-12 h-12 text-yellow-400 mx-auto" />}
                    {plan.name === "Enterprise" && <Shield className="w-12 h-12 text-purple-400 mx-auto" />}
                    {plan.name === "Başlangıç" && <Zap className="w-12 h-12 text-blue-400 mx-auto" />}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-4">{plan.description}</p>
                  
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 ml-1">{plan.period}</span>
                  </div>
                  
                  {plan.name !== "Başlangıç" && (
                    <p className="text-sm text-gray-500">14 gün ücretsiz deneme</p>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <motion.li 
                      key={i} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + (i * 0.1) }}
                      className="flex items-start"
                    >
                      <Check className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </motion.li>
                  ))}
                  
                  {plan.limitations && plan.limitations.map((limitation, i) => (
                    <li key={`limit-${i}`} className="flex items-start opacity-60">
                      <div className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 flex items-center justify-center">
                        <div className="w-3 h-0.5 bg-gray-600"></div>
                      </div>
                      <span className="text-gray-500 text-sm">{limitation}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-black hover:from-yellow-300 hover:to-orange-300 shadow-lg'
                      : plan.color === 'purple'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {plan.buttonText}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 px-4 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Plan Karşılaştırması</h2>
            <p className="text-gray-400 text-lg">Hangi plan sizin için uygun?</p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-800 rounded-xl overflow-hidden">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="text-left p-6 text-white font-semibold">Özellik</th>
                  <th className="text-center p-6 text-white font-semibold">Başlangıç</th>
                  <th className="text-center p-6 text-white font-semibold bg-yellow-400/10">
                    Premium
                    <Crown className="w-4 h-4 text-yellow-400 inline ml-1" />
                  </th>
                  <th className="text-center p-6 text-white font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {[
                  { feature: "AI Analiz Limiti", free: "10/gün", premium: "Sınırsız", enterprise: "Sınırsız" },
                  { feature: "Modül Erişimi", free: "3 modül", premium: "Tüm modüller", enterprise: "Tüm modüller + Özel" },
                  { feature: "API Erişimi", free: "Hayır", premium: "1000 çağrı/gün", enterprise: "Sınırsız" },
                  { feature: "Destek", free: "Topluluk", premium: "Email", enterprise: "7/24 Telefon" },
                  { feature: "SLA", free: "-", premium: "-", enterprise: "99.9%" }
                ].map((row, index) => (
                  <motion.tr
                    key={row.feature}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-900/30"
                  >
                    <td className="p-6 text-gray-300 font-medium">{row.feature}</td>
                    <td className="p-6 text-center text-gray-400">{row.free}</td>
                    <td className="p-6 text-center text-yellow-400 bg-yellow-400/5">{row.premium}</td>
                    <td className="p-6 text-center text-purple-400">{row.enterprise}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Sıkça Sorulan Sorular</h2>
            <p className="text-gray-400 text-lg">Merak ettiklerinizin yanıtları</p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors"
              >
                <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
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
            className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 backdrop-blur-sm border border-blue-400/30 rounded-2xl p-8"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Hala Karar Veremediniz mi?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Premium planı 14 gün ücretsiz deneyin. Kredi kartı gerektirmez, istediğiniz zaman iptal edebilirsiniz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-semibold py-3 px-8 rounded-xl hover:from-yellow-300 hover:to-orange-300 transition-all duration-300"
              >
                14 Gün Ücretsiz Deneyin
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
