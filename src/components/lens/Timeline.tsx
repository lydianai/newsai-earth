'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  time?: string;
  status?: 'completed' | 'current' | 'pending';
  icon?: React.ReactNode;
}

const statusStyles = {
  completed: 'bg-success border-success/30 text-success',
  current: 'bg-brand-2 border-brand-2/30 text-brand-2 animate-pulse-brand',
  pending: 'bg-muted/20 border-muted/30 text-muted',
};

const lineStyles = {
  completed: 'bg-success/30',
  current: 'bg-brand-2/30',
  pending: 'bg-muted/20',
};

export const Timeline: React.FC<TimelineProps> = ({ items, className }) => {
  return (
    <div className={cn('relative', className)}>
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          className="relative flex items-start pb-8 last:pb-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          {/* Dot */}
          <div className="relative flex-shrink-0">
            <div className={cn(
              'w-4 h-4 rounded-full border-2 flex items-center justify-center',
              statusStyles[item.status || 'pending']
            )}>
              {item.icon && (
                <div className="w-2 h-2">
                  {item.icon}
                </div>
              )}
            </div>
            
            {/* Line */}
            {index < items.length - 1 && (
              <div className={cn(
                'absolute top-6 left-1/2 transform -translate-x-1/2 w-0.5 h-8',
                lineStyles[item.status || 'pending']
              )} />
            )}
          </div>
          
          {/* Content */}
          <div className="ml-4 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-text">{item.title}</h4>
              {item.time && (
                <span className="text-sm text-muted">{item.time}</span>
              )}
            </div>
            
            {item.description && (
              <p className="text-muted text-sm leading-relaxed">
                {item.description}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
