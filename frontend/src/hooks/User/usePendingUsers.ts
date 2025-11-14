import { useEffect, useState } from 'react';

const API_BASE = (process.env.REACT_APP_API_BASE || (window as any).__API_BASE__)?.replace(/\/+$/, '') || '';

export interface PendingUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role?: string;
  active: boolean;
}

interface PendingUsersApiRawItem {
  Id?: string;
  FirstName?: string;
  LastName?: string;
  Email?: string;
  PhoneNumber?: string;
  Role?: string;
  Active?: boolean;
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  active?: boolean;
}

interface PendingUsersApiResponse {
  users?: PendingUsersApiRawItem[];
  assignableRoles?: string[];
}

export interface PendingUsersFilters {
  filter?: string;
  sortBy?: string;
  descending?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

interface UsePendingUsersResult {
  users: PendingUser[] | null;
  assignableRoles: string[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  setFilters: (filters: PendingUsersFilters) => void;
  filters: PendingUsersFilters;
  approveUser: (userId: string, roleName: string) => Promise<boolean>;
  rejectUser: (userId: string) => Promise<boolean>;
}

function normalizeItem(raw: PendingUsersApiRawItem): PendingUser {
  return {
    id: raw.id ?? raw.Id ?? '',
    firstName: raw.firstName ?? raw.FirstName ?? '',
    lastName: raw.lastName ?? raw.LastName ?? '',
    email: raw.email ?? raw.Email ?? '',
    phoneNumber: raw.phoneNumber ?? raw.PhoneNumber,
    role: raw.role ?? raw.Role,
    active: raw.active ?? raw.Active ?? false
  };
}

export function usePendingUsers(): UsePendingUsersResult {
  const [users, setUsers] = useState<PendingUser[] | null>(null);
  const [assignableRoles, setAssignableRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);
  const [filters, setFiltersState] = useState<PendingUsersFilters>({});

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }
    
    // Build query string from filters
    const params = new URLSearchParams();
    if (filters.filter) params.append('filter', filters.filter);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.descending !== undefined) params.append('descending', filters.descending.toString());
    if (filters.pageNumber) params.append('pageNumber', filters.pageNumber.toString());
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
    
    const queryString = params.toString();
    const url = `${API_BASE}/users/pending${queryString ? `?${queryString}` : ''}`;
    
    fetch(url, { 
      signal: controller.signal,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: PendingUsersApiResponse | any) => {
        const userItems = Array.isArray(data.users) ? data.users : [];
        const processedUsers = userItems.map(normalizeItem);
        
        setUsers(processedUsers);
        setAssignableRoles(data.assignableRoles || []);
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        setError(err.message || 'Failed to load pending users');
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [trigger, filters]);

  const refetch = () => setTrigger(t => t + 1);
  
  const setFilters = (newFilters: PendingUsersFilters) => {
    setFiltersState(newFilters);
  };

  const approveUser = async (userId: string, roleName: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_BASE}/users/${userId}/assign-role`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ roleName })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      refetch();
      return true;
    } catch (err) {
      console.error('Error approving user:', err);
      return false;
    }
  };

  const rejectUser = async (userId: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_BASE}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      refetch();
      return true;
    } catch (err) {
      console.error('Error rejecting user:', err);
      return false;
    }
  };

  return { 
    users, 
    assignableRoles, 
    loading, 
    error, 
    refetch, 
    setFilters, 
    filters, 
    approveUser, 
    rejectUser 
  };
}
