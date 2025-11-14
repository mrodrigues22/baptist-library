import { useEffect, useState } from 'react';

const API_BASE = (process.env.REACT_APP_API_BASE || (window as any).__API_BASE__)?.replace(/\/+$/, '') || '';

export interface UserDetail {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  roles: string[];
  active: boolean;
  totalLoans: number;
  activeLoans: number;
}

interface UserDetailApiRawItem {
  Id?: string;
  FirstName?: string;
  LastName?: string;
  Email?: string;
  PhoneNumber?: string;
  Roles?: string[];
  Active?: boolean;
  TotalLoans?: number;
  ActiveLoans?: number;
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  roles?: string[];
  active?: boolean;
  totalLoans?: number;
  activeLoans?: number;
}

interface UseUserDetailResult {
  user: UserDetail | null;
  assignableRoles: string[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const normalizeUserDetail = (raw: UserDetailApiRawItem): UserDetail => {
  return {
    id: raw.Id || raw.id || '',
    firstName: raw.FirstName || raw.firstName || '',
    lastName: raw.LastName || raw.lastName || '',
    email: raw.Email || raw.email || '',
    phoneNumber: raw.PhoneNumber || raw.phoneNumber,
    roles: raw.Roles || raw.roles || [],
    active: raw.Active !== undefined ? raw.Active : (raw.active !== undefined ? raw.active : false),
    totalLoans: raw.TotalLoans !== undefined ? raw.TotalLoans : (raw.totalLoans || 0),
    activeLoans: raw.ActiveLoans !== undefined ? raw.ActiveLoans : (raw.activeLoans || 0),
  };
};

export const useUserDetail = (userId: string): UseUserDetailResult => {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [assignableRoles, setAssignableRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserDetail = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Usuário não autenticado');
      }

      const url = `${API_BASE}/users/${userId}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 404) {
          throw new Error(`Usuário não encontrado (ID: ${userId})`);
        }
        if (response.status === 401) {
          throw new Error('Não autorizado');
        }
        if (response.status === 403) {
          throw new Error('Acesso negado');
        }
        throw new Error(errorData.message || `Erro ao carregar usuário: ${response.status}`);
      }

      const data = await response.json();
      const normalizedUser = normalizeUserDetail(data.user || data);
      setUser(normalizedUser);
      setAssignableRoles(data.assignableRoles || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar usuário';
      setError(errorMessage);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetail();
  }, [userId]);

  return {
    user,
    assignableRoles,
    loading,
    error,
    refetch: fetchUserDetail,
  };
};
