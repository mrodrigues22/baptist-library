import React from 'react';
import { LoansFilters } from '../../hooks/useLoans';

interface LoanFiltersProps {
  filters: LoansFilters;
  onFiltersChange: (filters: LoansFilters) => void;
}

const LoanFilters: React.FC<LoanFiltersProps> = ({ filters, onFiltersChange }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, searchTerm: e.target.value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onFiltersChange({ 
      ...filters, 
      status: value === '' ? undefined : parseInt(value)
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

  const hasActiveFilters = filters.searchTerm || filters.status || filters.sortBy;

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
            placeholder="Livro, usuário..."
            value={filters.searchTerm || ''}
            onChange={handleSearchChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            value={filters.status !== undefined ? filters.status : ''}
            onChange={handleStatusChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos</option>
            <option value="1">Aguardando retirada</option>
            <option value="2">Aguardando devolução</option>
            <option value="3">Devolvido</option>
            <option value="4">Cancelado</option>
            <option value="5">Atrasado</option>
          </select>
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
            <option value="requestDate">Data solicitação (mais antigo)</option>
            <option value="-requestDate">Data solicitação (mais recente)</option>
            <option value="bookTitle">Livro (A-Z)</option>
            <option value="-bookTitle">Livro (Z-A)</option>
            <option value="requester">Usuário (A-Z)</option>
            <option value="-requester">Usuário (Z-A)</option>
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

export default LoanFilters;
