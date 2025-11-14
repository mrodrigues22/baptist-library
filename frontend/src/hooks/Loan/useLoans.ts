import { useEffect, useState } from 'react';

const API_BASE = (process.env.REACT_APP_API_BASE || (window as any).__API_BASE__)?.replace(/\/+$/, '') || '';

export interface Loan {
  id: number;
  book: string;
  reader: string;
  requestDate: string;
  returnDate?: string;
  expectedReturnDate?: string;
  status: string;
}

interface LoansApiRawItem {
  Id?: number;
  Book?: string;
  Reader?: string;
  RequestDate?: string;
  ReturnDate?: string;
  ExpectedReturnDate?: string;
  Status?: string;
  id?: number;
  book?: string;
  reader?: string;
  requestDate?: string;
  returnDate?: string;
  expectedReturnDate?: string;
  status?: string;
}

interface LoansApiResponse {
  items?: LoansApiRawItem[];
  totalCount?: number;
  pageNumber?: number;
  pageSize?: number;
}

export interface LoansFilters {
  searchTerm?: string;
  status?: number;
  userId?: number;
  sortBy?: string;
  descending?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

interface UseLoansResult {
  loans: Loan[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  setFilters: (filters: LoansFilters) => void;
  filters: LoansFilters;
  meta: {
    totalCount: number | null;
    pageNumber: number | null;
    pageSize: number | null;
  };
}

function normalizeItem(raw: LoansApiRawItem): Loan {
  return {
    id: raw.id ?? raw.Id ?? 0,
    book: raw.book ?? raw.Book ?? '',
    reader: raw.reader ?? raw.Reader ?? '',
    requestDate: raw.requestDate ?? raw.RequestDate ?? '',
    returnDate: raw.returnDate ?? raw.ReturnDate,
    expectedReturnDate: raw.expectedReturnDate ?? raw.ExpectedReturnDate,
    status: raw.status ?? raw.Status ?? ''
  };
}

export function useLoans(): UseLoansResult {
  const [loans, setLoans] = useState<Loan[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);
  const [filters, setFiltersState] = useState<LoansFilters>({});
  const [meta, setMeta] = useState({
    totalCount: null as number | null,
    pageNumber: null as number | null,
    pageSize: null as number | null
  });

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    
    // Build query string from filters
    const params = new URLSearchParams();
    if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
    if (filters.status !== undefined) params.append('status', filters.status.toString());
    if (filters.userId) params.append('userId', filters.userId.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.descending !== undefined) params.append('descending', filters.descending.toString());
    if (filters.pageNumber) params.append('pageNumber', filters.pageNumber.toString());
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
    
    const queryString = params.toString();
    const url = `${API_BASE}/loans${queryString ? `?${queryString}` : ''}`;
    
    // Get auth token from localStorage
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    fetch(url, { 
      signal: controller.signal,
      headers 
    })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: LoansApiResponse | LoansApiRawItem[] | any) => {
        if (Array.isArray(data)) {
          // Unexpected array root; normalize directly
          setLoans(data.map(normalizeItem));
          setMeta({ totalCount: null, pageNumber: null, pageSize: null });
          return;
        }
        const items = Array.isArray(data.items) ? data.items : [];
        setLoans(items.map(normalizeItem));
        setMeta({
          totalCount: data.totalCount ?? null,
          pageNumber: data.pageNumber ?? null,
          pageSize: data.pageSize ?? null
        });
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        setError(err.message || 'Failed to load loans');
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [trigger, filters]);

  const refetch = () => setTrigger(t => t + 1);
  
  const setFilters = (newFilters: LoansFilters) => {
    setFiltersState(newFilters);
  };

  return { loans, loading, error, refetch, setFilters, filters, meta };
}
