'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface StatPillProps {
  children: React.ReactNode;
  variant?: 'default' | 'live' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  className?: string;
}

const variants = {
  default: 'stat-pill',
  live: 'stat-pill-live',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  danger: 'bg-danger/10 text-danger border-danger/20',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

export const StatPill: React.FC<StatPillProps> = ({ 
  children, 
  variant = 'default',
  size = 'md',
  className 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full border';
  
  return (
    <motion.span
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2, delay: 0.1 }}
    >
      {children}
    </motion.span>
  );
};
