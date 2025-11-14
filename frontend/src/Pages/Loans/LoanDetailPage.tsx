import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLoanDetail } from '../../hooks/Loan/useLoanDetail';
import Spinner from '../../components/layout/Spinner';
import { useAuth } from '../../context/AuthContext';

const LoanDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { loan, loading, error, refetch } = useLoanDetail(id || '');
  const { hasRole } = useAuth();
  
  const canManageLoans = hasRole(['Administrador', 'Bibliotecário', 'Desenvolvedor']);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size={60} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 px-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          Erro: {error}
        </div>
        <button
          onClick={() => navigate('/loans')}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Voltar para empréstimos
        </button>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="pt-20 px-6">
        <div className="text-gray-600 mb-4">Empréstimo não encontrado.</div>
        <button
          onClick={() => navigate('/loans')}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Voltar para empréstimos
        </button>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const formatDateShort = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = () => {
    const statusName = loan.statusName.toLowerCase();
    
    if (statusName.includes('devolvido')) {
      return (
        <span className="px-4 py-2 text-base font-semibold bg-green-100 text-green-800 rounded-lg">
          {loan.statusName}
        </span>
      );
    }
    if (statusName.includes('atrasado')) {
      return (
        <span className="px-4 py-2 text-base font-semibold bg-red-100 text-red-800 rounded-lg">
          {loan.statusName}
        </span>
      );
    }
    if (statusName.includes('aguardando devolução')) {
      return (
        <span className="px-4 py-2 text-base font-semibold bg-blue-100 text-blue-800 rounded-lg">
          {loan.statusName}
        </span>
      );
    }
    if (statusName.includes('aguardando retirada')) {
      return (
        <span className="px-4 py-2 text-base font-semibold bg-yellow-100 text-yellow-800 rounded-lg">
          {loan.statusName}
        </span>
      );
    }
    if (statusName.includes('cancelado')) {
      return (
        <span className="px-4 py-2 text-base font-semibold bg-gray-100 text-gray-800 rounded-lg">
          {loan.statusName}
        </span>
      );
    }
    
    return (
      <span className="px-4 py-2 text-base font-semibold bg-gray-100 text-gray-800 rounded-lg">
        {loan.statusName}
      </span>
    );
  };

  return (
    <div className="pt-20 px-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/loans')}
        className="text-blue-600 hover:text-secondary font-medium mb-6 flex items-center"
      >
        ← Voltar para empréstimos
      </button>

      {/* Main card */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 max-w-5xl">
        {/* Header section */}
        <div className="mb-6 pb-6 border-b border-gray-200 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Detalhes do Empréstimo
            </h1>
            <p className="text-gray-600">ID: #{loan.id}</p>
          </div>
          <div>
            {getStatusBadge()}
          </div>
        </div>

        {/* Book Information */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Livro
          </h2>
          <button
            onClick={() => navigate(`/books/${loan.bookId}`)}
            className="text-blue-600 hover:text-blue-800 text-lg font-medium hover:underline"
          >
            {loan.bookTitle}
          </button>
        </div>

        {/* Requester Information */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Solicitante
          </h2>
          <p className="text-gray-700 text-lg">{loan.requester}</p>
        </div>

        {/* Timeline */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Cronologia
          </h2>
          <div className="space-y-4">
            {/* Request Date */}
            <div className="flex items-start">
              <div className="flex-shrink-0 w-32 font-medium text-gray-600">
                Solicitado:
              </div>
              <div className="text-gray-900">
                {formatDate(loan.requestDate)}
              </div>
            </div>

            {/* Expected Return Date */}
            {loan.expectedReturnDate && (
              <div className="flex items-start">
                <div className="flex-shrink-0 w-32 font-medium text-gray-600">
                  Prazo:
                </div>
                <div className="text-gray-900">
                  {formatDateShort(loan.expectedReturnDate)}
                </div>
              </div>
            )}

            {/* Checkout Date */}
            {loan.checkoutDate && (
              <div className="flex items-start">
                <div className="flex-shrink-0 w-32 font-medium text-gray-600">
                  Retirado:
                </div>
                <div className="text-gray-900">
                  {formatDate(loan.checkoutDate)}
                  {loan.checkedOutBy && (
                    <span className="text-gray-600 ml-2">por {loan.checkedOutBy}</span>
                  )}
                </div>
              </div>
            )}

            {/* Return Date */}
            {loan.returnDate && (
              <div className="flex items-start">
                <div className="flex-shrink-0 w-32 font-medium text-gray-600">
                  Devolvido:
                </div>
                <div className="text-gray-900">
                  {formatDate(loan.returnDate)}
                  {loan.receivedBy && (
                    <span className="text-gray-600 ml-2">por {loan.receivedBy}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons (if user has permission) */}
        {canManageLoans && (
          <div className="flex gap-4">
            {loan.statusId === 1 && (
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors font-medium"
                onClick={() => {
                  // TODO: Implement checkout functionality
                  console.log('Checkout loan', loan.id);
                }}
              >
                Confirmar Retirada
              </button>
            )}
            {loan.statusId === 2 && (
              <button
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors font-medium"
                onClick={() => {
                  // TODO: Implement return functionality
                  console.log('Return loan', loan.id);
                }}
              >
                Confirmar Devolução
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanDetailPage;
