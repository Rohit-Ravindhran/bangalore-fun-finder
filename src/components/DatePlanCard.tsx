import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DatePlan, formatDuration, formatCost, getVibeInfo } from '@/types/datePlan';

interface DatePlanCardProps {
  datePlan: DatePlan;
  onLike?: (id: string) => void;
  liked?: boolean;
}

const DatePlanCard: React.FC<DatePlanCardProps> = ({ datePlan, onLike, liked = false }) => {
  const navigate = useNavigate();
  
  const handleViewPlan = () => {
    navigate(`/date-plans/${datePlan.id}`);
  };
  
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onLike) onLike(datePlan.id);
  };
  
  const vibeInfo = getVibeInfo(datePlan.vibe);
  
  return (
    <div 
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-rose-100/50"
      onClick={handleViewPlan}
    >
      {/* Hero Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img 
          src={datePlan.heroImage} 
          alt={datePlan.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Featured badge */}
        {datePlan.isFeatured && (
          <div className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            ✨ Featured
          </div>
        )}
        
        {/* Like button */}
        <button 
          onClick={handleLike}
          className={cn(
            "absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200",
            liked 
              ? "bg-rose-500 text-white" 
              : "bg-white/90 text-gray-600 hover:bg-rose-500 hover:text-white"
          )}
        >
          <Heart className={cn("w-4 h-4", liked && "fill-current")} />
        </button>
        
        {/* Vibe tag */}
        <div className="absolute bottom-3 left-3">
          <span className={cn(
            "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm",
            "bg-white/90"
          )}>
            <span>{vibeInfo.emoji}</span>
            <span className="text-gray-700">{vibeInfo.label}</span>
          </span>
        </div>
        
        {/* Area tag */}
        <div className="absolute bottom-3 right-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-700">
            <MapPin className="w-3 h-3" />
            {datePlan.area}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-rose-600 transition-colors">
          {datePlan.title}
        </h3>
        
        {/* Subtitle/Story */}
        <p className="text-sm text-gray-500 mb-3 line-clamp-1">
          {datePlan.subtitle}
        </p>
        
        {/* Quick stats */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <span className="font-semibold text-rose-600">
            💰 {formatCost(datePlan.totalCost)} for two
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {formatDuration(datePlan.duration)}
          </span>
          <span className="text-gray-400">
            {datePlan.stops.length} stops
          </span>
        </div>
        
        {/* Route Stops Timeline */}
        <div className="bg-rose-50/50 rounded-xl p-3 mb-3">
          <div className="flex items-start gap-2">
            {/* Timeline dots and line */}
            <div className="flex flex-col items-center pt-0.5">
              {datePlan.stops.map((_, index) => (
                <React.Fragment key={index}>
                  <div className="w-2 h-2 rounded-full bg-rose-400 flex-shrink-0" />
                  {index < datePlan.stops.length - 1 && (
                    <div className="w-0.5 h-4 bg-rose-200" />
                  )}
                </React.Fragment>
              ))}
            </div>
            
            {/* Stop names */}
            <div className="flex-1 min-w-0 space-y-1">
              {datePlan.stops.map((stop, index) => (
                <div 
                  key={stop.id} 
                  className="flex items-center gap-1.5 text-sm"
                >
                  <span>{stop.emoji}</span>
                  <span className="text-gray-700 truncate">{stop.name}</span>
                  {stop.estimatedCost === 0 && (
                    <span className="text-green-600 text-xs font-medium ml-auto flex-shrink-0">Free</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* View Plan Button */}
        <button 
          className="w-full text-sm font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50 py-2 rounded-lg transition-colors"
          onClick={handleViewPlan}
        >
          View Plan →
        </button>
      </div>
    </div>
  );
};

export default DatePlanCard;
