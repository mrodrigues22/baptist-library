import { useEffect, useState } from 'react';

const API_BASE = (process.env.REACT_APP_API_BASE || (window as any).__API_BASE__)?.replace(/\/+$/, '') || '';

export interface CurrentUserLoan {
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

interface CurrentUserLoanApiRawItem {
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

interface CurrentUserLoansApiResponse {
  items?: CurrentUserLoanApiRawItem[];
  totalCount?: number;
  pageNumber?: number;
  pageSize?: number;
}

interface UseCurrentUserLoansResult {
  loans: CurrentUserLoan[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function normalizeItem(raw: CurrentUserLoanApiRawItem): CurrentUserLoan {
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
    console.error('Error parsing JWT:', error);
    return null;
  }
};

export function useCurrentUserLoans(): UseCurrentUserLoansResult {
  const [loans, setLoans] = useState<CurrentUserLoan[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLoans = async () => {
    const userId = getUserIdFromToken();
    
    if (!userId) {
      setLoading(false);
      setError('Não foi possível identificar o usuário');
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
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Erro ao carregar empréstimos: ${response.status}`);
        }
        return response.json();
      })
      .then((data: CurrentUserLoansApiResponse) => {
        const items = data.items || [];
        const normalized = items.map(normalizeItem);
        setLoans(normalized);
        setError(null);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Erro desconhecido ao carregar empréstimos');
        setLoans([]);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => controller.abort();
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  return {
    loans,
    loading,
    error,
    refetch: fetchLoans,
  };
}
