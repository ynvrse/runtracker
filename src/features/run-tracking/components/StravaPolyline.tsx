import { Polyline } from 'react-leaflet';

import { LatLngExpression } from 'leaflet';

// Simpler approach using CSS
function StravaPolyline({
  route,
  isTracking = false,
}: {
  route: LatLngExpression[];
  isTracking: boolean;
}) {
  if (route.length < 2) return null;

  return (
    <>
      {/* Shadow/Glow Layer */}

      {/* Main Gradient Route */}
      <Polyline
        pathOptions={{
          color: '#ee7524ff',
          weight: 6,
          opacity: 1,
          lineCap: 'round',
          lineJoin: 'round',
          className: `strava-main ${isTracking ? 'strava-animated' : ''}`,
        }}
        positions={route}
      />
    </>
  );
}
export default StravaPolyline;
