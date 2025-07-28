// types/run.ts
export interface SaveRunFormData {
  title: string;
  description?: string;
  activity_type: 'running' | 'cycling' | 'walking';
  privacy: 'public' | 'friends' | 'private';
  tags?: string[];
}

export interface SaveRunModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: SaveRunFormData) => Promise<void>;
  runStats: {
    distance: number;
    duration: number;
    pace: number;
    points: number;
  };
  route: Array<{ lat: number; lng: number }>;
  isLoading?: boolean;
  error?: string | null;
}
