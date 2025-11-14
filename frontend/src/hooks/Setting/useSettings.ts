import { useEffect, useState } from 'react';
import { Setting } from '../../shared/types';
import { authenticatedGet, normalizeToCamelCase } from '../../shared/apiUtils';
import { API_ENDPOINTS } from '../../shared/api/config';

interface UseSettingsResult {
  settings: Setting[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useSettings(): UseSettingsResult {
  const [settings, setSettings] = useState<Setting[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    
    authenticatedGet<Setting[]>(API_ENDPOINTS.SETTINGS, controller.signal)
      .then((data: any) => {
        const normalized = normalizeToCamelCase<Setting[]>(data);
        if (Array.isArray(normalized)) {
          setSettings(normalized);
        } else {
          setSettings([]);
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to load settings');
        }
      })
      .finally(() => setLoading(false));
    
    return () => controller.abort();
  }, [trigger]);

  const refetch = () => setTrigger(t => t + 1);

  return { settings, loading, error, refetch };
}
