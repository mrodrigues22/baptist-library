import { useState } from 'react';
import { authenticatedPatch } from '../../shared/apiUtils';
import { API_ENDPOINTS } from '../../shared/api/config';

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

    try {
      await authenticatedPatch(API_ENDPOINTS.LOAN_RETURN(loanId), {});
    } catch (err: any) {
      setError(err.message || 'Failed to return loan');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { returnLoan, loading, error };
}
