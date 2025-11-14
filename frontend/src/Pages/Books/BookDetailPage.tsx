import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBookDetail } from '../../hooks/Book/useBookDetail';
import Spinner from '../../components/layout/Spinner';
import LoanBookModal from '../../components/LoanBookModal';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import { useAuth } from '../../context/AuthContext';
import { useBorrowForSelf } from '../../hooks/Loan/useBorrowForSelf';
import { useDeleteBook } from '../../hooks/Book/useDeleteBook';

const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { book, loading, error, refetch } = useBookDetail(id || '');
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { hasRole } = useAuth();
  const { borrowBook, loading: borrowing } = useBorrowForSelf();
  const { deleteBook, loading: deleting } = useDeleteBook();
  
  const canLoanBooks = hasRole(['Administrador', 'Bibliotecário', 'Desenvolvedor']);

  const handleBorrowForSelf = async () => {
    try {
      await borrowBook(parseInt(id || '0'));
      refetch();
    } catch (err) {
      console.error('Error borrowing book:', err);
    }
  };

  const handleDeleteBook = async () => {
    try {
      await deleteBook(id || '');
      setIsDeleteModalOpen(false);
      navigate('/books');
    } catch (err) {
      console.error('Error deleting book:', err);
    }
  };

  const getTooltipMessage = () => {
    if (book?.borrowedByCurrentUser) {
      return 'Você já possui este livro emprestado';
    }
    if (book?.availableCopies === 0) {
      return 'Não há exemplares disponíveis no momento';
    }
    return '';
  };

  const isBorrowDisabled = book?.borrowedByCurrentUser || book?.availableCopies === 0;

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
          onClick={() => navigate('/books')}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Voltar para o acervo
        </button>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="pt-20 px-6">
        <div className="text-gray-600 mb-4">Livro não encontrado.</div>
        <button
          onClick={() => navigate('/books')}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Voltar para o acervo
        </button>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="pt-20 px-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/books')}
        className="text-blue-600 hover:text-secondary font-medium mb-6 flex items-center"
      >
        ← Voltar para o acervo
      </button>

      {/* Main card */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 max-w-5xl">
        {/* Header section */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {book.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-gray-600 mt-3">
                <span className="text-lg">
                  {book.edition}ª edição
                </span>
                {book.publicationYear && (
                  <span className="text-lg">• {book.publicationYear}</span>
                )}
                {book.volume && (
                  <span className="text-lg">• Volume {book.volume}</span>
                )}
              </div>
            </div>
            {canLoanBooks && (
              <div className="ml-4 flex gap-2">
                <button
                  onClick={() => navigate(`/books/${id}/edit`)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200 flex items-center gap-2"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Editar
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors duration-200 flex items-center gap-2"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Deletar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Authors */}
        {book.authors.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Autor(es)
            </h2>
            <div className="flex flex-wrap gap-2">
              {book.authors.map((author, index) => (
                <button
                  key={index}
                  onClick={() => navigate(`/books?search=${encodeURIComponent(author)}`)}
                  className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  {author}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Publisher */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Editora
          </h2>
          <p className="text-gray-700">{book.publisher}</p>
        </div>

        {/* Categories */}
        {book.categories.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Categoria(s)
            </h2>
            <div className="flex flex-wrap gap-2">
              {book.categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => navigate(`/books?category=${encodeURIComponent(category)}`)}
                  className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm hover:bg-green-100 transition-colors cursor-pointer"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {book.tags.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Palavras-chave
            </h2>
            <div className="flex flex-wrap gap-2">
              {book.tags.map((tag, index) => (
                <button
                  key={index}
                  onClick={() => navigate(`/books?search=${encodeURIComponent(tag)}`)}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Availability section */}
        <div className="mb-6 bg-gray-50 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Disponibilidade
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-gray-600 font-medium">Total de exemplares:</span>
              <span className="ml-2 text-gray-900 font-semibold">{book.quantity}</span>
            </div>
            <div>
              <span className="text-gray-600 font-medium">Disponíveis:</span>
              <span className={`ml-2 font-semibold ${book.availableCopies > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {book.availableCopies}
              </span>
            </div>
          </div>
          {book.borrowedByCurrentUser && (
            <div className="mt-3 bg-blue-50 text-blue-700 px-4 py-2 rounded">
              Você já possui este livro emprestado
            </div>
          )}
          
          {/* Action buttons */}
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            {/* Borrow for self button */}
            <div className="relative group flex-1">
              <button
                onClick={handleBorrowForSelf}
                disabled={isBorrowDisabled || borrowing}
                className={`w-full px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  isBorrowDisabled || borrowing
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                {borrowing ? 'Solicitando...' : 'Pegar emprestado'}
              </button>
              {isBorrowDisabled && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  {getTooltipMessage()}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                    <div className="border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Loan to another user button - Only visible for Administrador, Bibliotecario, and Developer */}
            {canLoanBooks && (
              <div className="relative group flex-1">
                <button
                  onClick={() => setIsLoanModalOpen(true)}
                  disabled={book.availableCopies === 0}
                  className={`w-full px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    book.availableCopies === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                  </svg>
                  Emprestar para um leitor
                </button>
                {book.availableCopies === 0 && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    Não há exemplares disponíveis no momento
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                      <div className="border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Technical details */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {book.isbn && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-1">ISBN</h3>
              <p className="text-gray-800">{book.isbn}</p>
            </div>
          )}
          {book.cdd && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-1">CDD</h3>
              <p className="text-gray-800">{book.cdd}</p>
            </div>
          )}
          {book.libraryLocation && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-1">Localização</h3>
              <p className="text-gray-800">{book.libraryLocation}</p>
            </div>
          )}
          {book.origin && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-1">Origem</h3>
              <p className="text-gray-800">{book.origin}</p>
            </div>
          )}
        </div>

        {/* Loans section */}
        {book.loans && book.loans.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Empréstimos
            </h2>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Leitor
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data de Retirada
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {book.loans.slice().reverse().map((loan) => (
                    <tr 
                      key={loan.id} 
                      onClick={() => navigate(`/loans/${loan.id}`)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {loan.reader}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {loan.checkoutDate ? formatDate(loan.checkoutDate) : 'Pendente'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          loan.status === 'Aguardando devolução' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : loan.status === 'Aguardando retirada'
                            ? 'bg-blue-100 text-blue-800'
                            : loan.status === 'Atrasado'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {loan.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="pt-6 border-t border-gray-200 text-sm text-gray-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {book.createdByUser && (
              <div>
                Cadastrado por {book.createdByUser} em {formatDate(book.createdDate)}
              </div>
            )}
            {book.modifiedByUser && book.modifiedDate && (
              <div>
                Modificado por {book.modifiedByUser} em {formatDate(book.modifiedDate)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loan Modal */}
      <LoanBookModal
        isOpen={isLoanModalOpen}
        onClose={() => setIsLoanModalOpen(false)}
        bookId={book.id}
        bookTitle={book.title}
        onSuccess={() => {
          refetch();
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteBook}
        title="Confirmar exclusão"
        message={`Tem certeza que deseja deletar o livro "${book.title}"? Esta ação não pode ser desfeita.`}
        loading={deleting}
      />
    </div>
  );
};

export default BookDetailPage;
