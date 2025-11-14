import { useState, useEffect } from 'react';
import { authenticatedGet } from '../../shared/apiUtils';
import { logError } from '../../shared/utils/logger';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role?: string;
  active: boolean;
}

export const useUserSearch = (searchTerm: string, enabled: boolean = true) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !searchTerm || searchTerm.length === 0) {
      setUsers([]);
      return;
    }

    const controller = new AbortController();
    const debounceTimer = setTimeout(() => {
      fetchUsers(searchTerm, controller.signal);
    }, 300);

    return () => {
      clearTimeout(debounceTimer);
      controller.abort();
    };
  }, [searchTerm, enabled]);

  const fetchUsers = async (search: string, signal: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authenticatedGet(`/users?pageSize=100&filter=${encodeURIComponent(search)}`, signal);
      if (response.users) {
        // Filter only active users
        const activeUsers = response.users.filter((u: User) => u.active);
        setUsers(activeUsers);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setError('Erro ao carregar usuários');
      logError('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  return { users, loading, error };
};
