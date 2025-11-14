import React from 'react';

interface Props {
  id: number;
  bookTitle: string;
  userName: string;
  loanDate: string;
  dueDate: string;
  returnDate?: string;
  status: string;
  isOverdue: boolean;
}

const LoanSummary = ({ id, bookTitle, userName, loanDate, dueDate, returnDate, status, isOverdue }: Props) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getStatusBadge = () => {
    const statusLower = status.toLowerCase();
    
    // Map actual database status values to badge styles
    // 1: Aguardando retirada, 2: Aguardando devolução, 3: Devolvido, 4: Cancelado, 5: Atrasado
    if (statusLower.includes('devolvido')) {
      return <span className="px-3 py-1 text-sm font-semibold bg-green-100 text-green-800 rounded">{status}</span>;
    }
    if (statusLower.includes('atrasado')) {
      return <span className="px-3 py-1 text-sm font-semibold bg-red-100 text-red-800 rounded">{status}</span>;
    }
    if (statusLower.includes('aguardando devolução')) {
      return <span className="px-3 py-1 text-sm font-semibold bg-blue-100 text-blue-800 rounded">{status}</span>;
    }
    if (statusLower.includes('aguardando retirada')) {
      return <span className="px-3 py-1 text-sm font-semibold bg-yellow-100 text-yellow-800 rounded">{status}</span>;
    }
    if (statusLower.includes('cancelado')) {
      return <span className="px-3 py-1 text-sm font-semibold bg-gray-100 text-gray-800 rounded">{status}</span>;
    }
    
    // Default badge
    return <span className="px-3 py-1 text-sm font-semibold bg-gray-100 text-gray-800 rounded">{status}</span>;
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200 relative">
      <div className="absolute top-4 right-4">
        {getStatusBadge()}
      </div>
      
      <h3 className="text-xl font-bold text-gray-800 mb-0 pr-32">
        {bookTitle}
      </h3>
      
      <p className="text-gray-700 text-base mb-1">
        {userName}
      </p>
      
      <div className="flex gap-4 text-sm text-gray-600 mt-3">
        {loanDate && (
          <div>
            <span className="font-medium">Solicitado em:</span> {formatDate(loanDate)}
          </div>
        )}
        {dueDate && (
          <div>
            <span className="font-medium">Prazo:</span> {formatDate(dueDate)}
          </div>
        )}
        {returnDate && (
          <div>
            <span className="font-medium">Devolvido em:</span> {formatDate(returnDate)}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanSummary;
