import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { LatLngExpression } from 'leaflet';
import { Activity, ArrowLeft, MapPin, Route, Timer } from 'lucide-react';

import MapView from './components/MapView';
import RunControls from './components/RunControls';
import useGeolocation from './hooks/useGeolocation';

interface RunStats {
  distance: number;
  duration: number;
  pace: number;
  points: number;
}

export default function RunTrackingPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [route, setRoute] = useState<LatLngExpression[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [duration, setDuration] = useState(0);
  const [stats, setStats] = useState<RunStats>({
    distance: 0,
    duration: 0,
    pace: 0,
    points: 0,
  });

  const location = useGeolocation({ enabled: isRunning });

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && startTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setDuration(elapsed);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, startTime]);

  // Calculate distance using Haversine formula
  const calculateDistance = useCallback((points: LatLngExpression[]) => {
    if (points.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1] as [number, number];
      const curr = points[i] as [number, number];

      const R = 6371000; // Earth's radius in meters
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
    return totalDistance;
  }, []);

  // Update stats when route changes
  useEffect(() => {
    const distance = calculateDistance(route);
    const pace = duration > 0 ? distance / 1000 / (duration / 3600) : 0; // km/h

    setStats({
      distance,
      duration,
      pace,
      points: route.length,
    });
  }, [route, duration, calculateDistance]);

  // Add new location to route when tracking
  useEffect(() => {
    if (isRunning && location.latitude && location.longitude) {
      const newPoint: LatLngExpression = [location.latitude, location.longitude];

      // Only add point if it's significantly different from the last one (reduces noise)
      setRoute((prevRoute) => {
        if (prevRoute.length === 0) {
          return [newPoint];
        }

        const lastPoint = prevRoute[prevRoute.length - 1] as [number, number];
        const distance = calculateDistance([lastPoint, newPoint]);

        // Only add if moved more than 5 meters
        if (distance > 5) {
          return [...prevRoute, newPoint];
        }

        return prevRoute;
      });
    }
  }, [location, isRunning, calculateDistance]);

  const handleStart = () => {
    console.log('Starting run...');
    setRoute([]);
    setStartTime(Date.now());
    setDuration(0);
    setIsRunning(true);
  };

  const handleStop = () => {
    console.log('Stopping run...');
    setIsRunning(false);
    setStartTime(null);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleResume = () => {
    if (startTime) {
      const pausedDuration = duration;
      setStartTime(Date.now() - pausedDuration * 1000);
      setIsRunning(true);
    }
  };

  // Format time helper
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Format distance helper
  const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(2)} km`;
    }
    return `${meters.toFixed(0)} m`;
  };

  const currentPosition =
    location.latitude && location.longitude
      ? ([location.latitude, location.longitude] as LatLngExpression)
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Link
                to="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:translate-x-[-2px] transition-transform duration-200" />
                <span className="font-medium">Back</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Run Tracker
              </h1>
            </div>

            {/* Live Status Indicator */}
            <div className="flex items-center space-x-2">
              {isRunning && (
                <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>LIVE</span>
                </div>
              )}

              {location.error && (
                <div className="flex items-center space-x-2 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  <MapPin className="w-4 h-4" />
                  <span>GPS Error</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Error Message */}
        {location.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-red-500" />
              <p className="text-red-700 font-medium">Location Error</p>
            </div>
            <p className="text-red-600 text-sm mt-1">{location.error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              <Timer className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-600">Time</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatTime(duration)}</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              <Route className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-gray-600">Distance</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatDistance(stats.distance)}</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-gray-600">Pace</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats.pace > 0 ? `${stats.pace.toFixed(1)} km/h` : '0.0 km/h'}
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium text-gray-600">Points</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.points}</p>
          </div>
        </div>

        {/* Controls */}
        <RunControls
          isRunning={isRunning}
          onStart={handleStart}
          onStop={handleStop}
          onPause={handlePause}
          onResume={handleResume}
          hasRoute={route.length > 0}
        />

        {/* Map */}
        <div className="mb-6">
          <MapView position={currentPosition} route={route} isTracking={isRunning} />
        </div>

        {/* Debug Info (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 bg-gray-100 rounded-xl p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Debug Info</span>
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p>
                  <strong>Status:</strong> {isRunning ? 'Running' : 'Stopped'}
                </p>
                <p>
                  <strong>GPS:</strong>{' '}
                  {location.latitude && location.longitude ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div>
                <p>
                  <strong>Points:</strong> {route.length}
                </p>
                <p>
                  <strong>Accuracy:</strong>{' '}
                  {location.accuracy ? `${location.accuracy.toFixed(0)}m` : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
