import { useEffect, useState } from 'react';

const API_BASE = (process.env.REACT_APP_API_BASE || (window as any).__API_BASE__)?.replace(/\/+$/, '') || '';

export interface UserLoan {
  id: number;
  bookTitle: string;
  bookId: number;
  requestDate: string;
  checkoutDate?: string;
  expectedReturnDate?: string;
  returnDate?: string;
  status: string;
  statusId: number;
  isOverdue: boolean;
}

interface UserLoanApiRawItem {
  Id?: number;
  Book?: string;
  Reader?: string;
  RequestDate?: string;
  ExpectedReturnDate?: string;
  ReturnDate?: string;
  Status?: string;
  id?: number;
  book?: string;
  reader?: string;
  requestDate?: string;
  expectedReturnDate?: string;
  returnDate?: string;
  status?: string;
}

interface UserLoansApiResponse {
  items?: UserLoanApiRawItem[];
  totalCount?: number;
  pageNumber?: number;
  pageSize?: number;
}

interface UseUserLoansResult {
  loans: UserLoan[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function normalizeItem(raw: UserLoanApiRawItem): UserLoan {
  return {
    id: raw.id ?? raw.Id ?? 0,
    bookTitle: raw.book ?? raw.Book ?? '',
    bookId: 0,
    requestDate: raw.requestDate ?? raw.RequestDate ?? '',
    checkoutDate: undefined,
    expectedReturnDate: raw.expectedReturnDate ?? raw.ExpectedReturnDate,
    returnDate: raw.returnDate ?? raw.ReturnDate,
    status: raw.status ?? raw.Status ?? '',
    statusId: 0,
    isOverdue: false,
  };
}

export function useUserLoans(userId: string): UseUserLoansResult {
  const [loans, setLoans] = useState<UserLoan[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setLoans([]);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);
    
    // Build query string with userId filter
    const params = new URLSearchParams();
    params.append('userId', userId);
    params.append('pageSize', '100'); // Get more loans for user history
    params.append('sortBy', 'requestDate');
    params.append('descending', 'true');
    
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
      .then((data: UserLoansApiResponse | UserLoanApiRawItem[] | any) => {
        if (Array.isArray(data)) {
          // Unexpected array root; normalize directly
          setLoans(data.map(normalizeItem));
          return;
        }
        const items = Array.isArray(data.items) ? data.items : [];
        setLoans(items.map(normalizeItem));
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to load user loans');
        }
      })
      .finally(() => setLoading(false));
      
    return () => controller.abort();
  }, [userId, trigger]);

  const refetch = () => setTrigger(t => t + 1);

  return { loans, loading, error, refetch };
}
