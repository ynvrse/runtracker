import { useEffect, useRef, useState } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
}

interface GeolocationOptions {
  enabled: boolean;
}

const useGeolocation = ({ enabled }: GeolocationOptions) => {
  const [location, setLocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
  });

  const watcherId = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      if (watcherId.current !== null) {
        navigator.geolocation.clearWatch(watcherId.current);
        watcherId.current = null;
      }
      return;
    }

    if (!navigator.geolocation) {
      setLocation((loc) => ({
        ...loc,
        error: 'Geolocation is not supported by your browser.',
      }));
      return;
    }

    watcherId.current = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy, // ⬅️ Tambahkan ini
          error: null,
        });
      },
      (error) => {
        setLocation((loc) => ({ ...loc, error: error.message }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );

    return () => {
      if (watcherId.current !== null) {
        navigator.geolocation.clearWatch(watcherId.current);
      }
    };
  }, [enabled]);

  return location;
};

export default useGeolocation;
