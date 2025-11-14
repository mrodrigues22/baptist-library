import { useEffect, useState } from 'react';
import { Category } from '../../shared/types';
import { publicGet, normalizeToCamelCase } from '../../shared/apiUtils';
import { API_ENDPOINTS } from '../../shared/api/config';

interface UseCategoriesResult {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCategories(): UseCategoriesResult {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    
    publicGet<Category[]>(API_ENDPOINTS.CATEGORIES, controller.signal)
      .then((data: any) => {
        const normalized = normalizeToCamelCase<Category[]>(data);
        const items = Array.isArray(normalized) ? normalized : [];
        setCategories(items);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to load categories');
        }
      })
      .finally(() => setLoading(false));
    
    return () => controller.abort();
  }, [trigger]);

  const refetch = () => setTrigger(t => t + 1);

  return { categories, loading, error, refetch };
}
