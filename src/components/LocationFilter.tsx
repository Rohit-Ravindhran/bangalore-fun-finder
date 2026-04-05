import React, { useState } from 'react';
import { MapPin, LocateFixed, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LocationFilterProps {
  selectedLocation: string | null;
  onLocationSelect: (location: string | null) => void;
  onUserLocation?: (coords: { lat: number; lng: number } | null) => void;
}

const locations = [
  { id: 'indiranagar', label: 'Indiranagar', lat: 12.9784, lng: 77.6408 },
  { id: 'koramangala', label: 'Koramangala', lat: 12.9352, lng: 77.6245 },
  { id: 'hsr', label: 'HSR Layout', lat: 12.9116, lng: 77.6389 },
  { id: 'whitefield', label: 'Whitefield', lat: 12.9698, lng: 77.7499 },
  { id: 'jayanagar', label: 'Jayanagar', lat: 12.9299, lng: 77.5826 },
  { id: 'malleshwaram', label: 'Malleshwaram', lat: 13.004, lng: 77.57 },
];

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const LocationFilter: React.FC<LocationFilterProps> = ({
  selectedLocation,
  onLocationSelect,
  onUserLocation,
}) => {
  const [locating, setLocating] = useState(false);
  const [nearYouActive, setNearYouActive] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const handleNearYou = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation not supported');
      return;
    }

    if (nearYouActive) {
      // Toggle off
      setNearYouActive(false);
      onLocationSelect(null);
      onUserLocation?.(null);
      return;
    }

    setLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onUserLocation?.({ lat: latitude, lng: longitude });

        // Find nearest area
        let nearest = locations[0];
        let minDist = haversineDistance(latitude, longitude, locations[0].lat, locations[0].lng);
        for (const loc of locations.slice(1)) {
          const d = haversineDistance(latitude, longitude, loc.lat, loc.lng);
          if (d < minDist) {
            minDist = d;
            nearest = loc;
          }
        }

        // Only auto-select if within 15km of Bangalore
        if (minDist < 25) {
          onLocationSelect(nearest.id);
        }

        setNearYouActive(true);
        setLocating(false);
      },
      (err) => {
        setGeoError(err.code === 1 ? 'Location access denied' : 'Could not get location');
        setLocating(false);
      },
      { timeout: 8000, maximumAge: 60000 }
    );
  };

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</span>
        {geoError && (
          <span className="text-xs text-red-400 ml-1">{geoError}</span>
        )}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {/* Near You button */}
        <button
          onClick={handleNearYou}
          disabled={locating}
          className={cn(
            "flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
            nearYouActive
              ? "bg-orange-500 text-white border-orange-500"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-orange-300 hover:text-orange-500"
          )}
        >
          {locating ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <LocateFixed className="h-3 w-3" />
          )}
          Near You
        </button>

        {/* Divider */}
        <div className="flex-shrink-0 w-px h-6 bg-gray-200 dark:bg-gray-700 self-center" />

        {/* All Areas */}
        <button
          onClick={() => {
            onLocationSelect(null);
            setNearYouActive(false);
            onUserLocation?.(null);
          }}
          className={cn(
            "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
            selectedLocation === null && !nearYouActive
              ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300"
          )}
        >
          All Areas
        </button>

        {locations.map((location) => (
          <button
            key={location.id}
            onClick={() => {
              onLocationSelect(location.id === selectedLocation ? null : location.id);
              setNearYouActive(false);
              onUserLocation?.(null);
            }}
            className={cn(
              "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
              selectedLocation === location.id && !nearYouActive
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300"
            )}
          >
            {location.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LocationFilter;
