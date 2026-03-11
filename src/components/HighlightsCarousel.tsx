import React, { useEffect, useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Users, Utensils, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchActiveHighlights, Highlight } from '@/services/highlightsService';

interface HighlightsCarouselProps {
  className?: string;
}

interface StaticSlide {
  id: string;
  type: 'static';
  gradient: string;
  content: React.ReactNode;
}

const STATIC_SLIDES: StaticSlide[] = [
  {
    id: 'static-welcome',
    type: 'static',
    gradient: 'from-orange-500 via-pink-500 to-purple-600',
    content: (
      <div className="flex flex-col justify-center h-full px-6 py-4 text-white">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 opacity-80" />
          <span className="text-xs font-medium uppercase tracking-widest opacity-80">Bangalore</span>
        </div>
        <h2 className="text-xl md:text-3xl font-bold leading-tight mb-1">
          Your city, your vibe.
        </h2>
        <p className="text-sm md:text-base opacity-90 leading-snug">
          Discover the best events, meetups, food spots & activities happening around you.
        </p>
      </div>
    ),
  },
  {
    id: 'static-features',
    type: 'static',
    gradient: 'from-blue-600 via-indigo-500 to-violet-600',
    content: (
      <div className="flex flex-col justify-center h-full px-6 py-4 text-white">
        <p className="text-xs font-semibold uppercase tracking-widest opacity-75 mb-3">What's inside</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {[
            { icon: Calendar, label: 'Events & Shows' },
            { icon: Users, label: 'Meetups' },
            { icon: Utensils, label: 'Food Spots' },
            { icon: MapPin, label: 'Places to Explore' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Icon className="w-3 h-3" />
              </div>
              <span className="text-xs md:text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'static-coming-soon',
    type: 'static',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
    content: (
      <div className="flex flex-col justify-center h-full px-6 py-4 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-widest opacity-80">Stay tuned</span>
        </div>
        <h2 className="text-xl md:text-3xl font-bold leading-tight mb-1">
          More is coming soon.
        </h2>
        <p className="text-sm md:text-base opacity-90">
          Date ideas, friend-finding, curated guides & personalized picks — all on the way.
        </p>
      </div>
    ),
  },
];

const HighlightsCarousel: React.FC<HighlightsCarouselProps> = ({ className }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'start',
    containScroll: 'trimSnaps',
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  // Fetch active highlights
  const { data: highlights = [], isLoading } = useQuery({
    queryKey: ['highlights', 'active'],
    queryFn: fetchActiveHighlights,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

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

  const totalSlides = STATIC_SLIDES.length + highlights.length;

  // Auto-play functionality
  useEffect(() => {
    if (!emblaApi || totalSlides <= 1) return;

    const autoplayInterval = setInterval(() => {
      emblaApi.scrollNext();
    }, 4500); // 4.5 seconds

    return () => clearInterval(autoplayInterval);
  }, [emblaApi, totalSlides]);

  if (isLoading) return null;

  const handleBannerClick = (highlight: Highlight) => {
    if (highlight.link_url) {
      if (highlight.link_url.startsWith('/')) {
        window.location.href = highlight.link_url;
      } else {
        window.open(highlight.link_url, '_blank', 'noopener,noreferrer');
      }
    }
  };

  return (
    <div className={cn('relative w-full max-w-full mb-4 overflow-hidden', className)}>
      {/* Main Carousel Container */}
      <div className="overflow-hidden rounded-xl w-full" ref={emblaRef}>
        <div className="flex touch-pan-y w-full">
          {/* Static info slides */}
          {STATIC_SLIDES.map((slide) => (
            <div key={slide.id} className="flex-[0_0_100%] min-w-0">
              <div className={cn(
                "relative aspect-[3/1] md:aspect-[4/1] w-full overflow-hidden rounded-xl bg-gradient-to-r",
                slide.gradient
              )}>
                {slide.content}
              </div>
            </div>
          ))}

          {/* DB highlight slides */}
          {highlights.map((highlight) => (
            <div
              key={highlight.id}
              className="flex-[0_0_100%] min-w-0"
            >
              <div
                className={cn(
                  "relative aspect-[3/1] md:aspect-[4/1] w-full max-w-full overflow-hidden rounded-xl bg-gray-100",
                  highlight.link_url && "cursor-pointer"
                )}
                onClick={() => handleBannerClick(highlight)}
              >
                <img
                  src={highlight.image_url}
                  alt={highlight.title || 'Highlight banner'}
                  className="h-full w-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
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

      {/* Navigation Arrows - Only show on desktop and when more than 1 slide */}
      {totalSlides > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-md transition-all duration-200 z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 text-gray-800" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-md transition-all duration-200 z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 text-gray-800" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {totalSlides > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === selectedIndex
                  ? "bg-gray-800 w-4"
                  : "bg-gray-300 hover:bg-gray-400"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HighlightsCarousel;
