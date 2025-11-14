import { useState } from 'react';
import { authenticatedPost } from '../../shared/apiUtils';

interface UseBorrowForSelfResult {
  borrowBook: (bookId: number) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useBorrowForSelf = (): UseBorrowForSelfResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const borrowBook = async (bookId: number) => {
    setLoading(true);
    setError(null);

    try {
      await authenticatedPost('/loans/borrow', {
        bookId: bookId,
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao solicitar empréstimo';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { borrowBook, loading, error };
};
