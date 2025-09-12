"use client";

import { motion } from 'framer-motion';
import { 
  Shield,
  Users,
  BarChart3,
  Settings,
  Database,
  Activity,
  Globe,
  MessageSquare,
  Bell,
  Lock,
  Key,
  Server,
  Monitor,
  Zap,
  FileText,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

const adminModules = [
  {
    title: "Kullanıcı Yönetimi",
    icon: Users,
    description: "Kullanıcı hesapları, roller ve izinleri yönetin",
    status: "Aktif",
    users: "1,247",
    color: "blue"
  },
  {
    title: "Sistem İzleme",
    icon: Activity,
    description: "Sistem performansı ve sağlık durumu",
    status: "Çevrimiçi",
    users: "99.9%",
    color: "green"
  },
  {
    title: "API Yönetimi",
    icon: Server,
    description: "API endpoint'leri ve rate limiting",
    status: "Aktif",
    users: "856K",
    color: "purple"
  },
  {
    title: "İçerik Moderasyonu",
    icon: MessageSquare,
    description: "Kullanıcı içeriği ve topluluk yönetimi",
    status: "İzleme",
    users: "24/7",
    color: "orange"
  },
  {
    title: "Veri Analizi",
    icon: BarChart3,
    description: "Platform istatistikleri ve raporlama",
    status: "Güncel",
    users: "Real-time",
    color: "cyan"
  },
  {
    title: "Güvenlik Merkezi",
    icon: Lock,
    description: "Güvenlik olayları ve tehditleri izleme",
    status: "Korumalı",
    users: "256-bit",
    color: "red"
  }
];

const quickStats = [
  { label: "Toplam Kullanıcı", value: "1,247", change: "+12%", icon: Users },
  { label: "Günlük Aktif", value: "892", change: "+8%", icon: Activity },
  { label: "API Çağrıları", value: "2.4M", change: "+23%", icon: Server },
  { label: "Sistem Uptime", value: "99.9%", change: "0%", icon: Monitor }
];

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Admin Header */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="w-8 h-8 text-red-400 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
                  <p className="text-gray-400">NewsAI Earth Yönetim Merkezi</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-300">Sistem Aktif</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Acil Durum
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="w-8 h-8 text-blue-400" />
                <span className={`text-sm font-semibold ${
                  stat.change.startsWith('+') ? 'text-green-400' : 
                  stat.change.startsWith('-') ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Admin Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {adminModules.map((module, index) => (
            <motion.div
              key={module.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-${module.color}-400/50 transition-all duration-300 cursor-pointer group`}
            >
              <div className="flex items-start justify-between mb-4">
                <module.icon className={`w-10 h-10 text-${module.color}-400 group-hover:scale-110 transition-transform`} />
                <div className="text-right">
                  <p className="text-sm text-gray-400">Status</p>
                  <p className={`text-sm font-semibold text-${module.color}-400`}>{module.status}</p>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{module.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{module.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">{module.users}</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`bg-${module.color}-600 hover:bg-${module.color}-500 text-white px-3 py-1 rounded-lg text-sm transition-colors`}
                >
                  Yönet
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Real-time Logs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <FileText className="w-6 h-6 text-green-400 mr-2" />
              Sistem Logları
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {[
                { time: "14:23:45", type: "INFO", message: "API endpoint /earthbrief yeniden başlatıldı" },
                { time: "14:22:12", type: "SUCCESS", message: "Kullanıcı oturumu başarıyla oluşturuldu" },
                { time: "14:21:38", type: "WARNING", message: "Rate limit aşımı tespit edildi" },
                { time: "14:20:55", type: "INFO", message: "Global Discourse modülü güncellendi" },
                { time: "14:19:22", type: "ERROR", message: "Veritabanı bağlantı hatası giderildi" }
              ].map((log, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center text-sm"
                >
                  <span className="text-gray-500 w-16">{log.time}</span>
                  <span className={`w-16 font-semibold ${
                    log.type === 'ERROR' ? 'text-red-400' :
                    log.type === 'WARNING' ? 'text-yellow-400' :
                    log.type === 'SUCCESS' ? 'text-green-400' : 'text-blue-400'
                  }`}>
                    {log.type}
                  </span>
                  <span className="text-gray-300 flex-1">{log.message}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Zap className="w-6 h-6 text-yellow-400 mr-2" />
              Hızlı İşlemler
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Bell, label: "Bildirim Gönder", color: "blue" },
                { icon: Database, label: "Backup Al", color: "green" },
                { icon: Settings, label: "Sistem Ayarları", color: "gray" },
                { icon: TrendingUp, label: "Rapor Oluştur", color: "purple" },
                { icon: Key, label: "API Anahtarları", color: "orange" },
                { icon: Globe, label: "CDN Temizle", color: "cyan" }
              ].map((action) => (
                <motion.button
                  key={action.label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`bg-${action.color}-600/20 hover:bg-${action.color}-600/30 border border-${action.color}-600/50 text-${action.color}-400 p-3 rounded-lg transition-all duration-300 flex flex-col items-center`}
                >
                  <action.icon className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Security Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 bg-red-900/20 border border-red-600/50 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Lock className="w-6 h-6 text-red-400 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-white">Güvenlik Uyarısı</h3>
                <p className="text-gray-400">Admin paneline yetkisiz erişim denemeleri tespit edildi</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors"
            >
              İncele
            </motion.button>
          </div>
        </motion.div>

        {/* Access Control Notice */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Bu panel sadece yetkili yöneticiler için tasarlanmıştır. Tüm aktiviteler loglanmaktadır.</p>
          <p>Güvenlik soruları için: <Link href="/tr/contact" className="text-blue-400 hover:underline">support@newsai.earth</Link></p>
        </div>
      </div>
    </div>
  );
}
