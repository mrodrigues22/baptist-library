import { useEffect, useState } from 'react';
import { Book, BooksFilters } from '../../shared/types';
import { publicGet, getToken, normalizeToCamelCase } from '../../shared/apiUtils';

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
    const endpoint = `/books${queryString ? `?${queryString}` : ''}`;
    
    // Use publicGet if no token, otherwise use authenticated version
    const fetchFunc = getToken() ? publicGet : publicGet;
    
    fetchFunc(endpoint, controller.signal)
      .then((data: any) => {
        // Normalize response from PascalCase to camelCase
        const normalized = normalizeToCamelCase(data);
        
        if (Array.isArray(normalized)) {
          setBooks(normalized);
          setMeta({ totalTitles: null, totalCopies: null, pageNumber: null, pageSize: null });
          return;
        }
        
        const items = Array.isArray(normalized.items) ? normalized.items : [];
        setBooks(items);
        setMeta({
          totalTitles: normalized.totalTitles ?? null,
          totalCopies: normalized.totalCopies ?? null,
          pageNumber: normalized.pageNumber ?? null,
          pageSize: normalized.pageSize ?? null
        });
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to load books');
        }
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
