import { useState } from 'react';

const API_BASE = (process.env.REACT_APP_API_BASE || (window as any).__API_BASE__)?.replace(/\/+$/, '') || '';

interface UseAssignRoleResult {
  assignRole: (userId: string, roleName: string) => Promise<any>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export function useAssignRole(): UseAssignRoleResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const assignRole = async (userId: string, roleName: string) => {
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Você precisa estar autenticado.');
      }

      const response = await fetch(`${API_BASE}/users/${userId}/assign-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ roleName })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Erro HTTP ${response.status}`);
      }

      const result = await response.json();
      setSuccess(true);
      return result;

    } catch (err: any) {
      setError(err.message || 'Erro ao atribuir perfil.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { assignRole, loading, error, success };
}
