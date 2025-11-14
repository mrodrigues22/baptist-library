import { useState } from 'react';
import { authenticatedPatch } from '../../shared/apiUtils';
import { API_ENDPOINTS } from '../../shared/api/config';

interface UseCheckoutLoanResult {
  checkoutLoan: (loanId: number) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function useCheckoutLoan(): UseCheckoutLoanResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkoutLoan = async (loanId: number) => {
    setLoading(true);
    setError(null);

    try {
      await authenticatedPatch(API_ENDPOINTS.LOAN_CHECKOUT(loanId), {});
    } catch (err: any) {
      setError(err.message || 'Failed to checkout loan');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { checkoutLoan, loading, error };
}
