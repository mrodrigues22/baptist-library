import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBookDetail } from '../hooks/useBookDetail';
import Spinner from '../components/layout/Spinner';

const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { book, loading, error } = useBookDetail(id || '');

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
        className="text-blue-600 hover:text-blue-800 font-medium mb-6 flex items-center"
      >
        ← Voltar para o acervo
      </button>

      {/* Main card */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 max-w-5xl">
        {/* Header section */}
        <div className="mb-6 pb-6 border-b border-gray-200">
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
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm"
                >
                  {tag}
                </span>
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
    </div>
  );
};

export default BookDetailPage;
