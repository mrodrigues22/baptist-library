import React from 'react';
import { UsersFilters } from '../../shared/types';
import Select from '../Select/Select';

interface UserFiltersProps {
  filters: UsersFilters;
  onFiltersChange: (filters: UsersFilters) => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({ filters, onFiltersChange }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, filter: e.target.value });
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

  const handleRoleFilterChange = (value: string | number) => {
    const stringValue = String(value);
    onFiltersChange({ ...filters, roleFilter: stringValue === 'all' ? undefined : stringValue });
  };

  const handleClearFilters = () => {
    onFiltersChange({});
  };

  const currentSortValue = filters.sortBy 
    ? (filters.descending ? `-${filters.sortBy}` : filters.sortBy)
    : '';

  const currentRoleFilter = filters.roleFilter || 'all';

  const hasActiveFilters = filters.filter || filters.sortBy || filters.roleFilter;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="md:col-span-2">
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

        {/* Role Filter */}
        <div>
          <label htmlFor="roleFilter" className="block text-sm font-medium text-gray-700 mb-1">
            Função
          </label>
          <Select
            id="roleFilter"
            value={currentRoleFilter}
            onChange={handleRoleFilterChange}
            options={[
              { value: 'all', label: 'Todas' },
              { value: 'Administrador', label: 'Administrador' },
              { value: 'Bibliotecário', label: 'Bibliotecário' },
              { value: 'Membro', label: 'Membro' }
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
          <Select
            id="sort"
            value={currentSortValue}
            onChange={handleSortChange}
            options={[
              { value: '', label: 'Padrão' },
              { value: 'firstName', label: 'Nome (A-Z)' },
              { value: '-firstName', label: 'Nome (Z-A)' },
              { value: 'email', label: 'Email (A-Z)' },
              { value: '-email', label: 'Email (Z-A)' },
              { value: 'role', label: 'Função (A-Z)' },
              { value: '-role', label: 'Função (Z-A)' }
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

export default UserFilters;
