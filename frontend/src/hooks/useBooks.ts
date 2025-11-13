import { useEffect, useState } from 'react';

const API_BASE = (process.env.REACT_APP_API_BASE || (window as any).__API_BASE__)?.replace(/\/+$/, '') || '';

export interface Book {
  id: number;
  title: string;
  authors: string[];
  publisher: string;
  publicationYear?: number;
  edition?: number;
  quantity: number;
  availableCopies: number;
  borrowedByCurrentUser: boolean;
}

interface BooksApiRawItem {
  Id?: number;
  Title?: string;
  Authors?: string[];
  Publisher?: string;
  PublicationYear?: number;
  Edition?: number;
  AvailableCopies?: number;
  Quantity?: number;
  BorrowedByCurrentUser?: boolean;
  id?: number;
  title?: string;
  authors?: string[];
  publisher?: string;
  publicationYear?: number;
  edition?: number;
  availableCopies?: number;
  quantity?: number;
  borrowedByCurrentUser?: boolean;
}

interface BooksApiResponse {
  items?: BooksApiRawItem[];
  totalTitles?: number;
  totalCopies?: number;
  pageNumber?: number;
  pageSize?: number;
}

interface UseBooksResult {
  books: Book[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  meta: {
    totalTitles: number | null;
    totalCopies: number | null;
    pageNumber: number | null;
    pageSize: number | null;
  };
}

function normalizeItem(raw: BooksApiRawItem): Book {
  return {
    id: raw.id ?? raw.Id ?? 0,
    title: raw.title ?? raw.Title ?? '',
    authors: raw.authors ?? raw.Authors ?? [],
    publisher: raw.publisher ?? raw.Publisher ?? '',
    availableCopies: raw.availableCopies ?? raw.AvailableCopies ?? 0,
    quantity: raw.quantity ?? raw.Quantity ?? 0,
    borrowedByCurrentUser: raw.borrowedByCurrentUser ?? raw.BorrowedByCurrentUser ?? false
  };
}

export function useBooks(): UseBooksResult {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);
  const [meta, setMeta] = useState({
    totalTitles: null as number | null,
    totalCopies: null as number | null,
    pageNumber: null as number | null,
    pageSize: null as number | null
  });

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/books`, { signal: controller.signal })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: BooksApiResponse | BooksApiRawItem[] | any) => {
        if (Array.isArray(data)) {
          // Unexpected array root; normalize directly
            setBooks(data.map(normalizeItem));
            setMeta({ totalTitles: null, totalCopies: null, pageNumber: null, pageSize: null });
            return;
        }
        const items = Array.isArray(data.items) ? data.items : [];
        setBooks(items.map(normalizeItem));
        setMeta({
          totalTitles: data.totalTitles ?? null,
          totalCopies: data.totalCopies ?? null,
          pageNumber: data.pageNumber ?? null,
          pageSize: data.pageSize ?? null
        });
      })
      .catch(err => {
        if (err.name !== 'AbortError') setError(err.message || 'Failed to load books');
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [trigger]);

  const refetch = () => setTrigger(t => t + 1);

  return { books, loading, error, refetch, meta };
}
