import React from 'react';
import { useLoans } from '../hooks/Loan/useLoans';
import Spinner from '../components/layout/Spinner';
import LoanList from '../components/loanList/LoanList';
import LoanFilters from '../components/loanFilters/LoanFilters';

const LoansPage = () => {
  const { loans, loading, error, refetch, meta, filters, setFilters } = useLoans();

  const safeLoans = loans || [];
  

  return (
    <div className="pt-20 px-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Empréstimos</h1>
      </div>
      
      {/* Filters */}
      <LoanFilters 
        filters={filters}
        onFiltersChange={setFilters}
      />
      
      {error && <div className="text-red-600 mb-4">Erro: {error}</div>}
      
      {loading || loans === null ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size={60} />
        </div>
      ) : loans.length === 0 ? (
        <div className="text-gray-600">Nenhum empréstimo encontrado.</div>
      ) : (
        <LoanList 
          loans={loans.map(l => ({
            id: l.id,
            bookTitle: l.book,
            userName: l.reader,
            loanDate: l.requestDate,
            expectedReturnDate: l.expectedReturnDate || '',
            returnDate: l.returnDate || '',
            status: l.status,
            isOverdue: false
          }))}
        />
      )}
      <div className="text-sm text-gray-500 mt-4">
        {meta.totalCount !== null && (
          <div>
            <span>Total de empréstimos: {meta.totalCount}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoansPage;
