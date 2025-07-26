import { useState } from 'react';

import { Pause, Play, RotateCcw, Save, Square } from 'lucide-react';

import { Button } from '@/components/ui/button';

import useGeolocation from '../hooks/useGeolocation';

interface RunControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onReset?: () => void;
  onSave?: () => void;
  hasRoute?: boolean;
  isPaused?: boolean;
}

export default function RunControls({
  isRunning,
  onStart,
  onStop,
  onPause,
  onResume,
  onReset,
  onSave,
  hasRoute = false,
  isPaused = false,
}: RunControlsProps) {
  const [showConfirmStop, setShowConfirmStop] = useState(false);
  const location = useGeolocation({ enabled: isRunning });

  const handleStopClick = () => {
    if (hasRoute && !showConfirmStop) {
      setShowConfirmStop(true);
      // Auto hide confirmation after 3 seconds
      setTimeout(() => setShowConfirmStop(false), 3000);
    } else {
      onStop();
      setShowConfirmStop(false);
    }
  };

  const handleConfirmStop = () => {
    onStop();
    setShowConfirmStop(false);
  };

  return (
    <div className="space-y-4">
      {/* Main Controls */}
      <div className="flex justify-center items-center gap-3">
        {!isRunning && !isPaused ? (
          // Start State
          <div className="flex items-center gap-3">
            <Button
              onClick={onStart}
              size="lg"
              className="h-14 px-8 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 rounded-2xl"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Run
            </Button>

            {hasRoute && onReset && (
              <Button
                onClick={onReset}
                variant="outline"
                size="lg"
                className="h-14 px-6 border-2 hover:bg-gray-50 rounded-2xl transition-all duration-200"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </Button>
            )}
          </div>
        ) : (
          // Running/Paused State
          <div className="flex items-center gap-3">
            {/* Pause/Resume Button */}
            {!isPaused ? (
              <Button
                onClick={onPause}
                variant="secondary"
                size="lg"
                className="h-14 px-6 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-2 border-yellow-300 rounded-2xl transition-all duration-200 hover:scale-105"
              >
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </Button>
            ) : (
              <Button
                onClick={onResume}
                size="lg"
                className="h-14 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl transition-all duration-200 hover:scale-105"
              >
                <Play className="w-5 h-5 mr-2" />
                Resume
              </Button>
            )}

            {/* Stop Button */}
            <Button
              onClick={handleStopClick}
              variant="destructive"
              size="lg"
              className={`h-14 px-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-2xl transition-all duration-200 hover:scale-105 ${
                showConfirmStop ? 'ring-4 ring-red-300 animate-pulse' : ''
              }`}
            >
              <Square className="w-5 h-5 mr-2" />
              {showConfirmStop ? 'Confirm Stop' : 'Stop'}
            </Button>
          </div>
        )}
      </div>

      {/* Confirmation Message */}
      {showConfirmStop && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center animate-in slide-in-from-top duration-300">
          <p className="text-red-800 font-medium mb-3">
            Are you sure you want to stop? Your progress will be saved.
          </p>
          <div className="flex justify-center gap-2">
            <Button
              onClick={handleConfirmStop}
              variant="destructive"
              size="sm"
              className="px-4 text-red-800 border border-red-200 rounded-xl"
            >
              Yes, Stop
            </Button>
            <Button
              onClick={() => setShowConfirmStop(false)}
              variant="secondary"
              size="sm"
              className="px-4 border  rounded-xl"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Secondary Actions */}
      {!isRunning && hasRoute && (
        // <div className="flex justify-center">
        //   <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-gray-200 shadow-sm">
        //     <div className="flex items-center gap-3">
        //       <div className="text-sm text-gray-600 font-medium">
        //         Run completed! What would you like to do?
        //       </div>

        <div className="flex gap-2">
          {onSave && (
            <Button
              onClick={onSave}
              variant="outline"
              size="sm"
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 hover:border-blue-300 rounded-lg transition-all duration-200"
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
          )}

          {onReset && (
            <Button
              onClick={onReset}
              variant="outline"
              size="sm"
              className="rounded-lg transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              New Run
            </Button>
          )}
        </div>

        //     </div>
        //   </div>
        // </div>
      )}

      {/* Status Indicator */}
      <div className="flex justify-between mb-3 ">
        <div className="flex items-start gap-3 rounded-lg bg-gray-50 px-4 py-2 shadow-sm">
          {/* Status dot */}
          <div
            className={`mt-1 h-3 w-3 rounded-full ${
              isRunning
                ? 'bg-green-500 animate-pulse'
                : isPaused
                  ? 'bg-yellow-500 animate-pulse'
                  : 'bg-gray-400'
            }`}
          />

          <div className="text-sm text-gray-700 space-y-0.5">
            <p className="font-semibold">
              {isRunning
                ? 'Recording your run...'
                : isPaused
                  ? 'Run paused'
                  : hasRoute
                    ? 'Run completed'
                    : 'Ready to start'}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-lg bg-gray-50 px-4 py-2 shadow-sm">
          {/* Status text & accuracy */}
          <div className="text-sm text-gray-700 space-y-0.5">
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <strong>Accuracy:</strong>
              <span>{location.accuracy ? `${location.accuracy.toFixed(0)}m` : 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
