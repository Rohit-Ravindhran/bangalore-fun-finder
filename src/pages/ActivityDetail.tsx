
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Calendar, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getActivityById } from '@/services/activityService';
import { useToast } from '@/components/ui/use-toast';
import { Activity } from '@/components/ActivityCard';
import { useQuery } from '@tanstack/react-query';

const ActivityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Use React Query for data fetching with caching
  const { data: activity, isLoading, error } = useQuery({
    queryKey: ['activity', id],
    queryFn: () => getActivityById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/placeholder.svg';
  };
  
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
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Activity not found</h1>
          <Button onClick={() => navigate('/')} className="bg-gray-900 text-white">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }
  
  const goToMap = () => {
    if (activity.mapLink) {
      window.open(activity.mapLink, '_blank');
    } else if (activity.url) {
      window.open(activity.url, '_blank');
    } else {
      const searchQuery = encodeURIComponent(`${activity.title} ${activity.location}`);
      window.open(`https://www.google.com/maps/search/${searchQuery}`, '_blank');
    }
  };

  const formattedTime = formatTimeTo12Hour(activity.time);
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header with back button */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back</span>
        </button>
      </div>
      
      {/* Image */}
      <div className="w-full aspect-[16/9] overflow-hidden">
        <img 
          src={activity.image} 
          alt={activity.title} 
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      </div>
      
      {/* Content */}
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{activity.title}</h1>
        
        {/* Description */}
        <p className="text-gray-600 mb-6 leading-relaxed">{activity.description}</p>
        
        {/* Event Tag */}
        {activity.categoryNames && activity.categoryNames.length > 0 && (
          <div className="mb-6">
            <span className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
              {activity.categoryNames[0]}
            </span>
          </div>
        )}
        
        {/* Price Section */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6 text-center">
          <p className="text-sm text-gray-500 mb-1">Price</p>
          <p className="text-2xl font-bold text-gray-900">{activity.priceRange || 'Check website'}</p>
        </div>
        
        {/* Details Sections */}
        <div className="space-y-4 mb-6">
          {/* Date */}
          {activity.date && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium text-gray-900">{activity.date}</p>
              </div>
            </div>
          )}
          
          {/* Time */}
          {formattedTime && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium text-gray-900">{formattedTime}</p>
              </div>
            </div>
          )}
          
          {/* Location */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium text-gray-900">{activity.location}</p>
            </div>
          </div>
        </div>
        
        {/* Show on Map Button */}
        <Button 
          onClick={goToMap}
          variant="outline"
          className="w-full py-6 text-base font-medium border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-2"
        >
          <Map className="h-5 w-5" />
          Show on Map
        </Button>
      </div>
    </div>
  );
};

export default ActivityDetail;
