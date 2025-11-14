import { useState } from 'react';

const API_BASE = (process.env.REACT_APP_API_BASE || (window as any).__API_BASE__)?.replace(/\/+$/, '') || '';

interface UseReturnLoanResult {
  returnLoan: (loanId: number) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function useReturnLoan(): UseReturnLoanResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const returnLoan = async (loanId: number) => {
    setLoading(true);
    setError(null);

    const url = `${API_BASE}/loans/return/${loanId}`;
    
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      await response.json();
    } catch (err: any) {
      setError(err.message || 'Failed to return loan');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { returnLoan, loading, error };
}
