import { useState } from 'react';

const API_BASE = (process.env.REACT_APP_API_BASE || (window as any).__API_BASE__)?.replace(/\/+$/, '') || '';

export interface UpdateUserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string; // masked or empty
  password?: string; // optional new password
}

interface UseUpdateUserResult {
  updateUser: (userId: string, data: UpdateUserFormData) => Promise<any>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export function useUpdateUser(): UseUpdateUserResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateUser = async (userId: string, data: UpdateUserFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Você precisa estar autenticado.');

      const payload: any = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber || null
      };

      if (data.password && data.password.trim()) {
        const trimmed = data.password.trim();
        if (trimmed.length < 8) {
          throw new Error('A senha deve ter no mínimo 8 caracteres.');
        }
        payload.password = trimmed;
      }

      const res = await fetch(`${API_BASE}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Erro HTTP ${res.status}`);
      }

      const updated = await res.json();
      setSuccess(true);
      return updated;
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar usuário.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading, error, success };
}
