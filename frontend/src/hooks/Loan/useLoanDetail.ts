import { useEffect, useState } from 'react';
import AuthService from '../../services/AuthService';

const API_BASE = (process.env.REACT_APP_API_BASE || (window as any).__API_BASE__)?.replace(/\/+$/, '') || '';

export interface LoanDetail {
  id: number;
  bookId: number;
  bookTitle: string;
  requesterUserId: string;
  requester: string;
  statusId: number;
  statusName: string;
  requestDate: string;
  checkoutDate?: string;
  returnDate?: string;
  expectedReturnDate?: string;
  checkedOutBy?: string;
  receivedBy?: string;
}

interface LoanDetailApiRaw {
  Id?: number;
  BookId?: number;
  BookTitle?: string;
  RequesterUserId?: string;
  Requester?: string;
  StatusId?: number;
  StatusName?: string;
  RequestDate?: string;
  CheckoutDate?: string;
  ReturnDate?: string;
  ExpectedReturnDate?: string;
  CheckedOutBy?: string;
  ReceivedBy?: string;
  id?: number;
  bookId?: number;
  bookTitle?: string;
  requesterUserId?: string;
  requester?: string;
  statusId?: number;
  statusName?: string;
  requestDate?: string;
  checkoutDate?: string;
  returnDate?: string;
  expectedReturnDate?: string;
  checkedOutBy?: string;
  receivedBy?: string;
}

interface UseLoanDetailResult {
  loan: LoanDetail | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function normalizeLoanDetail(raw: LoanDetailApiRaw): LoanDetail {
  return {
    id: raw.id ?? raw.Id ?? 0,
    bookId: raw.bookId ?? raw.BookId ?? 0,
    bookTitle: raw.bookTitle ?? raw.BookTitle ?? '',
    requesterUserId: raw.requesterUserId ?? raw.RequesterUserId ?? '',
    requester: raw.requester ?? raw.Requester ?? '',
    statusId: raw.statusId ?? raw.StatusId ?? 0,
    statusName: raw.statusName ?? raw.StatusName ?? '',
    requestDate: raw.requestDate ?? raw.RequestDate ?? '',
    checkoutDate: raw.checkoutDate ?? raw.CheckoutDate,
    returnDate: raw.returnDate ?? raw.ReturnDate,
    expectedReturnDate: raw.expectedReturnDate ?? raw.ExpectedReturnDate,
    checkedOutBy: raw.checkedOutBy ?? raw.CheckedOutBy,
    receivedBy: raw.receivedBy ?? raw.ReceivedBy
  };
}

export function useLoanDetail(loanId: number | string): UseLoanDetailResult {
  const [loan, setLoan] = useState<LoanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const url = `${API_BASE}/loans/${loanId}`;
    
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
      .then((data: LoanDetailApiRaw) => {
        setLoan(normalizeLoanDetail(data));
      })
      .catch(err => {
        if (err.name !== 'AbortError') setError(err.message || 'Failed to load loan details');
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [loanId, trigger]);

  const refetch = () => setTrigger(t => t + 1);

  return { loan, loading, error, refetch };
}
