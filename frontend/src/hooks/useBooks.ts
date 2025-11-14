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

export interface BooksFilters {
  searchTerm?: string;
  categoryId?: number;
  sortBy?: string;
  descending?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

interface UseBooksResult {
  books: Book[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  setFilters: (filters: BooksFilters) => void;
  filters: BooksFilters;
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
    publicationYear: raw.publicationYear ?? raw.PublicationYear,
    edition: raw.edition ?? raw.Edition,
    availableCopies: raw.availableCopies ?? raw.AvailableCopies ?? 0,
    quantity: raw.quantity ?? raw.Quantity ?? 0,
    borrowedByCurrentUser: raw.borrowedByCurrentUser ?? raw.BorrowedByCurrentUser ?? false
  };
}

export function useBooks(): UseBooksResult {
  const [books, setBooks] = useState<Book[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);
  const [filters, setFiltersState] = useState<BooksFilters>({});
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
    
    // Build query string from filters
    const params = new URLSearchParams();
    if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
    if (filters.categoryId) params.append('categoryId', filters.categoryId.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.descending !== undefined) params.append('descending', filters.descending.toString());
    if (filters.pageNumber) params.append('pageNumber', filters.pageNumber.toString());
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
    
    const queryString = params.toString();
    const url = `${API_BASE}/books${queryString ? `?${queryString}` : ''}`;
    
    fetch(url, { signal: controller.signal })
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
  }, [trigger, filters]);

  const refetch = () => setTrigger(t => t + 1);
  
  const setFilters = (newFilters: BooksFilters) => {
    setFiltersState(newFilters);
  };

  return { books, loading, error, refetch, setFilters, filters, meta };
}
