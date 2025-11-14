import { useEffect, useState } from 'react';
import { BookDetail } from '../../shared/types';
import { publicGet, getToken, normalizeToCamelCase } from '../../shared/apiUtils';
import { API_ENDPOINTS } from '../../shared/api/config';

interface UseBookDetailResult {
  book: BookDetail | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useBookDetail(bookId: number | string): UseBookDetailResult {
  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const endpoint = API_ENDPOINTS.BOOK_DETAIL(typeof bookId === 'string' ? parseInt(bookId) : bookId);
    
    // Use publicGet if no token (public view), otherwise still use publicGet as the API handles auth
    publicGet<BookDetail>(endpoint, controller.signal)
      .then((data: any) => {
        // Normalize response from PascalCase to camelCase
        const normalized = normalizeToCamelCase<BookDetail>(data);
        setBook(normalized);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          if (err.status === 404) {
            setError('Livro não encontrado');
          } else {
            setError(err.message || 'Falha ao carregar detalhes do livro');
          }
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [bookId, trigger]);

  const refetch = () => setTrigger(t => t + 1);

  return { book, loading, error, refetch };
}
