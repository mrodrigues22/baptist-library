import React from 'react';
import { LoansFilters } from '../../shared/types';
import Select from '../Select/Select';

interface LoanFiltersProps {
  filters: LoansFilters;
  onFiltersChange: (filters: LoansFilters) => void;
}

const LoanFilters: React.FC<LoanFiltersProps> = ({ filters, onFiltersChange }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, searchTerm: e.target.value });
  };

  const handleStatusChange = (value: string | number) => {
    const stringValue = String(value);
    onFiltersChange({ 
      ...filters, 
      status: stringValue === '' ? undefined : parseInt(stringValue)
    });
  };

  const handleSortChange = (value: string | number) => {
    const stringValue = String(value);
    if (stringValue === '') {
      onFiltersChange({ ...filters, sortBy: undefined, descending: false });
    } else if (stringValue.startsWith('-')) {
      onFiltersChange({ ...filters, sortBy: stringValue.substring(1), descending: true });
    } else {
      onFiltersChange({ ...filters, sortBy: stringValue, descending: false });
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
          <Select
            id="status"
            value={filters.status !== undefined ? String(filters.status) : ''}
            onChange={handleStatusChange}
            options={[
              { value: '', label: 'Todos' },
              { value: '1', label: 'Aguardando retirada' },
              { value: '2', label: 'Aguardando devolução' },
              { value: '3', label: 'Devolvido' },
              { value: '4', label: 'Cancelado' },
              { value: '5', label: 'Atrasado' }
            ]}
            placeholder="Todos"
            className="w-full"
          />
        </div>

        {/* Sort */}
        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
            Ordenar por
          </label>
          <Select
            id="sort"
            value={currentSortValue}
            onChange={handleSortChange}
            options={[
              { value: '', label: 'Padrão' },
              { value: 'requestDate', label: 'Data solicitação (mais antigo)' },
              { value: '-requestDate', label: 'Data solicitação (mais recente)' },
              { value: 'bookTitle', label: 'Livro (A-Z)' },
              { value: '-bookTitle', label: 'Livro (Z-A)' },
              { value: 'requester', label: 'Usuário (A-Z)' },
              { value: '-requester', label: 'Usuário (Z-A)' }
            ]}
            placeholder="Padrão"
            className="w-full"
          />
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
