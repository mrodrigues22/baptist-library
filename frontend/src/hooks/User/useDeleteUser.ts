import { useState } from 'react';

const API_BASE = (process.env.REACT_APP_API_BASE || (window as any).__API_BASE__)?.replace(/\/+$/, '') || '';

interface UseDeleteUserResult {
  deleteUser: (userId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export function useDeleteUser(): UseDeleteUserResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const deleteUser = async (userId: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Você precisa estar autenticado.');

      const res = await fetch(`${API_BASE}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Erro HTTP ${res.status}`);
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar usuário.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteUser, loading, error, success };
}
