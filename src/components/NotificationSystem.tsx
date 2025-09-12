'use client'

import React, { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, AlertTriangle, Info, Zap } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'live';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  timestamp: Date;
  module?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notificationData: Omit<Notification, 'id' | 'timestamp'>) => {
    const notification: Notification = {
      ...notificationData,
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    setNotifications(prev => [notification, ...prev]);

    // Auto-remove notification after duration (default 6 seconds)
    const duration = notification.duration ?? 6000;
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(notification.id);
      }, duration);
    }
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Simulate live notifications from various AI-Lens modules
  useEffect(() => {
    const simulateNotifications = () => {
      const sampleNotifications = [
        {
          title: 'EarthBrief Update',
          message: 'New climate summit developments detected - 3 breaking news articles available',
          type: 'info' as const,
          module: 'EarthBrief',
          priority: 'medium' as const
        },
        {
          title: 'Digital Twin Alert',
          message: 'Real-time Earth simulation updated with latest satellite data',
          type: 'success' as const,
          module: 'Digital Twin',
          priority: 'low' as const
        },
        {
          title: 'Quantum Lab Achievement',
          message: 'Quantum algorithm optimization completed - 25% performance improvement',
          type: 'success' as const,
          module: 'Quantum Lab',
          priority: 'high' as const
        },
        {
          title: 'Global Discourse Active',
          message: 'AI Host ARIA is now facilitating 5 live discussions with 2,847 participants',
          type: 'live' as const,
          module: 'Global Discourse',
          priority: 'medium' as const
        },
        {
          title: 'Metaverse Connection',
          message: 'New VR environment "Climate Summit 2025" is now available',
          type: 'info' as const,
          module: 'Metaverse Hub',
          priority: 'low' as const
        },
        {
          title: 'Research Intelligence',
          message: 'AI discovered 12 new correlations in climate data patterns',
          type: 'success' as const,
          module: 'Research Lab',
          priority: 'medium' as const
        },
        {
          title: 'System Alert',
          message: 'All AI-Lens modules operational - 99.8% uptime maintained',
          type: 'success' as const,
          module: 'System',
          priority: 'low' as const
        }
      ];

      // Random notification every 15-30 seconds
      const randomNotification = sampleNotifications[Math.floor(Math.random() * sampleNotifications.length)];
      
      if (Math.random() < 0.3) { // 30% chance
        addNotification({
          ...randomNotification,
          duration: 8000 // 8 seconds for auto notifications
        });
      }
    };

    // Initial delay then periodic notifications
    const initialDelay = setTimeout(simulateNotifications, 5000); // First after 5 seconds
    const interval = setInterval(simulateNotifications, 20000); // Then every 20 seconds

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, [addNotification]);

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      addNotification, 
      removeNotification, 
      clearAllNotifications 
    }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
}

function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications();

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <Check className="w-5 h-5 text-green-400" />;
      case 'error':
        return <X className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'live':
        return <Zap className="w-5 h-5 text-purple-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getColors = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-500/30 bg-green-500/10';
      case 'error':
        return 'border-red-500/30 bg-red-500/10';
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10';
      case 'live':
        return 'border-purple-500/30 bg-purple-500/10';
      default:
        return 'border-blue-500/30 bg-blue-500/10';
    }
  };

  const getPriorityColor = (priority?: Notification['priority']) => {
    switch (priority) {
      case 'critical':
        return 'border-l-red-500';
      case 'high':
        return 'border-l-orange-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-blue-500';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 500, damping: 30 }}
            className={`
              relative rounded-xl border-2 border-l-4 backdrop-blur-sm p-4 shadow-lg
              ${getColors(notification.type)} ${getPriorityColor(notification.priority)}
            `}
          >
            {/* Close Button */}
            <button
              onClick={() => removeNotification(notification.id)}
              className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-white" />
            </button>

            {/* Content */}
            <div className="flex items-start space-x-3 pr-6">
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(notification.type)}
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-sm font-semibold text-white truncate">
                    {notification.title}
                  </h3>
                  {notification.module && (
                    <span className="px-2 py-0.5 bg-slate-800/50 text-xs font-medium text-slate-300 rounded-full">
                      {notification.module}
                    </span>
                  )}
                  {notification.type === 'live' && (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                      <span className="text-xs font-bold text-purple-400">LIVE</span>
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-gray-300 leading-relaxed">
                  {notification.message}
                </p>

                {/* Timestamp */}
                <div className="mt-2 text-xs text-gray-500">
                  {notification.timestamp.toLocaleTimeString()}
                </div>

                {/* Action Button */}
                {notification.action && (
                  <button
                    onClick={notification.action.onClick}
                    className="mt-3 px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    {notification.action.label}
                  </button>
                )}
              </div>
            </div>

            {/* Live pulse animation for live notifications */}
            {notification.type === 'live' && (
              <motion.div
                className="absolute inset-0 rounded-xl border-2 border-purple-500/20"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Hook for manual notifications
export const useNotify = () => {
  const { addNotification } = useNotifications();

  return {
    success: (title: string, message: string, options?: Partial<Notification>) => 
      addNotification({ title, message, type: 'success', ...options }),
    
    error: (title: string, message: string, options?: Partial<Notification>) => 
      addNotification({ title, message, type: 'error', ...options }),
    
    warning: (title: string, message: string, options?: Partial<Notification>) => 
      addNotification({ title, message, type: 'warning', ...options }),
    
    info: (title: string, message: string, options?: Partial<Notification>) => 
      addNotification({ title, message, type: 'info', ...options }),
    
    live: (title: string, message: string, options?: Partial<Notification>) => 
      addNotification({ title, message, type: 'live', ...options }),
  };
};
