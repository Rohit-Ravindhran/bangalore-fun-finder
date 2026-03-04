import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Clock, 
  MapPin, 
  Navigation,
  ExternalLink,
  Play,
  Copy,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { SEO } from '@/components/SEO';
import StopsTimeline from '@/components/StopsTimeline';
import { cn } from '@/lib/utils';
import { getDatePlanById } from '@/data/datePlanData';
import { 
  DatePlan, 
  DatePlanStop,
  formatDuration, 
  formatCost, 
  getVibeInfo 
} from '@/types/datePlan';

const DatePlanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeStop, setActiveStop] = useState<DatePlanStop | null>(null);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const datePlan = id ? getDatePlanById(id) : undefined;
  
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  
  // Set first stop as active by default
  useEffect(() => {
    if (datePlan && datePlan.stops.length > 0 && !activeStop) {
      setActiveStop(datePlan.stops[0]);
    }
  }, [datePlan, activeStop]);
  
  // Calculate total distance (simplified - just count stops)
  const routeInfo = useMemo(() => {
    if (!datePlan) return null;
    const totalStops = datePlan.stops.length;
    // Rough estimate: average 2km between stops in Bangalore
    const estimatedDistance = (totalStops - 1) * 2;
    return {
      stops: totalStops,
      distance: estimatedDistance,
    };
  }, [datePlan]);
  
  if (!datePlan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Date plan not found</h1>
          <Button 
            onClick={() => navigate('/date-plans')} 
            className="bg-rose-500 hover:bg-rose-600 text-white"
          >
            Browse Date Plans
          </Button>
        </div>
      </div>
    );
  }
  
  const vibeInfo = getVibeInfo(datePlan.vibe);
  
  const handleShare = async () => {
    const shareText = `Found this cute ${datePlan.area} date plan on Happenings Bangalore! "${datePlan.title}" - ${datePlan.stops.length} stops, ${formatCost(datePlan.totalCost)} for two 💕`;
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: datePlan.title,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Share it with your special someone 💕",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const handleStartDate = () => {
    // Open first stop in Google Maps
    const firstStop = datePlan.stops[0];
    const mapsUrl = firstStop.googleMapsUrl || 
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(firstStop.name + ' ' + firstStop.address)}`;
    window.open(mapsUrl, '_blank');
  };
  
  const handleOpenFullRoute = () => {
    // Build Google Maps URL with all waypoints
    const stops = datePlan.stops;
    if (stops.length < 2) return;
    
    const origin = `${stops[0].coordinates.lat},${stops[0].coordinates.lng}`;
    const destination = `${stops[stops.length - 1].coordinates.lat},${stops[stops.length - 1].coordinates.lng}`;
    const waypoints = stops
      .slice(1, -1)
      .map(s => `${s.coordinates.lat},${s.coordinates.lng}`)
      .join('|');
    
    let mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    if (waypoints) {
      mapsUrl += `&waypoints=${waypoints}`;
    }
    
    window.open(mapsUrl, '_blank');
  };
  
  const handleStopClick = (stop: DatePlanStop) => {
    setActiveStop(stop);
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title={`${datePlan.title} - Date Plan | Happenings Bangalore`}
        description={`${datePlan.subtitle}. ${datePlan.stops.length} stops, ${formatDuration(datePlan.duration)}, ${formatCost(datePlan.totalCost)} for two. Plan your perfect date in ${datePlan.area}.`}
        image={datePlan.heroImage}
        url={`https://happeningsbangalore.com/date-plans/${id}`}
      />
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium hidden sm:inline">Back</span>
          </button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLiked(!liked)}
              className={cn(
                "rounded-full",
                liked && "bg-rose-50 border-rose-200 text-rose-600"
              )}
            >
              <Heart className={cn("w-4 h-4 mr-1", liked && "fill-rose-500")} />
              Save
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="rounded-full"
            >
              {copied ? (
                <Check className="w-4 h-4 mr-1 text-green-500" />
              ) : (
                <Share2 className="w-4 h-4 mr-1" />
              )}
              Share
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile: Hero Image */}
      <div className="lg:hidden">
        <div className="relative aspect-[16/9] overflow-hidden">
          <img 
            src={datePlan.heroImage} 
            alt={datePlan.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Vibe badge */}
          <div className="absolute bottom-4 left-4">
            <span className={cn(
              "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium",
              vibeInfo.color
            )}>
              {vibeInfo.emoji} {vibeInfo.label}
            </span>
          </div>
        </div>
      </div>
      
      {/* Desktop: Split Layout | Mobile: Stacked */}
      <div className="max-w-6xl mx-auto lg:grid lg:grid-cols-2 lg:gap-0 lg:min-h-[calc(100vh-60px)]">
        {/* Left Panel - Plan Info & Timeline */}
        <div className="lg:border-r lg:border-gray-100 lg:overflow-y-auto">
          <div className="p-4 md:p-6">
            {/* Plan Header */}
            <div className="mb-6">
              <div className="hidden lg:block mb-3">
                <span className={cn(
                  "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium",
                  vibeInfo.color
                )}>
                  {vibeInfo.emoji} {vibeInfo.label}
                </span>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {datePlan.title}
              </h1>
              <p className="text-gray-500 text-lg">
                {datePlan.subtitle}
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-rose-50/50 rounded-xl">
              <div className="text-center">
                <p className="text-2xl font-bold text-rose-600">
                  {formatCost(datePlan.totalCost)}
                </p>
                <p className="text-xs text-gray-500">for two</p>
              </div>
              <div className="text-center border-x border-rose-100">
                <p className="text-2xl font-bold text-gray-900">
                  {datePlan.stops.length}
                </p>
                <p className="text-xs text-gray-500">stops</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {formatDuration(datePlan.duration)}
                </p>
                <p className="text-xs text-gray-500">total time</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 mb-8">
              <Button 
                onClick={handleStartDate}
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full h-12"
              >
                <Play className="w-4 h-4 mr-2 fill-current" />
                Start Date
              </Button>
              <Button 
                onClick={handleOpenFullRoute}
                variant="outline"
                className="flex-1 rounded-full h-12 border-rose-200 text-rose-600 hover:bg-rose-50"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Full Route
              </Button>
            </div>
            
            {/* Area Tag */}
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span className="text-gray-700">{datePlan.area} area</span>
              <span className="text-gray-300">•</span>
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-500 capitalize">{datePlan.timeOfDay} date</span>
            </div>
            
            {/* Stops Timeline */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                📍 Your Route
              </h2>
              <StopsTimeline 
                stops={datePlan.stops}
                activeStopId={activeStop?.id}
                onStopClick={handleStopClick}
              />
            </div>
            
            {/* Tags */}
            {datePlan.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {datePlan.tags.map(tag => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Panel - Map */}
        <div className="hidden lg:block sticky top-[60px] h-[calc(100vh-60px)]">
          {/* Desktop hero image as map placeholder */}
          <div className="relative h-full">
            <img 
              src={datePlan.heroImage} 
              alt={datePlan.title}
              className="w-full h-full object-cover"
            />
            
            {/* Map overlay with route preview */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center text-white p-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-4">
                  <div className="flex items-center justify-center gap-2 text-lg mb-2">
                    {datePlan.stops.map((stop, i) => (
                      <React.Fragment key={stop.id}>
                        <span className="text-2xl">{stop.emoji}</span>
                        {i < datePlan.stops.length - 1 && (
                          <span className="text-rose-300">→</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  <p className="text-sm text-white/80">
                    {routeInfo?.stops} stops • ~{routeInfo?.distance}km total
                  </p>
                </div>
                
                <Button 
                  onClick={handleOpenFullRoute}
                  className="bg-white text-gray-900 hover:bg-gray-100 rounded-full"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in Google Maps
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile: Map Section */}
      <div className="lg:hidden px-4 pb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          🗺️ Route Map
        </h2>
        <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
          <img 
            src={datePlan.heroImage} 
            alt="Route preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-white mb-2">
                {datePlan.stops.slice(0, 4).map((stop, i) => (
                  <React.Fragment key={stop.id}>
                    <span className="text-xl">{stop.emoji}</span>
                    {i < Math.min(datePlan.stops.length, 4) - 1 && (
                      <span className="text-rose-300 text-sm">→</span>
                    )}
                  </React.Fragment>
                ))}
                {datePlan.stops.length > 4 && (
                  <span className="text-white/70 text-sm ml-1">+{datePlan.stops.length - 4}</span>
                )}
              </div>
              <Button 
                onClick={handleOpenFullRoute}
                size="sm"
                className="bg-white text-gray-900 hover:bg-gray-100 rounded-full"
              >
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                Open in Maps
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile: Floating Action Button */}
      <div className="lg:hidden fixed bottom-20 left-4 right-4 z-30">
        <Button 
          onClick={handleStartDate}
          className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-full h-14 shadow-lg shadow-rose-500/30"
        >
          <Play className="w-5 h-5 mr-2 fill-current" />
          Start Date Now
        </Button>
      </div>
      
      {/* Bottom spacer for mobile */}
      <div className="h-32 lg:hidden" />
    </div>
  );
};

export default DatePlanDetail;
