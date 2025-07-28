// hooks/useRunCrud.js
import { useState } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { db, stringifyRouteData } from '../../../lib/instantDB';

// Definisikan tipe untuk titik rute
type RoutePoint = {
  lat: number;
  lng: number;
  timestamp?: number;
  accuracy?: number;
  speed?: number;
};

export const useRunCrud = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveRun = async (runData: any, userId: string | null | undefined) => {
    setLoading(true);
    setError(null);

    try {
      const runId = uuidv4();
      const statsId = uuidv4();

      // Calculate average pace (km/h)
      const avgPace =
        runData.duration > 0 ? runData.distance / 1000 / (runData.duration / 3600) : 0;

      // Convert route to string format for database
      const routeString = stringifyRouteData(runData.route);

      // Estimate calories
      const calories = Math.round((runData.distance / 1000) * 70 * 0.75);

      // Normalisasi route
      const routePoints: RoutePoint[] = runData.route || [];
      const routeWithTimestamp = routePoints.map((point: RoutePoint, index: number) => ({
        ...point,
        timestamp: point.timestamp || runData.started_at + index * 1000,
      }));

      // Ambil statistik dari sessionData
      const gpsAccuracies = routeWithTimestamp.map((p: RoutePoint) => p.accuracy || 0);
      const gps_accuracy_avg =
        gpsAccuracies.reduce((a: number, b: number) => a + b, 0) / gpsAccuracies.length || 0;

      const speeds = routeWithTimestamp.map((p: RoutePoint) => p.speed || 0);
      const max_speed = Math.max(...speeds);
      const avg_speed = speeds.reduce((a: number, b: number) => a + b, 0) / speeds.length || 0;
      const total_points = routeWithTimestamp.length;

      // Save to InstantDB
      await db.transact([
        db.tx.runs[runId].update({
          user_id: userId,
          title: runData.title,
          description: runData.description || '',
          activity_type: runData.activity_type || 'running',
          route_data: routeString,
          distance: runData.distance,
          duration: runData.duration,
          avg_pace: avgPace,
          elevation_gain: runData.elevation_gain || 0,
          calories: calories,
          weather: runData.weather ? JSON.stringify(runData.weather) : null,
          privacy: runData.privacy || 'private',
          created_at: Date.now(),
          started_at: runData.started_at,
          ended_at: runData.ended_at || Date.now(),
        }),
        db.tx.run_stats[statsId].update({
          run_id: runId,
          avg_speed: avg_speed,
          gps_accuracy_avg: gps_accuracy_avg,
          max_speed: max_speed,
          total_points: total_points,
        }),
      ]);

      return { success: true, runId };
    } catch (err: any) {
      console.error('Error saving to InstantDB:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    saveRun,
    loading,
    error,
  };
};
