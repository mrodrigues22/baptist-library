import { useState } from 'react';
import { authenticatedDelete } from '../../shared/apiUtils';
import { API_ENDPOINTS } from '../../shared/api/config';

interface UseDeleteBookResult {
  deleteBook: (bookId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function useDeleteBook(): UseDeleteBookResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteBook = async (bookId: string) => {
    setError(null);
    setLoading(true);

    try {
      await authenticatedDelete(API_ENDPOINTS.BOOK_DETAIL(parseInt(bookId)));

    } catch (err: any) {
      setError(err.message || 'Erro ao deletar o livro.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteBook, loading, error };
}
