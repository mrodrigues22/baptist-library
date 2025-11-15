import { useState } from 'react';
import { authenticatedPost } from '../../shared/apiUtils';

interface CreateLoanData {
  bookId: number;
  requesterUserId: string;
}

interface UseCreateLoanResult {
  createLoan: (data: CreateLoanData) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useCreateLoan = (): UseCreateLoanResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createLoan = async (data: CreateLoanData) => {
    setLoading(true);
    setError(null);

    try {
      await authenticatedPost('/loans', {
        bookId: data.bookId,
        requesterUserId: data.requesterUserId,
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar empréstimo';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { createLoan, loading, error };
};
