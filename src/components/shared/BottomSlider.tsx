/**
 * BottomSlider - Slides up from the bottom of the screen
 * Used for chatbot interactions like suggestions, file uploads, confirmations
 */

import React, { type ReactNode, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface BottomSliderProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  height?: 'sm' | 'md' | 'lg' | 'auto';
  showHandle?: boolean;
  icon?: React.ReactNode;
}

export const BottomSlider: React.FC<BottomSliderProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  height = 'auto',
  showHandle = true,
  icon,
}) => {
  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const heightClasses = {
    sm: 'max-h-[30vh]',
    md: 'max-h-[50vh]',
    lg: 'max-h-[70vh]',
    auto: 'max-h-[80vh]',
  };

  const slideVariants: Variants = {
    hidden: {
      y: '100%',
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      y: '100%',
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
          {/* Backdrop - only at bottom portion */}
          <motion.div
            className="absolute inset-0 pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Slider Panel */}
          <motion.div
            className={`absolute bottom-0 left-0 right-0 ${heightClasses[height]} bg-white rounded-t-2xl shadow-2xl flex flex-col pointer-events-auto`}
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Handle */}
            {showHandle && (
              <div className="flex justify-center py-2">
                <div className="w-12 h-1 bg-neutral-300 rounded-full" />
              </div>
            )}

            {/* Header */}
            <div className="px-6 py-3 border-b border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {icon && (
                  <div className="p-2 bg-primary-500/10 rounded-lg text-primary-500">
                    {icon}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-neutral-900">{title}</h3>
                  {subtitle && (
                    <p className="text-sm text-neutral-500">{subtitle}</p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <ChevronDown className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BottomSlider;
