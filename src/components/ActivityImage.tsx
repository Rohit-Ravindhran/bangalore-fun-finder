'use client'

import React, { useState } from 'react';

interface ActivityImageProps {
  src?: string | null;
  title: string;
  className?: string;
  alt?: string;
  loading?: 'lazy' | 'eager';
}

// Picks a deterministic gradient pair from the event title
function titleGradient(title: string): [string, string] {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const palettes: [string, string][] = [
    ['#F97316', '#EF4444'], // orange → red
    ['#8B5CF6', '#EC4899'], // purple → pink
    ['#06B6D4', '#3B82F6'], // cyan → blue
    ['#10B981', '#0D9488'], // emerald → teal
    ['#F59E0B', '#F97316'], // amber → orange
    ['#6366F1', '#8B5CF6'], // indigo → purple
    ['#14B8A6', '#06B6D4'], // teal → cyan
    ['#EF4444', '#F59E0B'], // red → amber
    ['#EC4899', '#F97316'], // pink → orange
    ['#3B82F6', '#6366F1'], // blue → indigo
  ];
  return palettes[Math.abs(hash) % palettes.length];
}

const ActivityImage: React.FC<ActivityImageProps> = ({
  src,
  title,
  className = '',
  alt,
  loading = 'lazy',
}) => {
  const [hasError, setHasError] = useState(false);
  const showFallback = !src || hasError;
  const [from, to] = titleGradient(title);

  if (showFallback) {
    return (
      <div
        className={`flex items-center justify-center overflow-hidden ${className}`}
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
        aria-label={alt || title}
      >
        <p
          className="text-white font-bold text-center px-3 leading-snug drop-shadow-md select-none"
          style={{ fontSize: 'clamp(0.7rem, 4cqw, 1.1rem)', maxWidth: '90%' }}
        >
          {title}
        </p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || title}
      className={className}
      loading={loading}
      onError={() => setHasError(true)}
    />
  );
};

export default ActivityImage;
