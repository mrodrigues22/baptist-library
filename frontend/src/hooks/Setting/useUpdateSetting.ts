import { useState } from 'react';
import { authenticatedPut } from '../../shared/apiUtils';
import { API_ENDPOINTS } from '../../shared/api/config';

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
      await authenticatedPut(API_ENDPOINTS.SETTING_DETAIL(settingId), { value });
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
