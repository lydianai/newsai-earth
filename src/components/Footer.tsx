"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Globe, 
  Mail, 
  Twitter, 
  Github, 
  Linkedin,
  Heart,
  Atom,
  Brain,
  Eye,
  Headset,
  Zap,
  Database,
  Cpu,
  Wifi,
  ExternalLink,
  Crown,
  Shield,
  MessageCircle
} from 'lucide-react';

const FooterLogo = () => (
  <motion.div
    className="flex items-center space-x-2"
    whileHover={{ scale: 1.05 }}
  >
    <motion.div
      className="relative"
      animate={{
        rotate: [0, 360],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"
          animate={{
            rotate: [0, -360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
          }}
        />
        <div className="absolute inset-1 bg-black rounded-full flex items-center justify-center">
          <Atom className="w-4 h-4 text-white" />
        </div>
      </div>
    </motion.div>
    <div className="flex flex-col">
      <span className="text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
        NewsAI Earth
      </span>
      <span className="text-xs text-gray-400 -mt-1">AI-Powered Global Intelligence</span>
    </div>
  </motion.div>
);

const moduleLinks = [
  { icon: Eye, title: "EarthBrief", href: "/ai-lens/earthbrief", color: "text-green-400" },
  { icon: MessageCircle, title: "Global Discourse", href: "/ai-lens/global-discourse", color: "text-indigo-400" },
  { icon: Globe, title: "Digital Twin", href: "/ai-lens/digital-twin", color: "text-blue-400" },
  { icon: Atom, title: "Quantum Lab", href: "/ai-lens/quantum", color: "text-purple-400" },
  { icon: Headset, title: "Metaverse", href: "/ai-lens/metaverse", color: "text-pink-400" },
  { icon: Brain, title: "Research", href: "/ai-lens/research", color: "text-orange-400" },
  { icon: Database, title: "Knowledge", href: "/ai-lens/knowledge", color: "text-cyan-400" },
  { icon: Cpu, title: "AI Agents", href: "/ai-lens/agents", color: "text-yellow-400" },
];

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com/newsaiearth", label: "Twitter" },
  { icon: Github, href: "https://github.com/lydianai/newsai-earth", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/company/newsaiearth", label: "LinkedIn" },
  { icon: Mail, href: "mailto:contact@newsai.earth", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Logo ve Açıklama */}
            <div className="space-y-4">
              <FooterLogo />
              <p className="text-gray-400 text-sm leading-relaxed">
                newsai.earth - Yapay zeka teknolojilerini birleştiren küresel haber ve analiz platformu. 
                Gerçek zamanlı veriler ile dünyayı keşfedin.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Premium & Admin */}
            <div>
              <h3 className="text-white font-semibold mb-4">Premium & Yönetim</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/tr/premium"
                    className="flex items-center text-gray-400 hover:text-yellow-400 transition-colors group"
                  >
                    <Crown className="w-4 h-4 mr-2 text-yellow-400 group-hover:scale-110 transition-transform" />
                    <span className="text-sm">Premium Üyelik</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tr/admin"
                    className="flex items-center text-gray-400 hover:text-red-400 transition-colors group"
                  >
                    <Shield className="w-4 h-4 mr-2 text-red-400 group-hover:scale-110 transition-transform" />
                    <span className="text-sm">Admin Panel</span>
                  </Link>
                </li>
                <li>
                  <Link href="/tr/pricing" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Fiyatlandırma
                  </Link>
                </li>
                <li>
                  <Link href="/tr/enterprise" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Kurumsal Çözümler
                  </Link>
                </li>
                <li>
                  <Link href="/tr/api-docs" className="text-gray-400 hover:text-white transition-colors text-sm">
                    API Erişimi
                  </Link>
                </li>
              </ul>
            </div>

            {/* AI-Lens Modülleri */}
            <div>
              <h3 className="text-white font-semibold mb-4">AI-Lens Modülleri</h3>
              <ul className="space-y-2">
                {moduleLinks.slice(0, 4).map((module) => (
                  <li key={module.href}>
                    <Link
                      href={`/tr${module.href}`}
                      className="flex items-center text-gray-400 hover:text-white transition-colors group"
                    >
                      <module.icon className={`w-4 h-4 mr-2 ${module.color} group-hover:scale-110 transition-transform`} />
                      <span className="text-sm">{module.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Diğer Modüller */}
            <div>
              <h3 className="text-white font-semibold mb-4">Gelişmiş Özellikler</h3>
              <ul className="space-y-2">
                {moduleLinks.slice(4).map((module) => (
                  <li key={module.href}>
                    <Link
                      href={`/tr${module.href}`}
                      className="flex items-center text-gray-400 hover:text-white transition-colors group"
                    >
                      <module.icon className={`w-4 h-4 mr-2 ${module.color} group-hover:scale-110 transition-transform`} />
                      <span className="text-sm">{module.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Şirket ve Legal - En sağa taşındı */}
            <div>
              <h3 className="text-white font-semibold mb-4">Şirket</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/tr/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Hakkımızda
                  </Link>
                </li>
                <li>
                  <Link href="/tr/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                    İletişim
                  </Link>
                </li>
                <li>
                  <Link href="/tr/careers" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Kariyer
                  </Link>
                </li>
                <li>
                  <Link href="/tr/blog" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/tr/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Gizlilik Politikası
                  </Link>
                </li>
                <li>
                  <Link href="/tr/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Kullanım Şartları
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Alt Kısım */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>&copy; 2025 newsai.earth - Gerçek Zamanlı Global İstihbarat Platformu.</span>
              <span className="flex items-center">
                Türkiye&apos;den <Heart className="w-4 h-4 text-red-500 mx-1" /> ile yapıldı.
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.div
                className="flex items-center space-x-2 text-xs text-gray-500"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Sistem Aktif</span>
              </motion.div>
              
              <a
                href="https://www.ailydian.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-xs text-gray-500 hover:text-gray-400 transition-colors"
              >
                <span>by AiLydian</span>
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Arkaplan Animasyonu */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-green-600/5 to-cyan-600/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
        />
      </div>
    </footer>
  );
}
