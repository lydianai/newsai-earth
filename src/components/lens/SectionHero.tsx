'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface SectionHeroProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showParticles?: boolean;
  className?: string;
}

export const SectionHero: React.FC<SectionHeroProps> = ({ 
  children, 
  title,
  subtitle,
  showParticles = false,
  className 
}) => {
  return (
    <section className={cn('lens-hero relative overflow-hidden', className)}>
      {/* Particle Background */}
      {showParticles && (
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-brand-1 rounded-full animate-float" />
          <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-brand-2 rounded-full animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-accent-1 rounded-full animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-accent-2 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-24">
        {title && (
          <motion.h1 
            className="text-4xl md:text-6xl font-heading font-bold text-center mb-6"
            style={{
              background: 'var(--grad-accent)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {title}
          </motion.h1>
        )}
        
        {subtitle && (
          <motion.p 
            className="text-xl text-muted text-center mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {subtitle}
          </motion.p>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
};
