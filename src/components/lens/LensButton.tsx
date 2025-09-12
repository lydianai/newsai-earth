'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface LensButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'ghost' | 'soft';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const variants = {
  primary: 'lens-button-primary',
  ghost: 'lens-button-ghost',
  soft: 'lens-button-soft',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export const LensButton = React.forwardRef<HTMLButtonElement, LensButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    isLoading = false,
    leftIcon,
    rightIcon,
    children, 
    className,
    disabled,
    ...props 
  }, ref) => {
    const isDisabled = disabled || isLoading;

    return (
      <motion.button
        ref={ref}
        className={cn(
          'lens-button',
          variants[variant],
          sizes[size],
          isDisabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        disabled={isDisabled}
        whileHover={!isDisabled ? { scale: 1.02 } : undefined}
        whileTap={!isDisabled ? { scale: 0.98 } : undefined}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            Loading...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            {leftIcon && <span className="w-4 h-4">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="w-4 h-4">{rightIcon}</span>}
          </div>
        )}
      </motion.button>
    );
  }
);

LensButton.displayName = 'LensButton';
