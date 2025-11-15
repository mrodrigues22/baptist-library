import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useBooks } from '../../hooks/Book/useBooks';
import { useCategories } from '../../hooks/Category/useCategories';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/layout/Spinner';
import BookList from '../../components/bookList/bookList';
import BookFilters from '../../components/bookFilters/BookFilters';
import Pagination from '../../components/pagination/Pagination';


const BooksPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { books, loading, error, refetch, meta, filters, setFilters } = useBooks();
  const { categories, loading: categoriesLoading } = useCategories();
  const { hasRole } = useAuth();

  // Apply search and category parameters from URL
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    const categoryFromUrl = searchParams.get('category');
    
    // Don't process if no URL params
    if (!searchFromUrl && !categoryFromUrl) {
      return;
    }
    
    const newFilters = { ...filters };
    let hasChanges = false;
    
    if (searchFromUrl) {
      newFilters.searchTerm = searchFromUrl;
      hasChanges = true;
    }
    
    if (categoryFromUrl && !categoriesLoading && categories.length > 0) {
      // Find category ID by name or description
      const category = categories.find(
        cat => cat.name.toLowerCase() === categoryFromUrl.toLowerCase() ||
               (cat.description && cat.description.toLowerCase() === categoryFromUrl.toLowerCase())
      );
      if (category) {
        newFilters.categoryId = category.id;
        hasChanges = true;
      }
    }
    
    if (hasChanges) {
      setFilters(newFilters);
      // Clear the URL parameters after applying them
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('search');
      newParams.delete('category');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, categoriesLoading, categories]); // Re-run when URL params or categories change

  const safeBooks = books || [];
  

  const canManageBooks = hasRole(['Administrador', 'Bibliotecário', 'Desenvolvedor']);

  return (
    <div className="pt-20 px-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Acervo</h1>
        {canManageBooks && (
          <button
            onClick={() => navigate('/books/create')}
            className="bg-primary hover:bg-secondary text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            + Adicionar Livro
          </button>
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
            publicationYear: b.publicationYear,
            copiesAvailable: b.availableCopies,
            borrowedByUser: b.borrowedByCurrentUser
          }))}
        />
      )}
      
      {/* Pagination */}
      {meta.totalTitles !== null && meta.pageNumber !== null && meta.pageSize !== null && (
        <Pagination
          currentPage={meta.pageNumber}
          totalCount={meta.totalTitles}
          pageSize={meta.pageSize}
          onPageChange={(page) => setFilters({ ...filters, pageNumber: page })}
        />
      )}
      
      <div className="text-sm text-gray-500 mt-4">
        {meta.totalTitles !== null && meta.totalCopies !== null && (
          <span>
            Títulos: {meta.totalTitles}
            <br />
            Exemplares: {meta.totalCopies}
          </span>
        )}
      </div>
    </div>
  );
};

export default BooksPage;
