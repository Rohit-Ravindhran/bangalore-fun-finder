'use client'

import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  /** Optional leading icon (e.g. <Flame className="h-5 w-5 text-orange-500" />). */
  icon?: React.ReactNode;
  /** Optional trailing count badge. */
  count?: number;
  /** Optional element rendered on the right (e.g. a view toggle). */
  action?: React.ReactNode;
  className?: string;
}

/** Row with an icon, title, optional count and a right-aligned action. */
const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  icon,
  count,
  action,
  className,
}) => {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
        {count !== undefined && (
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
            ({count})
          </span>
        )}
      </div>
      {action}
    </div>
  );
};

export default SectionHeading;
