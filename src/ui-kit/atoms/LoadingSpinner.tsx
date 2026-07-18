'use client'

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  /** Wrap the spinner in a centered, padded block (default true). */
  block?: boolean;
  className?: string;
  /** Tailwind size classes for the icon, e.g. "h-10 w-10". */
  iconClassName?: string;
}

/** Centered loading spinner used across listings and async sections. */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  block = true,
  className,
  iconClassName = 'h-10 w-10',
}) => {
  const icon = (
    <Loader2 className={cn('animate-spin text-orange-500', iconClassName)} />
  );

  if (!block) return icon;

  return (
    <div className={cn('flex justify-center items-center py-20', className)}>
      {icon}
    </div>
  );
};

export default LoadingSpinner;
