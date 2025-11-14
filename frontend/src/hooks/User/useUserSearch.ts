import { useState, useEffect } from 'react';
import { authenticatedGet } from '../../shared/apiUtils';

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

    const debounceTimer = setTimeout(() => {
      fetchUsers(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, enabled]);

  const fetchUsers = async (search: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authenticatedGet(`/users?pageSize=100&filter=${encodeURIComponent(search)}`);
      if (response.users) {
        // Filter only active users
        const activeUsers = response.users.filter((u: User) => u.active);
        setUsers(activeUsers);
      }
    } catch (err) {
      setError('Erro ao carregar usuários');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  return { users, loading, error };
};
