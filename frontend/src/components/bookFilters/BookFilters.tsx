import React from 'react';
import { BooksFilters } from '../../hooks/useBooks';
import { Category } from '../../hooks/useCategories';
import SearchableSelect from '../SearchableSelect/SearchableSelect';

interface BookFiltersProps {
  filters: BooksFilters;
  onFiltersChange: (filters: BooksFilters) => void;
  categories: Category[];
}

const BookFilters: React.FC<BookFiltersProps> = ({ filters, onFiltersChange, categories }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, searchTerm: e.target.value });
  };

  const handleCategoryChange = (value: string | number) => {
    onFiltersChange({ 
      ...filters, 
      categoryId: value === '' ? undefined : Number(value)
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === '') {
      onFiltersChange({ ...filters, sortBy: undefined, descending: false });
    } else if (value.startsWith('-')) {
      onFiltersChange({ ...filters, sortBy: value.substring(1), descending: true });
    } else {
      onFiltersChange({ ...filters, sortBy: value, descending: false });
    }
  };

  const handleClearFilters = () => {
    onFiltersChange({});
  };

  const currentSortValue = filters.sortBy 
    ? (filters.descending ? `-${filters.sortBy}` : filters.sortBy)
    : '';

  const hasActiveFilters = filters.searchTerm || filters.categoryId || filters.sortBy;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Search */}
        <div className="md:col-span-3">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Buscar
          </label>
          <input
            id="search"
            type="text"
            placeholder="Título, autor, categoria ..."
            value={filters.searchTerm || ''}
            onChange={handleSearchChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Categoria
          </label>
          <SearchableSelect
            id="category"
            value={filters.categoryId || ''}
            onChange={handleCategoryChange}
            options={[
              { value: '', label: 'Todas' },
              ...categories.map(cat => ({
                value: cat.id,
                label: cat.description || cat.name
              }))
            ]}
            placeholder="Todas"
            className="w-full"
          />
        </div>

        {/* Sort */}
        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
            Ordenar por
          </label>
          <select
            id="sort"
            value={currentSortValue}
            onChange={handleSortChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Padrão</option>
            <option value="title">Título (A-Z)</option>
            <option value="-title">Título (Z-A)</option>
            <option value="publicationYear">Ano (mais antigo)</option>
            <option value="-publicationYear">Ano (mais recente)</option>
          </select>
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
};

export default BookFilters;
