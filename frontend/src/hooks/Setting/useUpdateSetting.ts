import { useState } from 'react';

const API_BASE = (process.env.REACT_APP_API_BASE || (window as any).__API_BASE__)?.replace(/\/+$/, '') || '';

interface UseUpdateSettingResult {
  updateSetting: (settingId: number, value: number) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function useUpdateSetting(): UseUpdateSettingResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSetting = async (settingId: number, value: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE}/settings/${settingId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ value })
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar configuração');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar configuração';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { updateSetting, loading, error };
}
