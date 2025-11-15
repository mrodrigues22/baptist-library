import { useState, useEffect } from 'react';
import { logError } from '../../shared/utils/logger';

const API_BASE = (process.env.REACT_APP_API_BASE || (window as any).__API_BASE__)?.replace(/\/+$/, '') || '';

interface UseAssignableRolesResult {
  roles: string[];
  loading: boolean;
  error: string | null;
}

export function useAssignableRoles(): UseAssignableRolesResult {
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAssignableRoles = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Você precisa estar autenticado.');
        }

        // Fetch from pending users endpoint which includes assignableRoles
        const response = await fetch(`${API_BASE}/users/pending`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Erro HTTP ${response.status}`);
        }

        const data = await response.json();
        setRoles(data.assignableRoles || []);
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        setError(err.message || 'Erro ao carregar funções disponíveis.');
        logError('Error fetching assignable roles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignableRoles();

    return () => controller.abort();
  }, []);

  return { roles, loading, error };
}
