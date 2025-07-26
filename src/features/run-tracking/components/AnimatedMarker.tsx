import { useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';

import { DivIcon, LatLngExpression } from 'leaflet';

interface AnimatedMarkerProps {
  position: LatLngExpression;
  isTracking?: boolean;
  speed?: number;
  accuracy?: number | null;
  heading?: number | null;
}

function AnimatedMarker({
  position,
  isTracking = false,
  speed = 0,
  accuracy = null,
  heading = null,
}: AnimatedMarkerProps) {
  // Create custom animated icon
  const customIcon = useMemo(() => {
    const speedKmh = (speed * 3.6).toFixed(1);
    const pulseClass = isTracking ? 'animate-pulse' : '';
    const rotationStyle = heading ? `transform: rotate(${heading}deg);` : '';

    return new DivIcon({
      className: 'custom-animated-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <!-- Outer pulse ring -->
          <div class="absolute w-16 h-16 bg-green-400 rounded-full opacity-20 ${isTracking ? 'animate-ping' : ''}"></div>
          
          <!-- Middle accuracy circle -->
          ${
            accuracy
              ? `
            <div class="absolute w-12 h-12 border-2 border-blue-300 rounded-full opacity-40" 
                 style="width: ${Math.min(accuracy / 2, 48)}px; height: ${Math.min(accuracy / 2, 48)}px;"></div>
          `
              : ''
          }
          
          <!-- Main marker body -->
          <div class="relative z-10 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full border-4 border-white shadow-lg ${pulseClass}"
               style="${rotationStyle}">
            
            <!-- Direction arrow (if heading available) -->
            ${
              heading
                ? `
              <div class="absolute -top-1 left-1/2 transform -translate-x-1/2">
                <div class="w-0 h-0 border-l-2 border-r-2 border-b-4 border-l-transparent border-r-transparent border-b-white"></div>
              </div>
            `
                : ''
            }
            
            <!-- Center dot -->
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
          </div>
          
          <!-- Speed badge -->
          ${
            isTracking && speed > 0
              ? `
            <div class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg ${pulseClass}">
              ${speedKmh} km/h
            </div>
          `
              : ''
          }
          
          
        </div>
      `,
      iconSize: [64, 64],
      iconAnchor: [32, 32],
      popupAnchor: [0, -32],
    });
  }, [isTracking, speed, accuracy, heading]);

  return (
    <Marker position={position} icon={customIcon}>
      <Popup className="custom-popup" closeButton={false}>
        <div className="bg-white rounded-lg p-2 shadow-lg border-0 min-w-[200px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${isTracking ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}
              ></div>
              <span className="font-bold text-gray-800">
                {isTracking ? 'Live Tracking' : 'Current Location'}
              </span>
            </div>
            <div className="text-xs text-gray-500">{new Date().toLocaleTimeString()}</div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            {/* Speed */}
            {/* <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-2">
              <div className="text-xs text-gray-600">Speed</div>
              <div className="font-bold text-blue-700">{(speed * 3.6).toFixed(1)} km/h</div>
            </div> */}

            {/* Accuracy */}
            {/* <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-2">
              <div className="text-xs text-gray-600">Accuracy</div>
              <div className="font-bold text-green-700">
                {accuracy ? `±${accuracy.toFixed(0)}m` : 'N/A'}
              </div>
            </div> */}
          </div>

          {/* Coordinates */}
          <div className="bg-gray-50 rounded-lg p-2 mb-3">
            <div className="text-xs text-gray-600 mb-1">Coordinates</div>
            <div className="text-xs font-mono text-gray-800">
              {(position as [number, number])[0].toFixed(6)},{' '}
              {(position as [number, number])[1].toFixed(6)}
            </div>
          </div>

          {/* Status Message */}
          <div className="text-center">
            {isTracking ? (
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Recording your journey...</span>
              </div>
            ) : (
              <div className="text-gray-600 text-sm">Ready to start tracking</div>
            )}
          </div>

          {/* Direction indicator */}
          {heading && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-xs text-gray-600">Heading:</span>
                <div className="flex items-center space-x-1">
                  <div
                    className="w-4 h-4 border-2 border-gray-400 border-t-blue-500 rounded-full"
                    style={{ transform: `rotate(${heading}deg)` }}
                  ></div>
                  <span className="text-xs font-bold text-gray-800">{heading.toFixed(0)}°</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
}

export default AnimatedMarker;
