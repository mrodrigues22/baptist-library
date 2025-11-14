import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useUsers } from '../../hooks/User/useUsers';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/layout/Spinner';
import UserList from '../../components/userList/userList';
import UserFilters from '../../components/userFilters/UserFilters';

const UsersPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { users, loading, error, refetch, filters, setFilters, hasPendingUsers } = useUsers();
  const { hasRole } = useAuth();

  // Apply search parameters from URL
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    
    // Don't process if no URL params
    if (!searchFromUrl) {
      return;
    }
    
    const newFilters = { ...filters };
    let hasChanges = false;
    
    if (searchFromUrl) {
      newFilters.filter = searchFromUrl;
      hasChanges = true;
    }
    
    if (hasChanges) {
      setFilters(newFilters);
      // Clear the URL parameters after applying them
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('search');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams]); // Re-run when URL params change

  const safeUsers = users || [];
  
  const canManageUsers = hasRole(['Administrador', 'Bibliotecário', 'Desenvolvedor']);

  return (
    <div className="pt-20 px-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Usuários</h1>
        <div className="flex gap-2">
          {canManageUsers && hasPendingUsers && (
            <button
              onClick={() => navigate('/users/pending')}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
            >
              Aprovar Pendentes
            </button>
          )}
          {canManageUsers && (
            <button
              onClick={() => navigate('/users/create')}
              className="bg-primary hover:bg-secondary text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
            >
              + Adicionar Usuário
            </button>
          )}
        </div>
      </div>
      
      {/* Filters */}
      <UserFilters 
        filters={filters}
        onFiltersChange={setFilters}
      />
      
      {error && <div className="text-red-600 mb-4">Erro: {error}</div>}
      
      {loading || users === null ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size={60} />
        </div>
      ) : users.length === 0 ? (
        <div className="text-gray-600">Nenhum usuário encontrado.</div>
      ) : (
        <UserList users={users} />
      )}
      
      <div className="text-sm text-gray-500 mt-4">
        {users && users.length > 0 && (
          <span>
            Total de usuários: {users.length}
          </span>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
