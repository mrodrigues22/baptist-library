import React from 'react';
import { useBooks } from '../hooks/useBooks';
import { useCategories } from '../hooks/useCategories';
import Spinner from '../components/layout/Spinner';
import BookList from '../components/bookList/bookList';
import BookFilters from '../components/bookFilters/BookFilters';


const BooksPage = () => {
  const { books, loading, error, refetch, meta, filters, setFilters } = useBooks();
  const { categories, loading: categoriesLoading } = useCategories();

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
      
      {/* Filters */}
      {!categoriesLoading && (
        <BookFilters 
          filters={filters}
          onFiltersChange={setFilters}
          categories={categories}
        />
      )}
      
      {error && <div className="text-red-600 mb-4">Erro: {error}</div>}
      
      {loading || books === null ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size={60} />
        </div>
      ) : books.length === 0 ? (
        <div className="text-gray-600">Nenhum livro encontrado.</div>
      ) : (
        <BookList 
          books={books.map(b => ({
            id: b.id,
            title: b.title,
            authors: b.authors && b.authors.length ? b.authors : ['Autor desconhecido'],
            publisher: b.publisher,
            edition: b.edition || 1,
            quantity: b.quantity,
            copiesAvailable: b.availableCopies,
            borrowedByUser: b.borrowedByCurrentUser
          }))}
        />
      )}
    </div>
  );
};

export default BooksPage;
