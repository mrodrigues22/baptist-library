import React from 'react';
import { useBooks } from '../hooks/useBooks';
import Spinner from '../components/layout/Spinner';

const BooksPage = () => {
  const { books, loading, error, refetch, meta } = useBooks();

  const safeBooks = books || [];
  
  console.log('BooksPage render:', { loading, booksLength: safeBooks.length, error });

  return (
    <div className="pt-20 px-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Acervo</h1>
      </div>
      <div className="text-sm text-gray-500 mb-4">
        {meta.totalTitles !== null && meta.totalCopies !== null && (
          <span>
            Títulos: {meta.totalTitles} • Exemplares: {meta.totalCopies}
          </span>
        )}
      </div>
      {error && <div className="text-red-600 mb-4">Erro: {error}</div>}
      
      {loading || books === null ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size={60} />
        </div>
      ) : books.length === 0 ? (
        <div className="text-gray-600">Nenhum livro encontrado.</div>
      ) : (
        <ul className="space-y-2">
          {books.map(b => (
            <li
              key={b.id}
              className="border rounded p-3 flex flex-col gap-1"
            >
              <span className="font-medium">{b.title}</span>
              <span className="text-xs text-gray-600">
                {b.authors && b.authors.length ? b.authors.join(', ') : 'Autor desconhecido'}
              </span>
              <span className="text-xs text-gray-500">Editora: {b.publisher}</span>
              <span className="text-xs text-gray-500">Disponíveis: {b.availableCopies} / Total: {b.quantity}</span>
              {b.borrowedByCurrentUser && (
                <span className="text-xs text-emerald-600">Reservado por você</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BooksPage;
