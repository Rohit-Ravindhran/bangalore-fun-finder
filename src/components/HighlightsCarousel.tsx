import React, { useEffect, useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchActiveHighlights, Highlight } from '@/services/highlightsService';

interface HighlightsCarouselProps {
  className?: string;
}

const ALLOWED_EXTERNAL_HOSTS = [
  'happeningsbangalore.com',
  'in.bookmyshow.com',
  'www.google.com',
  'maps.google.com',
];

const HighlightsCarousel: React.FC<HighlightsCarouselProps> = ({ className }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    containScroll: 'trimSnaps',
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const { data: highlights = [], isLoading } = useQuery({
    queryKey: ['highlights', 'active'],
    queryFn: fetchActiveHighlights,
    staleTime: 5 * 60 * 1000,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Auto-play
  useEffect(() => {
    if (!emblaApi || highlights.length <= 1) return;
    const id = setInterval(() => emblaApi.scrollNext(), 4500);
    return () => clearInterval(id);
  }, [emblaApi, highlights.length]);

  // Nothing to show yet
  if (isLoading || highlights.length === 0) return null;

  const handleBannerClick = (highlight: Highlight) => {
    if (!highlight.link_url) return;
    if (highlight.link_url.startsWith('/')) {
      window.location.href = '/' + highlight.link_url.replace(/^\/+/, '');
      return;
    }
    try {
      const parsed = new URL(highlight.link_url);
      if (parsed.protocol !== 'https:') return;
      const allowed = ALLOWED_EXTERNAL_HOSTS.some(
        (h) => parsed.hostname === h || parsed.hostname.endsWith('.' + h)
      );
      if (!allowed) return;
      window.open(highlight.link_url, '_blank', 'noopener,noreferrer');
    } catch {
      // invalid URL — ignore
    }
  };

  return (
    <div className={cn('relative w-full max-w-full mb-4 overflow-hidden', className)}>
      {/* Carousel viewport */}
      <div className="overflow-hidden rounded-xl w-full" ref={emblaRef}>
        <div className="flex touch-pan-y w-full">
          {highlights.map((highlight) => (
            <div key={highlight.id} className="flex-[0_0_100%] min-w-0">
              <div
                className={cn(
                  'relative aspect-[3/1] md:aspect-[4/1] w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-white/[0.04]',
                  highlight.link_url && 'cursor-pointer'
                )}
                onClick={() => handleBannerClick(highlight)}
              >
                <img
                  src={highlight.image_url}
                  alt={highlight.title || 'Highlight banner'}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
                {highlight.title && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                      <h3 className="text-white text-sm md:text-lg font-semibold line-clamp-2 drop-shadow-lg">
                        {highlight.title}
                      </h3>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop arrows */}
      {highlights.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-md z-10"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5 text-gray-800" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-md z-10"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5 text-gray-800" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {highlights.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                index === selectedIndex
                  ? 'bg-[#FFD60A] w-4'
                  : 'bg-gray-300 dark:bg-white/20 w-1.5 hover:bg-gray-400'
              )}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HighlightsCarousel;
