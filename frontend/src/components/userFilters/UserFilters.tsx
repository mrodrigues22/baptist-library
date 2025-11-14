import React from 'react';
import { UsersFilters } from '../../hooks/User/useUsers';

interface UserFiltersProps {
  filters: UsersFilters;
  onFiltersChange: (filters: UsersFilters) => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({ filters, onFiltersChange }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, filter: e.target.value });
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

  const handleActiveFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'all') {
      onFiltersChange({ ...filters, activeOnly: undefined });
    } else if (value === 'active') {
      onFiltersChange({ ...filters, activeOnly: true });
    } else if (value === 'inactive') {
      onFiltersChange({ ...filters, activeOnly: false });
    }
  };

  const handleClearFilters = () => {
    onFiltersChange({ activeOnly: true });
  };

  const currentSortValue = filters.sortBy 
    ? (filters.descending ? `-${filters.sortBy}` : filters.sortBy)
    : '';

  const currentActiveFilter = filters.activeOnly === undefined 
    ? 'all' 
    : filters.activeOnly 
    ? 'active' 
    : 'inactive';

  const hasActiveFilters = filters.filter || filters.sortBy || filters.activeOnly === false;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Buscar
          </label>
          <input
            id="search"
            type="text"
            placeholder="Nome, email, telefone..."
            value={filters.filter || ''}
            onChange={handleSearchChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Active Status Filter */}
        <div>
          <label htmlFor="activeFilter" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="activeFilter"
            value={currentActiveFilter}
            onChange={handleActiveFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
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
            <option value="firstName">Nome (A-Z)</option>
            <option value="-firstName">Nome (Z-A)</option>
            <option value="email">Email (A-Z)</option>
            <option value="-email">Email (Z-A)</option>
            <option value="role">Função (A-Z)</option>
            <option value="-role">Função (Z-A)</option>
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

export default UserFilters;
