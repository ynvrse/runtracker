// hooks/useRunSave.ts
import { useCallback } from 'react';

import { db } from '../../../lib/instantDB';
import { type RunSession } from './useRunSession';

interface SaveRunData {
  title: string;
  description?: string;
  activity_type: 'running' | 'cycling' | 'walking';
  privacy: 'public' | 'friends' | 'private';
}

interface SaveRunResult {
  success: boolean;
  runId?: string;
  error?: string;
}

export default function useRunSave() {
  // Calculate additional stats
  const calculateRunStats = useCallback((session: RunSession) => {
    const { route, distance, duration } = session.run_data;

    if (route.length < 2) {
      return {
        max_speed: 0,
        avg_speed: 0,
        total_points: route.length,
        gps_accuracy_avg: 0,
      };
    }

    // Calculate speeds between points
    const speeds: number[] = [];
    const accuracies: number[] = [];

    for (let i = 1; i < route.length; i++) {
      const prev = route[i - 1];
      const curr = route[i];

      // Calculate distance between points
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
      const pointDistance = R * c;

      // Calculate time difference
      const timeDiff = (curr.timestamp - prev.timestamp) / 1000; // seconds

      if (timeDiff > 0) {
        const speed = (pointDistance / timeDiff) * 3.6; // km/h
        speeds.push(speed);
      }

      if (curr.accuracy) {
        accuracies.push(curr.accuracy);
      }
    }

    const max_speed = speeds.length > 0 ? Math.max(...speeds) : 0;
    const avg_speed = duration > 0 ? distance / 1000 / (duration / 3600) : 0;
    const gps_accuracy_avg =
      accuracies.length > 0 ? accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length : 0;

    return {
      max_speed,
      avg_speed,
      total_points: route.length,
      gps_accuracy_avg,
    };
  }, []);

  // Estimate calories (very basic estimation)
  const estimateCalories = useCallback(
    (distance: number, duration: number, userWeight = 70): number => {
      // Basic formula: MET * weight * time
      // Running MET values: ~8-12 depending on pace
      const avgPace = duration > 0 ? distance / 1000 / (duration / 3600) : 0; // km/h
      let met = 8; // default

      if (avgPace > 12) met = 12;
      else if (avgPace > 10) met = 10;
      else if (avgPace > 8) met = 9;
      else if (avgPace > 6) met = 8;

      return Math.round(met * userWeight * (duration / 3600));
    },
    [],
  );

  // Save run to InstantDB
  const saveRun = useCallback(
    async (session: RunSession, saveData: SaveRunData, userId: string): Promise<SaveRunResult> => {
      try {
        const runId = `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const now = Date.now();

        // Calculate additional stats
        const runStats = calculateRunStats(session);
        const calories = estimateCalories(session.run_data.distance, session.run_data.duration);

        // Prepare run data
        const runData = {
          user_id: userId,
          title: saveData.title,
          description: saveData.description || '',
          activity_type: saveData.activity_type,
          route_data: JSON.stringify(session.run_data.route),
          distance: session.run_data.distance,
          duration: session.run_data.duration,
          avg_pace:
            session.run_data.duration > 0
              ? session.run_data.distance / 1000 / (session.run_data.duration / 3600)
              : 0,
          calories,
          privacy: saveData.privacy,
          created_at: now,
          started_at: session.run_state.startTime || now,
          ended_at: now,
        };

        // Prepare run stats data
        const runStatsData = {
          run_id: runId,
          ...runStats,
        };

        // Save to InstantDB
        await db.transact([
          db.tx.runs[runId].update(runData),
          db.tx.run_stats[`stats_${runId}`].update(runStatsData),
        ]);

        console.log('Run saved successfully:', { runId, ...runData });

        return {
          success: true,
          runId,
        };
      } catch (error) {
        console.error('Error saving run:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
      }
    },
    [calculateRunStats, estimateCalories],
  );

  return {
    saveRun,
    calculateRunStats,
    estimateCalories,
  };
}
