"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Globe, 
  User, 
  Settings, 
  LogOut,
  ChevronDown,
  Eye,
  Search,
  BarChart3,
  Zap,
  Cpu,
  Atom,
  Headset,
  Brain,
  Database,
  Wifi,
  FileText,
  Cog,
  Users,
  CreditCard,
  TrendingUp,
  Wheat
} from 'lucide-react';

interface User {
  id?: string;
  email?: string;
  name?: string;
}

const AILensLogo = () => (
  <motion.div
    className="flex items-center space-x-3"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <motion.div
      className="relative"
      animate={{
        rotate: [0, 360],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <div className="w-10 h-10 bg-gradient-to-r from-brand-1 via-brand-2 to-accent-1 rounded-xl relative overflow-hidden shadow-glow">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'conic-gradient(from 0deg, var(--brand-1), var(--brand-2), var(--accent-1), var(--brand-1))',
              'conic-gradient(from 120deg, var(--brand-1), var(--brand-2), var(--accent-1), var(--brand-1))',
              'conic-gradient(from 240deg, var(--brand-1), var(--brand-2), var(--accent-1), var(--brand-1))',
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <div className="absolute inset-1 bg-bg/90 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <Globe className="w-5 h-5 text-brand-2" />
          </motion.div>
        </div>
      </div>
    </motion.div>
    <div className="flex flex-col">
      <motion.span
        className="text-2xl font-heading font-bold bg-lens-accent bg-clip-text text-transparent"
        style={{
          background: 'var(--grad-accent)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        AI NEWS - HUB
      </motion.span>
      <span className="text-xs text-muted -mt-1 tracking-wide font-mono">newsai.earth</span>
    </div>
  </motion.div>
);

  const aiLensMenuItems = [
    { icon: BarChart3, title: "Panel", href: "/ai-lens/dashboard", emoji: "📊" },
    { icon: Eye, title: "Dünya Özeti", href: "/ai-lens/earthbrief", emoji: "🌍" },
    { icon: Wheat, title: "AGRI LENS", href: "/ai-lens/agri", emoji: "🌾" },
    { icon: Globe, title: "Dijital İkiz", href: "/ai-lens/digital-twin", emoji: "🌐" },
    { icon: Search, title: "Arama", href: "/ai-lens/search", emoji: "🔍" },
    { icon: TrendingUp, title: "Tahmin", href: "/ai-lens/predict", emoji: "📈" },
    { icon: Brain, title: "Araştırma", href: "/ai-lens/research", emoji: "🧠" },
    { icon: Atom, title: "Kuantum", href: "/ai-lens/quantum", emoji: "⚛️" },
    { icon: Headset, title: "Metaverse", href: "/ai-lens/metaverse", emoji: "🥽" },
    { icon: Cpu, title: "Ajanlar", href: "/ai-lens/agents", emoji: "🤖" },
    { icon: FileText, title: "Medya", href: "/ai-lens/media", emoji: "📱" },
    { icon: FileText, title: "Raporlar", href: "/ai-lens/reports", emoji: "📋" },
    { icon: Cog, title: "Otomasyon", href: "/ai-lens/automation", emoji: "⚙️" },
    { icon: Users, title: "Topluluk", href: "/ai-lens/community", emoji: "👥" },
    { icon: TrendingUp, title: "Analitik", href: "/ai-lens/analytics", emoji: "📊" },
    { icon: Wifi, title: "IoT", href: "/ai-lens/iot", emoji: "📡" },
    { icon: CreditCard, title: "Fatura", href: "/ai-lens/billing", emoji: "💳" },
  ];

  const navigationItems = [
    { title: "Ana Sayfa", href: "/", emoji: "🏠" },
    { title: "Tarım", href: "/agriculture", emoji: "🌾" },
    { title: "Biyoloji", href: "/biology", emoji: "🧬" },
    { title: "Kimya", href: "/chemistry", emoji: "⚗️" },
    { title: "İklim", href: "/climate", emoji: "🌍" },
    { title: "Elementler", href: "/elements", emoji: "🔬" },
    { title: "Tarih", href: "/history", emoji: "📚" },
    { title: "Haberler", href: "/news", emoji: "📰" },
  ];

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isModulesOpen, setIsModulesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Kullanıcı bilgilerini al
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <motion.nav
      className="frost-glass border-b border-brand-2/10 sticky top-0 z-50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <AILensLogo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/"
                className={`lens-button ${isActive('/') ? 'lens-button-primary' : 'lens-button-ghost'} px-4 py-2 text-sm`}
              >
                🏠 Ana Sayfa
              </Link>
            </motion.div>

            {/* AI LENS Modules Dropdown */}
            <div className="relative">
              <motion.button
                onClick={() => setIsModulesOpen(!isModulesOpen)}
                className="lens-button lens-button-soft px-4 py-2 text-sm flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>AI LENS Modülleri</span>
                <motion.div
                  animate={{ 
                    rotate: isModulesOpen ? 180 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {isModulesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-72 lens-card p-2 shadow-card grid grid-cols-2 gap-1"
                  >
                    {aiLensMenuItems.map((item, index) => (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <Link
                          href={item.href}
                          className="flex items-center px-3 py-2 text-sm text-text hover:text-brand-2 hover:bg-brand-2/5 rounded-lg transition-all duration-200"
                          onClick={() => setIsModulesOpen(false)}
                        >
                          <span className="text-base mr-2">{item.emoji}</span>
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/decisions"
                className={`lens-button ${isActive('/decisions') ? 'lens-button-primary' : 'lens-button-ghost'} px-4 py-2 text-sm`}
              >
                ⚡ Kararlar
              </Link>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/ai-lens/dashboard"
                className="lens-button-primary px-6 py-2 text-sm font-semibold ml-4"
                style={{
                  background: 'var(--grad-accent)',
                  color: 'var(--bg)',
                }}
              >
                Enter AI Lens
              </Link>
            </motion.div>
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <motion.button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 lens-button lens-button-ghost px-3 py-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user.name || user.email}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full right-0 mt-2 w-48 lens-card p-2 shadow-card"
                    >
                      <Link
                        href="/settings"
                        className="flex items-center px-3 py-2 text-sm text-text hover:text-brand-2 hover:bg-brand-2/5 rounded-lg transition-all"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Ayarlar
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsUserMenuOpen(false);
                        }}
                        className="flex items-center w-full text-left px-3 py-2 text-sm text-text hover:text-danger hover:bg-danger/5 rounded-lg transition-all"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Çıkış Yap
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="lens-button lens-button-ghost px-4 py-2 text-sm"
                >
                  Giriş
                </Link>
                <Link
                  href="/register"
                  className="lens-button lens-button-primary px-4 py-2 text-sm"
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-muted hover:text-text hover:bg-brand-2/10 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-brand-2/10 pt-2 pb-3 space-y-1"
            >
              <Link
                href="/"
                className={`block px-3 py-2 rounded-lg text-base font-medium transition-all ${
                  isActive('/') ? 'text-brand-2 bg-brand-2/10' : 'text-text hover:text-brand-2 hover:bg-brand-2/5'
                }`}
                onClick={() => setIsOpen(false)}
              >
                🏠 Ana Sayfa
              </Link>
              
              {navigationItems.slice(1).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-text hover:text-brand-2 hover:bg-brand-2/5 transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-lg mr-3">{item.emoji}</span>
                  {item.title}
                </Link>
              ))}

              <Link
                href="/decisions"
                className={`block px-3 py-2 rounded-lg text-base font-medium transition-all ${
                  isActive('/decisions') ? 'text-brand-2 bg-brand-2/10' : 'text-text hover:text-brand-2 hover:bg-brand-2/5'
                }`}
                onClick={() => setIsOpen(false)}
              >
                ⚡ Kararlar
              </Link>

              {/* Mobile Auth */}
              {user ? (
                <div className="border-t border-brand-2/10 pt-2 mt-2">
                  <div className="px-3 py-2 text-sm text-muted">
                    {user.name || user.email}
                  </div>
                  <Link
                    href="/settings"
                    className="block px-3 py-2 rounded-lg text-base font-medium text-text hover:text-brand-2 hover:bg-brand-2/5 transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    ⚙️ Ayarlar
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-text hover:text-danger hover:bg-danger/5 transition-all"
                  >
                    🚪 Çıkış Yap
                  </button>
                </div>
              ) : (
                <div className="border-t border-brand-2/10 pt-2 mt-2 space-y-1">
                  <Link
                    href="/login"
                    className="block px-3 py-2 rounded-lg text-base font-medium text-text hover:text-brand-2 hover:bg-brand-2/5 transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    🔑 Giriş
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 rounded-lg text-base font-medium bg-brand-2/10 text-brand-2 hover:bg-brand-2/20 transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    ✨ Kayıt Ol
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
