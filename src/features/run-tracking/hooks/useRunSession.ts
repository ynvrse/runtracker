// hooks/useRunSession.ts
import { useCallback, useEffect, useRef } from 'react';

const SESSION_KEY = 'runTracker_session';
const SAVE_INTERVAL = 10; // Save every 10 points
const BACKUP_TIMER = 30000; // Backup every 30 seconds

// Types
interface RoutePoint {
  lat: number;
  lng: number;
  timestamp: number;
  accuracy?: number | null;
}

interface RunState {
  isRecording: boolean;
  isPaused: boolean;
  startTime: number | null;
  pausedDuration: number;
}

interface RunData {
  route: RoutePoint[];
  distance: number;
  duration: number;
  pointCount: number;
}

interface SessionMetadata {
  sessionId: string;
  lastSaved: number;
  version: number;
}

interface RunSession {
  run_state: RunState;
  run_data: RunData;
  metadata: SessionMetadata;
}

interface RunStateUpdate {
  isRecording?: boolean;
  isPaused?: boolean;
  startTime?: number | null;
  pausedDuration?: number;
}

interface RunStatsUpdate {
  distance?: number;
  duration?: number;
  pointCount?: number;
}

// Update interface untuk parameter updateSession
interface SessionUpdate {
  run_state?: Partial<RunState>;
  run_data?: Partial<RunData>;
}

interface UseRunSessionReturn {
  // Session management
  loadSession: () => RunSession | null;
  createNewSession: () => RunSession;
  getCurrentSession: () => RunSession | null;
  clearSession: () => void;

  // Tracking controls
  startTracking: () => RunSession;
  pauseTracking: () => RunSession | null;
  resumeTracking: () => RunSession | null;
  stopTracking: () => RunSession | null;

  // Data updates
  addRoutePoint: (point: Omit<RoutePoint, 'timestamp'> & { timestamp?: number }) => RunSession;
  updateRunStats: (stats: RunStatsUpdate) => RunSession;
  updateRunState: (state: RunStateUpdate) => RunSession;
}

