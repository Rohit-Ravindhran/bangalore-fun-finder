'use client'


import React, { useEffect } from 'react';
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, MapPin, Clock, Calendar, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Activity } from '@/components/ActivityCard';
import { useActivity } from '@/hooks/useActivities';
import { idFromSlug } from '@/lib/utils';
import ActivityImage from '@/components/ActivityImage';

// Validate URL is safe to open (only http/https protocols)
const isSecureUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

// Securely open external URL
const openSecureUrl = (url: string) => {
  if (isSecureUrl(url)) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};

const ActivityDetail = ({ initialActivity }: { initialActivity?: Activity | null } = {}) => {
  const params = useParams();
  const slug = params?.slug as string;
  const id = slug ? idFromSlug(slug) : '';
  const router = useRouter();
  const { toast } = useToast();

  // Use the custom hook with automatic caching; seed from server-fetched initialActivity
  const { data: activity, isLoading, error } = useActivity(id);
  const displayActivity = activity ?? initialActivity ?? null;
  
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading activity",
        description: "Could not load the activity details",
        variant: "destructive",
      });
    }
  }, [error, toast]);
  
  // Format time to 12-hour format
  const formatTimeTo12Hour = (timeString: string | undefined): string => {
    if (!timeString) return '';
    
    if (timeString.toLowerCase().includes('am') || timeString.toLowerCase().includes('pm')) {
      return timeString;
    }
    
    try {
      const timeParts = timeString.split(':');
      if (timeParts.length < 2) return timeString;
      
      let hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      
      return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
    } catch (error) {
      return timeString;
    }
  };
  
  if (isLoading && !displayActivity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!displayActivity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Activity not found</h1>
          <Button onClick={() => router.push('/')} className="bg-gray-900 dark:bg-gray-100 dark:text-gray-900 text-white">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }
  const formattedTime = formatTimeTo12Hour(displayActivity.time);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header with back button */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back</span>
        </button>
      </div>
      
      {/* Image */}
      <div className="w-full aspect-[16/9] overflow-hidden">
        <ActivityImage
          src={displayActivity.image}
          title={displayActivity.title}
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>
      
      {/* Content */}
      <div className="px-4 pt-6 pb-24 max-w-2xl mx-auto">
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{displayActivity.title}</h1>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{displayActivity.description}</p>

        {/* Event Tag */}
        {displayActivity.categoryNames && displayActivity.categoryNames.length > 0 && (
          <div className="mb-6">
            <span className="inline-block bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded-full">
              {displayActivity.categoryNames[0]}
            </span>
          </div>
        )}

        {/* Price Section */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Price</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{displayActivity.priceRange || 'Check website'}</p>
        </div>
        
        {/* Details Sections */}
        <div className="space-y-4 mb-6">
          {/* Date */}
          {displayActivity.date && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-50 dark:bg-orange-950/40 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                <p className="font-medium text-gray-900 dark:text-white">{displayActivity.date}</p>
              </div>
            </div>
          )}

          {/* Time */}
          {formattedTime && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-50 dark:bg-orange-950/40 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                <p className="font-medium text-gray-900 dark:text-white">{formattedTime}</p>
              </div>
            </div>
          )}

          {/* Location */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-orange-50 dark:bg-orange-950/40 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
              <p className="font-medium text-gray-900 dark:text-white">{displayActivity.location}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          {/* View on Map Button */}
          {displayActivity.mapLink && isSecureUrl(displayActivity.mapLink) && (
            <Button
              onClick={() => openSecureUrl(displayActivity.mapLink!)}
              variant="outline"
              className="w-full py-6 text-base font-medium border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/40 flex items-center justify-center gap-2"
            >
              <Map className="h-5 w-5" />
              View on Map
            </Button>
          )}

          {/* View More Details Button */}
          {displayActivity.url && isSecureUrl(displayActivity.url) && (
            <Button
              onClick={() => openSecureUrl(displayActivity.url!)}
              className="w-full py-6 text-base font-medium bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center gap-2"
            >
              View More Details
              <ArrowRight className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail;
