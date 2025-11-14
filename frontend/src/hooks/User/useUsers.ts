import { useEffect, useState } from 'react';

const API_BASE = (process.env.REACT_APP_API_BASE || (window as any).__API_BASE__)?.replace(/\/+$/, '') || '';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role?: string;
  active: boolean;
}

interface UsersApiRawItem {
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

interface UsersApiResponse {
  users?: UsersApiRawItem[];
  hasPendingUsers?: boolean;
}

export interface UsersFilters {
  filter?: string;
  sortBy?: string;
  descending?: boolean;
  pageNumber?: number;
  pageSize?: number;
  roleFilter?: string;
}

interface UseUsersResult {
  users: User[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  setFilters: (filters: UsersFilters) => void;
  filters: UsersFilters;
  hasPendingUsers: boolean;
}

function normalizeItem(raw: UsersApiRawItem): User {
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

export function useUsers(): UseUsersResult {
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);
  const [filters, setFiltersState] = useState<UsersFilters>({});
  const [hasPendingUsers, setHasPendingUsers] = useState(false);

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
    const url = `${API_BASE}/users${queryString ? `?${queryString}` : ''}`;
    
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
      .then((data: UsersApiResponse | any) => {
        const userItems = Array.isArray(data.users) ? data.users : [];
        let processedUsers = userItems.map(normalizeItem);
        
        // Apply role filter on client side if needed
        if (filters.roleFilter && filters.roleFilter !== 'all') {
          processedUsers = processedUsers.filter((u: User) => u.role === filters.roleFilter);
        }
        
        setUsers(processedUsers);
        setHasPendingUsers(data.hasPendingUsers ?? false);
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        setError(err.message || 'Failed to load users');
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [trigger, filters]);

  const refetch = () => setTrigger(t => t + 1);
  
  const setFilters = (newFilters: UsersFilters) => {
    setFiltersState(newFilters);
  };

  return { users, loading, error, refetch, setFilters, filters, hasPendingUsers };
}