export default function useRunSession(): UseRunSessionReturn {
  const pointCountRef = useRef<number>(0);
  const backupTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load session data from sessionStorage
  const loadSession = useCallback((): RunSession | null => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) {
        const parsed: RunSession = JSON.parse(saved);
        // Validate data structure
        if (parsed.metadata?.version === 1) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Error loading session:', error);
    }
    return null;
  }, []);

  // Save session data to sessionStorage
  const saveSession = useCallback((sessionData: RunSession): void => {
    try {
      const dataToSave: RunSession = {
        ...sessionData,
        metadata: {
          ...sessionData.metadata,
          lastSaved: Date.now(),
          version: 1,
        },
      };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(dataToSave));
      console.log('Session saved:', {
        points: sessionData.run_data.pointCount,
        distance: sessionData.run_data.distance,
        duration: sessionData.run_data.duration,
        timestamp: new Date().toLocaleTimeString(),
      });
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }, []);

  // Create new session
  const createNewSession = useCallback((): RunSession => {
    const sessionId = `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      run_state: {
        isRecording: false,
        isPaused: false,
        startTime: null,
        pausedDuration: 0,
      },
      run_data: {
        route: [],
        distance: 0,
        duration: 0,
        pointCount: 0,
      },
      metadata: {
        sessionId,
        lastSaved: Date.now(),
        version: 1,
      },
    };
  }, []);

  // Update session with new data - Fixed types
  const updateSession = useCallback(
    (updates: SessionUpdate): RunSession => {
      const currentSession = loadSession() || createNewSession();

      // Merge updates properly with explicit typing
      const updatedSession: RunSession = {
        run_state: {
          ...currentSession.run_state,
          ...(updates.run_state || {}),
        },
        run_data: {
          ...currentSession.run_data,
          ...(updates.run_data || {}),
        },
        metadata: {
          ...currentSession.metadata,
          lastSaved: Date.now(),
        },
      };

      // Check if we need to save based on point count
      const newPointCount = updatedSession.run_data.pointCount;
      const shouldSave =
        newPointCount > 0 &&
        (newPointCount % SAVE_INTERVAL === 0 || newPointCount !== pointCountRef.current);

      if (shouldSave) {
        saveSession(updatedSession);
        pointCountRef.current = newPointCount;
      }

      return updatedSession;
    },
    [loadSession, createNewSession, saveSession],
  );

  // Add new route point
  const addRoutePoint = useCallback(
    (point: Omit<RoutePoint, 'timestamp'> & { timestamp?: number }): RunSession => {
      const currentSession = loadSession();
      const currentRoute = currentSession?.run_data.route || [];

      const newPoint: RoutePoint = {
        lat: point.lat,
        lng: point.lng,
        timestamp: point.timestamp || Date.now(),
        accuracy: point.accuracy,
      };

      const session = updateSession({
        run_data: {
          route: [...currentRoute, newPoint],
          pointCount: (currentSession?.run_data.pointCount || 0) + 1,
          distance: currentSession?.run_data.distance || 0,
          duration: currentSession?.run_data.duration || 0,
        },
      });
      return session;
    },
    [updateSession, loadSession],
  );

  // Update run state (recording, paused, etc.)
  const updateRunState = useCallback(
    (stateUpdates: RunStateUpdate): RunSession => {
      const session = updateSession({
        run_state: stateUpdates,
      });
      // Always save state changes immediately
      saveSession(session);
      return session;
    },
    [updateSession, saveSession],
  );

  // Update run stats (distance, duration)
  const updateRunStats = useCallback(
    (statsUpdates: RunStatsUpdate): RunSession => {
      const currentSession = loadSession();
      const session = updateSession({
        run_data: {
          route: currentSession?.run_data.route || [],
          pointCount: currentSession?.run_data.pointCount || 0,
          distance: statsUpdates.distance ?? currentSession?.run_data.distance ?? 0,
          duration: statsUpdates.duration ?? currentSession?.run_data.duration ?? 0,
        },
      });
      return session;
    },
    [updateSession, loadSession],
  );

  // Start tracking
  const startTracking = useCallback((): RunSession => {
    const startTime = Date.now();

    // Clear existing session and create new one
    const newSession = createNewSession();
    const session = updateSession({
      run_state: {
        isRecording: true,
        isPaused: false,
        startTime,
        pausedDuration: 0,
      },
    });

    // Start backup timer
    if (backupTimerRef.current) {
      clearInterval(backupTimerRef.current);
    }
    backupTimerRef.current = setInterval(() => {
      const currentSession = loadSession();
      if (currentSession?.run_state.isRecording) {
        saveSession(currentSession);
      }
    }, BACKUP_TIMER);

    return session;
  }, [updateSession, createNewSession, loadSession, saveSession]);

  // Pause tracking
  const pauseTracking = useCallback((): RunSession | null => {
    const currentSession = loadSession();
    if (!currentSession || !currentSession.run_state.startTime) return null;

    const pausedDuration =
      currentSession.run_state.pausedDuration +
      (Date.now() - currentSession.run_state.startTime) / 1000;

    return updateRunState({
      isRecording: false,
      isPaused: true,
      pausedDuration,
    });
  }, [loadSession, updateRunState]);

  // Resume tracking
  const resumeTracking = useCallback((): RunSession | null => {
    const currentSession = loadSession();
    if (!currentSession) return null;

    const newStartTime = Date.now() - currentSession.run_state.pausedDuration * 1000;

    return updateRunState({
      isRecording: true,
      isPaused: false,
      startTime: newStartTime,
    });
  }, [loadSession, updateRunState]);

  // Stop tracking
  const stopTracking = useCallback((): RunSession | null => {
    const currentSession = loadSession();
    if (!currentSession) return null;

    // Clear backup timer
    if (backupTimerRef.current) {
      clearInterval(backupTimerRef.current);
      backupTimerRef.current = null;
    }

    const finalSession = updateRunState({
      isRecording: false,
      isPaused: false,
    });

    // Save final state
    saveSession(finalSession);
    return finalSession;
  }, [loadSession, updateRunState, saveSession]);

  // Clear session
  const clearSession = useCallback((): void => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
      pointCountRef.current = 0;

      if (backupTimerRef.current) {
        clearInterval(backupTimerRef.current);
        backupTimerRef.current = null;
      }

      console.log('Session cleared');
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  }, []);

  // Get current session
  const getCurrentSession = useCallback((): RunSession | null => {
    return loadSession();
  }, [loadSession]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (backupTimerRef.current) {
        clearInterval(backupTimerRef.current);
      }
    };
  }, []);

  return {
    // Session management
    loadSession,
    createNewSession,
    getCurrentSession,
    clearSession,

    // Tracking controls
    startTracking,
    pauseTracking,
    resumeTracking,
    stopTracking,

    // Data updates
    addRoutePoint,
    updateRunStats,
    updateRunState,
  };
}

// Export types for use in other components
export type { RoutePoint, RunState, RunData, SessionMetadata, RunSession };
