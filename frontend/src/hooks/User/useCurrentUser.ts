import { useEffect, useState } from 'react';
import { logError } from '../../shared/utils/logger';

const API_BASE = (process.env.REACT_APP_API_BASE || (window as any).__API_BASE__)?.replace(/\/+$/, '') || '';

export interface CurrentUser {
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

interface CurrentUserApiRawItem {
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

interface UseCurrentUserResult {
  user: CurrentUser | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const normalizeCurrentUser = (raw: CurrentUserApiRawItem): CurrentUser => {
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

const getUserIdFromToken = (): string | null => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    
    // JWT standard 'sub' claim contains the user ID
    return decoded.sub || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || null;
  } catch (error) {
    logError('Error parsing JWT:', error);
    return null;
  }
};

export const useCurrentUser = (): UseCurrentUserResult => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Usuário não autenticado');
        }

        const userId = getUserIdFromToken();
        if (!userId) {
          throw new Error('Não foi possível identificar o usuário');
        }

        const url = `${API_BASE}/users/${userId}`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          
          if (response.status === 404) {
            throw new Error('Usuário não encontrado');
          }
          if (response.status === 401) {
            throw new Error('Não autorizado');
          }
          if (response.status === 403) {
            throw new Error('Acesso negado');
          }
          throw new Error(errorData.message || `Erro ao carregar dados do usuário: ${response.status}`);
        }

        const data = await response.json();
        const normalizedUser = normalizeCurrentUser(data.user || data);
        setUser(normalizedUser);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar dados do usuário';
        setError(errorMessage);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
    
    return () => controller.abort();
  }, [trigger]);

  const refetch = () => setTrigger(t => t + 1);

  return {
    user,
    loading,
    error,
    refetch,
  };
};
