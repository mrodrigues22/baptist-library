import { useEffect, useState } from 'react';

const API_BASE = (process.env.REACT_APP_API_BASE || (window as any).__API_BASE__)?.replace(/\/+$/, '') || '';

export interface Setting {
  id: number;
  setting: string;
  value: number;
}

interface SettingsApiRawItem {
  Id?: number;
  Setting?: string;
  Value?: number;
  id?: number;
  setting?: string;
  value?: number;
}

interface UseSettingsResult {
  settings: Setting[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function normalizeItem(raw: SettingsApiRawItem): Setting {
  return {
    id: raw.id ?? raw.Id ?? 0,
    setting: raw.setting ?? raw.Setting ?? '',
    value: raw.value ?? raw.Value ?? 0
  };
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
    
    const url = `${API_BASE}/settings`;
    
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    fetch(url, { 
      signal: controller.signal,
      headers
    })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: SettingsApiRawItem[] | any) => {
        if (Array.isArray(data)) {
          setSettings(data.map(normalizeItem));
        } else {
          setSettings([]);
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') setError(err.message || 'Failed to load settings');
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [trigger]);

  const refetch = () => setTrigger(t => t + 1);

  return { settings, loading, error, refetch };
}
