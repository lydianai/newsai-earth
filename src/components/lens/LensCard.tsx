'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface LensCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode;
  variant?: 'default' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

const variants = {
  default: 'lens-card',
  glass: 'lens-card frost-glass',
};

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const LensCard = React.forwardRef<HTMLDivElement, LensCardProps>(
  ({ 
    children, 
    variant = 'default',
    padding = 'md',
    hoverable = true,
    className,
    ...props 
  }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          variants[variant],
          paddings[padding],
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={hoverable ? { y: -2 } : undefined}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

LensCard.displayName = 'LensCard';
