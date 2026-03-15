import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Activity } from '@/components/ActivityCard';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

// User location marker — blue pulsing dot + "You are here" label
const userIcon = L.divIcon({
  className: '',
  iconAnchor: [12, 12],
  popupAnchor: [0, -16],
  html: `
    <div style="display:flex;flex-direction:column;align-items:center;gap:2px">
      <div style="position:relative;width:24px;height:24px;display:flex;align-items:center;justify-content:center">
        <div style="
          position:absolute;width:24px;height:24px;border-radius:50%;
          background:rgba(59,130,246,0.25);
          animation:pulse-ring 1.8s ease-out infinite;
        "></div>
        <div style="
          width:14px;height:14px;border-radius:50%;
          background:#3b82f6;border:2.5px solid #fff;
          box-shadow:0 2px 6px rgba(59,130,246,0.55);
          position:relative;z-index:1;
        "></div>
      </div>
      <div style="
        background:#3b82f6;color:#fff;
        font-size:10px;font-weight:700;
        padding:2px 6px;border-radius:4px;
        box-shadow:0 1px 4px rgba(0,0,0,0.18);
        white-space:nowrap;line-height:1.3;
      ">You are here</div>
    </div>
    <style>
      @keyframes pulse-ring {
        0%   { transform:scale(0.8); opacity:0.8; }
        100% { transform:scale(2.2); opacity:0; }
      }
    </style>`,
});

// Build a custom DivIcon that shows a pin dot + activity name label beneath it
function makeActivityIcon(title: string): L.DivIcon {
  const short = title.length > 22 ? title.slice(0, 20) + '…' : title;
  return L.divIcon({
    className: '',
    iconAnchor: [10, 10],
    popupAnchor: [0, -14],
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;gap:2px">
        <div style="
          width:20px;height:20px;border-radius:50%;
          background:#f97316;border:2.5px solid #fff;
          box-shadow:0 2px 6px rgba(0,0,0,0.30);
        "></div>
        <div style="
          background:rgba(255,255,255,0.95);
          color:#111;font-size:10px;font-weight:600;
          padding:2px 5px;border-radius:4px;
          box-shadow:0 1px 4px rgba(0,0,0,0.18);
          white-space:nowrap;max-width:130px;
          overflow:hidden;text-overflow:ellipsis;
          line-height:1.3;
        ">${short}</div>
      </div>`,
  });
}

// Approximate coordinates for Bangalore areas
const AREA_COORDS: Record<string, [number, number]> = {
  indiranagar: [12.9784, 77.6408],
  koramangala: [12.9352, 77.6245],
  hsr: [12.9116, 77.6389],
  'hsr layout': [12.9116, 77.6389],
  whitefield: [12.9698, 77.7499],
  jayanagar: [12.9299, 77.5826],
  'jaya nagar': [12.9299, 77.5826],
  malleshwaram: [13.004, 77.57],
  'mg road': [12.9757, 77.6097],
  'brigade road': [12.9719, 77.6074],
  'church street': [12.9736, 77.6087],
  'ulsoor': [12.9825, 77.6199],
  'richmond': [12.9632, 77.6050],
  'lavelle': [12.9680, 77.5982],
  'cunningham': [12.9916, 77.5870],
  'hebbal': [13.0358, 77.5970],
  'electronic city': [12.8458, 77.6603],
  'marathahalli': [12.9591, 77.6983],
  'bellandur': [12.9262, 77.6780],
  'sarjapur': [12.8669, 77.7064],
  'jp nagar': [12.9087, 77.5804],
  'bannerghatta': [12.8984, 77.5755],
  'rajajinagar': [12.9904, 77.5530],
  'yeshwanthpur': [13.0284, 77.5375],
  'basavanagudi': [12.9413, 77.5754],
  'banashankari': [12.9245, 77.5548],
  'btm': [12.9166, 77.6101],
  'btm layout': [12.9166, 77.6101],
  'richmond town': [12.9632, 77.6050],
  'shivajinagar': [12.9870, 77.6009],
  'yelahanka': [13.1003, 77.5963],
  'bagalur': [13.0971, 77.6596],
  'domlur': [12.9607, 77.6408],
  'ejipura': [12.9407, 77.6270],
  'cambridge': [12.9858, 77.6212],
};

const BANGALORE_CENTER: [number, number] = [12.9716, 77.5946];

function getActivityCoords(activity: Activity): [number, number] | null {
  // Use real coordinates from DB first (extracted from map link)
  if (activity.latitude != null && activity.longitude != null) {
    return [activity.latitude, activity.longitude];
  }
  // Fall back to area-name lookup for older activities without stored coords
  if (!activity.location) return null;
  const loc = activity.location.toLowerCase();
  for (const [key, coords] of Object.entries(AREA_COORDS)) {
    if (loc.includes(key)) return coords;
  }
  return null;
}

// Component to recenter map when user location changes
function MapCenterUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13, { animate: true });
  }, [center, map]);
  return null;
}

interface ActivityMapViewProps {
  activities: Activity[];
  userLocation: { lat: number; lng: number } | null;
}

const ActivityMapView: React.FC<ActivityMapViewProps> = ({ activities, userLocation }) => {
  const navigate = useNavigate();

  const center: [number, number] = userLocation
    ? [userLocation.lat, userLocation.lng]
    : BANGALORE_CENTER;

  // Only include activities that have mappable locations
  const mappableActivities = activities.filter(a => getActivityCoords(a) !== null);
  const unmappableCount = activities.length - mappableActivities.length;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: '60vh', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {userLocation && (
          <>
            <MapCenterUpdater center={[userLocation.lat, userLocation.lng]} />
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
              <Popup>
                <div className="text-sm font-medium text-blue-600">You are here</div>
              </Popup>
            </Marker>
          </>
        )}

        {mappableActivities.map((activity) => {
          const coords = getActivityCoords(activity)!;
          return (
            <Marker key={activity.id} position={coords} icon={makeActivityIcon(activity.title)}>
              <Popup maxWidth={240}>
                <div className="flex flex-col gap-2">
                  {activity.image && (
                    <img
                      src={activity.image}
                      alt={activity.title}
                      className="w-full h-24 object-cover rounded"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  )}
                  <div className="font-bold text-gray-900 text-sm leading-tight">{activity.title}</div>
                  <div className="text-xs text-gray-500">{activity.location}</div>
                  {activity.priceRange && (
                    <div className="text-xs font-semibold text-gray-800">{activity.priceRange}</div>
                  )}
                  <button
                    onClick={() => navigate(`/activity/${activity.id}`)}
                    className="mt-1 w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Info bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs text-gray-600 shadow-md border border-gray-100 pointer-events-none">
        {mappableActivities.length} activities on map
        {unmappableCount > 0 && ` · ${unmappableCount} without exact location`}
      </div>
    </div>
  );
};

export default ActivityMapView;
