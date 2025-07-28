// lib/instantdb.ts
import { init } from '@instantdb/react';

export type Run = any;
export type RunStats = any;

const db = init({
  appId: 'd91bb2b2-beb3-4b7c-85ca-460a61d99770',
});

// Function untuk stringify route data
export function stringifyRouteData(routeData: any): string {
  try {
    if (typeof routeData === 'string') {
      return routeData;
    }

    if (typeof routeData === 'object' && routeData !== null) {
      return JSON.stringify(routeData);
    }

    return String(routeData);
  } catch (error) {
    console.error('Error stringifying route data:', error);
    return '';
  }
}

// Function untuk parse route data
export function parseRouteData(routeDataString: string): any {
  try {
    return JSON.parse(routeDataString);
  } catch (error) {
    console.error('Error parsing route data:', error);
    return null;
  }
}

// Function untuk menghitung stats dari route points
export function calculateRunStats(routePoints: any[]) {
  if (!routePoints || routePoints.length === 0) {
    return {
      maxSpeed: 0,
      avgSpeed: 0,
      totalPoints: 0,
      gpsAccuracyAvg: 0,
    };
  }

  let maxSpeed = 0;
  let totalSpeed = 0;
  let speedCount = 0;
  let totalAccuracy = 0;
  let accuracyCount = 0;

  // Hitung speed antar points
  for (let i = 1; i < routePoints.length; i++) {
    const prev = routePoints[i - 1];
    const curr = routePoints[i];

    if (prev.timestamp && curr.timestamp && prev.lat && prev.lng && curr.lat && curr.lng) {
      // Hitung jarak menggunakan Haversine formula
      const R = 6371000; // Earth's radius in meters
      const dLat = ((curr.lat - prev.lat) * Math.PI) / 180;
      const dLon = ((curr.lng - prev.lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((prev.lat * Math.PI) / 180) *
          Math.cos((curr.lat * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      // Hitung waktu dalam jam
      const timeDiff = (curr.timestamp - prev.timestamp) / 1000 / 3600; // hours

      if (timeDiff > 0) {
        const speed = distance / 1000 / timeDiff; // km/h
        maxSpeed = Math.max(maxSpeed, speed);
        totalSpeed += speed;
        speedCount++;
      }
    }

    // Hitung GPS accuracy
    if (curr.accuracy) {
      totalAccuracy += curr.accuracy;
      accuracyCount++;
    }
  }

  return {
    maxSpeed,
    avgSpeed: speedCount > 0 ? totalSpeed / speedCount : 0,
    totalPoints: routePoints.length,
    gpsAccuracyAvg: accuracyCount > 0 ? totalAccuracy / accuracyCount : 0,
  };
}

// Simple ID generator
export function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export { db };

