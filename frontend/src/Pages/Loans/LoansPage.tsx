import React from 'react';
import { useLoans } from '../../hooks/Loan/useLoans';
import Spinner from '../../components/layout/Spinner';
import LoanList from '../../components/loanList/LoanList';
import LoanFilters from '../../components/loanFilters/LoanFilters';
import Pagination from '../../components/pagination/Pagination';
import { useAuth } from '../../context/AuthContext';

const LoansPage = () => {
  const { user } = useAuth();
  const { loans, loading, error, refetch, meta, filters, setFilters } = useLoans();

  // Check if user has any roles
  if (!user || !user.roles || user.roles.length === 0) {
    return (
      <div className="pt-20 px-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <h2 className="text-xl font-bold mb-2">Acesso negado</h2>
          <p>Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

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
      
      {/* Pagination */}
      {meta.totalCount !== null && meta.pageNumber !== null && meta.pageSize !== null && (
        <Pagination
          currentPage={meta.pageNumber}
          totalCount={meta.totalCount}
          pageSize={meta.pageSize}
          onPageChange={(page) => setFilters({ ...filters, pageNumber: page })}
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
