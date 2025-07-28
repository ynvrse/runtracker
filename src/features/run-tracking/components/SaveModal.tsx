// components/SaveRunModal.tsx
import { useEffect, useState } from 'react';

import { Activity, AlertCircle, MapPin, Route, Save, Timer, X } from 'lucide-react';

import { SaveRunFormData, SaveRunModalProps } from '../../../types/run';

const ACTIVITY_TYPES = [
  { value: 'running', label: 'Running', icon: '🏃‍♂️' },
  { value: 'cycling', label: 'Cycling', icon: '🚴‍♂️' },
  { value: 'walking', label: 'Walking', icon: '🚶‍♂️' },
] as const;

const PRIVACY_OPTIONS = [
  { value: 'private', label: 'Private', description: 'Only you can see this' },
  { value: 'friends', label: 'Friends', description: 'Your friends can see this' },
  { value: 'public', label: 'Public', description: 'Everyone can see this' },
] as const;

export default function SaveRunModal({
  isOpen,
  onClose,
  onSave,
  runStats,
  isLoading = false,
  error = null,
}: SaveRunModalProps) {
  const [formData, setFormData] = useState<SaveRunFormData>({
    title: '',
    description: '',
    activity_type: 'running',
    privacy: 'private',
    tags: [],
  });

  const [errors, setErrors] = useState<Partial<SaveRunFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate default title based on time and location
  useEffect(() => {
    if (isOpen && !formData.title) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      const dateStr = now.toLocaleDateString('en-US', {
        weekday: 'long',
      });

      setFormData((prev: SaveRunFormData) => ({
        ...prev,
        title: `${dateStr} ${formData.activity_type} - ${timeStr}`,
      }));
    }
  }, [isOpen, formData.activity_type]);

  // Format helpers
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(2)} km`;
    }
    return `${meters.toFixed(0)} m`;
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Partial<SaveRunFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await onSave({
        ...formData,
        title: formData.title.trim(),
        description: formData.description?.trim() || undefined,
      });
    } catch (error) {
      console.error('Failed to save run:', error);
      alert('Failed to save run:' + error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange = (
    field: keyof SaveRunFormData,
    value: string | string[],
  ) => {
    setFormData((prev: SaveRunFormData) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev: Partial<SaveRunFormData>) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      style={{ zIndex: 9999 }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Save Your Run</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              disabled={isSubmitting}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Run Preview Stats */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span>Run Summary</span>
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/70 rounded-lg p-3 border border-white/50">
                <div className="flex items-center space-x-2 mb-1">
                  <Timer className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-600">Time</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{formatTime(runStats.duration)}</p>
              </div>

              <div className="bg-white/70 rounded-lg p-3 border border-white/50">
                <div className="flex items-center space-x-2 mb-1">
                  <Route className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-600">Distance</span>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {formatDistance(runStats.distance)}
                </p>
              </div>

              <div className="bg-white/70 rounded-lg p-3 border border-white/50">
                <div className="flex items-center space-x-2 mb-1">
                  <Activity className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-gray-600">Pace</span>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {runStats.pace > 0 ? `${runStats.pace.toFixed(1)} km/h` : '0.0 km/h'}
                </p>
              </div>

              <div className="bg-white/70 rounded-lg p-3 border border-white/50">
                <div className="flex items-center space-x-2 mb-1">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium text-gray-600">Points</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{runStats.points}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-red-800 font-medium">Failed to save run</p>
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Run Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter a name for your run"
                disabled={isSubmitting}
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                  errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                rows={3}
                placeholder="Add notes about your run (optional)"
                disabled={isSubmitting}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {formData.description?.length || 0}/500 characters
              </p>
            </div>

            {/* Activity Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Activity Type</label>
              <div className="grid grid-cols-3 gap-3">
                {ACTIVITY_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleInputChange('activity_type', type.value)}
                    className={`p-3 border rounded-lg text-center transition-all ${
                      formData.activity_type === type.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    disabled={isSubmitting}
                  >
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <div className="text-sm font-medium">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Privacy */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Privacy Setting
              </label>
              <div className="space-y-2">
                {PRIVACY_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-all ${
                      formData.privacy === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="privacy"
                      value={option.value}
                      checked={formData.privacy === option.value}
                      onChange={(e) => handleInputChange('privacy', e.target.value)}
                      className="mt-1 text-blue-600 focus:ring-blue-500"
                      disabled={isSubmitting}
                    />
                    <div>
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-500">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || isLoading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting || isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Run</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
