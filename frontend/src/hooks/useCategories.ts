import { useEffect, useState } from 'react';

const API_BASE = (process.env.REACT_APP_API_BASE || (window as any).__API_BASE__)?.replace(/\/+$/, '') || '';

export interface Category {
  id: number;
  name: string;
  description?: string;
}

interface CategoryApiRawItem {
  Id?: number;
  Name?: string;
  Description?: string;
  id?: number;
  name?: string;
  description?: string;
}

interface UseCategoriesResult {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function normalizeCategory(raw: CategoryApiRawItem): Category {
  return {
    id: raw.id ?? raw.Id ?? 0,
    name: raw.name ?? raw.Name ?? '',
    description: raw.description ?? raw.Description
  };
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
    
    fetch(`${API_BASE}/categories`, { signal: controller.signal })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: CategoryApiRawItem[] | any) => {
        const items = Array.isArray(data) ? data : [];
        setCategories(items.map(normalizeCategory));
      })
      .catch(err => {
        if (err.name !== 'AbortError') setError(err.message || 'Failed to load categories');
      })
      .finally(() => setLoading(false));
    
    return () => controller.abort();
  }, [trigger]);

  const refetch = () => setTrigger(t => t + 1);

  return { categories, loading, error, refetch };
}
