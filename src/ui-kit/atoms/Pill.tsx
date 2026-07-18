'use client'

import React from 'react';
import { cn } from '@/lib/utils';

interface PillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: React.ReactNode;
}

/**
 * Selectable rounded filter pill used by home filters and category chips.
 * Renders a <button>; pass `active` to show the selected state.
 */
const Pill: React.FC<PillProps> = ({ active = false, children, className, ...props }) => {
  return (
    <button
      className={cn(
        'flex-shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-all border flex items-center gap-1.5',
        active
          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Pill;
