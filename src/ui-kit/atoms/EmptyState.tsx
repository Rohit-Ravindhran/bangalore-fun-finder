'use client'

import React from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description?: string;
  /** Optional action rendered below the copy (e.g. a "Clear filters" button). */
  action?: React.ReactNode;
  className?: string;
}

/** Reusable "nothing here" card shown for empty listings and coming-soon sections. */
const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-2xl p-8 text-center border border-gray-100 dark:border-gray-700',
        className,
      )}
    >
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {description}
        </p>
      )}
      {action}
    </div>
  );
};

export default EmptyState;
