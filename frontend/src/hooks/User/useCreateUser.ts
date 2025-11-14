import { useState } from 'react';

const API_BASE = (process.env.REACT_APP_API_BASE || (window as any).__API_BASE__)?.replace(/\/+$/, '') || '';

export interface CreateUserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  roleName: string;
}

interface UseCreateUserResult {
  createUser: (formData: CreateUserFormData) => Promise<any>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export function useCreateUser(): UseCreateUserResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createUser = async (formData: CreateUserFormData) => {
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Você precisa estar autenticado para criar um usuário.');
      }

      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        throw new Error('As senhas não coincidem.');
      }

      // Validate password length
      if (formData.password.length < 8) {
        throw new Error('A senha deve ter no mínimo 8 caracteres.');
      }

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber || null,
        password: formData.password,
        roleName: formData.roleName || null
      };

      const response = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Erro HTTP ${response.status}`);
      }

      const createdUser = await response.json();
      setSuccess(true);
      return createdUser;

    } catch (err: any) {
      setError(err.message || 'Erro ao criar o usuário.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createUser, loading, error, success };
}
