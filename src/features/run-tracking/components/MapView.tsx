import { useEffect, useState } from 'react';
import { Circle, MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';

import { LatLngExpression } from 'leaflet';
import L from 'leaflet';

import useGeolocation from '../hooks/useGeolocation';
import AnimatedMarker from './AnimatedMarker';
import StravaPolyline from './StravaPolyline';

// Fix untuk marker icons Leaflet di React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  position: LatLngExpression | null;
  route: LatLngExpression[];
  isTracking?: boolean;
}

// Component to automatically fly to the new position
function ChangeView({ center, zoom }: { center: LatLngExpression; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

// Route Stats Component
function RouteStats({ route }: { route: LatLngExpression[] }) {
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    if (route.length > 1) {
      let totalDistance = 0;
      for (let i = 1; i < route.length; i++) {
        const prev = route[i - 1] as [number, number];
        const curr = route[i] as [number, number];

        const R = 6371000;
        const dLat = ((curr[0] - prev[0]) * Math.PI) / 180;
        const dLon = ((curr[1] - prev[1]) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((prev[0] * Math.PI) / 180) *
            Math.cos((curr[0] * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        totalDistance += R * c;
      }
      setDistance(totalDistance);
    }
  }, [route]);

  if (route.length <= 1) return null;

  return (
    <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
      <div className="flex items-center space-x-3 text-sm">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="font-medium">{(distance / 1000).toFixed(2)} km</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="font-medium">{route.length} pts</span>
        </div>
      </div>
    </div>
  );
}

export default function MapView({ position, route, isTracking = false }: MapViewProps) {
  const defaultPosition: LatLngExpression = [-3.3194, 114.5906]; // Banjarmasin
  const location = useGeolocation({ enabled: true });
  return (
    <div className="relative w-full h-96 rounded-xl overflow-hidden shadow-lg bg-gray-100">
      <MapContainer
        center={position || defaultPosition}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        className="rounded-xl"
      >
        {/* Add SVG gradient definition */}

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {position && (
          <>
            <ChangeView center={position} zoom={isTracking ? 17 : 15} />

            {/* Current position marker */}
            {/* <Marker position={position}>
              <Popup>
                <div className="text-center">
                  <strong>Current Location</strong>
                  <br />
                  {isTracking ? 'Tracking active...' : 'You are here'}
                </div>
              </Popup>
            </Marker> */}

            {/* Accuracy circle */}

            {/* <StravaStylePolyline route={route} isTracking={isTracking} /> */}
            <AnimatedMarker
              position={position}
              isTracking={isTracking}
              accuracy={location.accuracy}
            />
            {route.length > 1 && <StravaPolyline route={route} isTracking={isTracking} />}
          </>
        )}
      </MapContainer>

      {/* Route Stats */}

      <RouteStats route={route} />

      {/* Live indicator */}
      {isTracking && (
        <div className="absolute top-4 right-4 z-[1000]">
          <div className="flex items-center space-x-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span>LIVE</span>
          </div>
        </div>
      )}

      {/* Loading state */}
      {!position && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-[1000] rounded-xl">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Getting location...</p>
          </div>
        </div>
      )}
    </div>
  );
}
