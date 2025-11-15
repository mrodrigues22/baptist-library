import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePendingUsers } from '../../hooks/User/usePendingUsers';
import Spinner from '../../components/layout/Spinner';

const PendingUsersPage = () => {
  const navigate = useNavigate();
  const { users, assignableRoles, loading, error, approveUser, rejectUser } = usePendingUsers();
  const [selectedRoles, setSelectedRoles] = useState<{ [userId: string]: string }>({});
  const [processingUsers, setProcessingUsers] = useState<Set<string>>(new Set());

  const safeUsers = users || [];

  const handleRoleChange = (userId: string, role: string) => {
    setSelectedRoles(prev => ({ ...prev, [userId]: role }));
  };

  const handleApprove = async (userId: string) => {
    const roleName = selectedRoles[userId];
    if (!roleName) {
      alert('Por favor, selecione uma função antes de aprovar.');
      return;
    }

    setProcessingUsers(prev => new Set(prev).add(userId));
    const success = await approveUser(userId, roleName);
    setProcessingUsers(prev => {
      const newSet = new Set(prev);
      newSet.delete(userId);
      return newSet;
    });

    if (success) {
      // Remove the selected role from state
      setSelectedRoles(prev => {
        const newRoles = { ...prev };
        delete newRoles[userId];
        return newRoles;
      });
    } else {
      alert('Erro ao aprovar usuário. Por favor, tente novamente.');
    }
  };

  const handleReject = async (userId: string) => {
    if (!window.confirm('Tem certeza que deseja rejeitar este usuário? Esta ação não pode ser desfeita.')) {
      return;
    }

    setProcessingUsers(prev => new Set(prev).add(userId));
    const success = await rejectUser(userId);
    setProcessingUsers(prev => {
      const newSet = new Set(prev);
      newSet.delete(userId);
      return newSet;
    });

    if (!success) {
      alert('Erro ao rejeitar usuário. Por favor, tente novamente.');
    }
  };

  return (
    <div className="pt-20 px-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Usuários Pendentes</h1>
        <button
          onClick={() => navigate('/users')}
          className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
        >
          Voltar para Usuários
        </button>
      </div>

      {error && <div className="text-red-600 mb-4">Erro: {error}</div>}

      {loading || users === null ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size={60} />
        </div>
      ) : safeUsers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 text-lg">Não há usuários pendentes de aprovação.</p>
          <button
            onClick={() => navigate('/users')}
            className="mt-4 text-primary hover:text-secondary font-medium"
          >
            Ver todos os usuários
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {safeUsers.map((user) => {
              const isProcessing = processingUsers.has(user.id);
              return (
                <div
                  key={user.id}
                  className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-gray-600 text-sm mb-1">{user.email}</p>
                      {user.phoneNumber && (
                        <p className="text-gray-600 text-sm">{user.phoneNumber}</p>
                      )}
                      <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full mt-2">
                        Aguardando Aprovação
                      </span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                      <div className="flex flex-col gap-1">
                        <label htmlFor={`role-${user.id}`} className="text-sm font-medium text-gray-700">
                          Função:
                        </label>
                        <select
                          id={`role-${user.id}`}
                          value={selectedRoles[user.id] || ''}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          disabled={isProcessing}
                          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                        >
                          <option value="">Selecione uma função</option>
                          {assignableRoles.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="flex gap-2 mt-5">
                        <button
                          onClick={() => handleReject(user.id)}
                          disabled={isProcessing}
                          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          {isProcessing ? 'Processando...' : 'Rejeitar'}
                        </button>
                        <button
                          onClick={() => handleApprove(user.id)}
                          disabled={isProcessing || !selectedRoles[user.id]}
                          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          {isProcessing ? 'Processando...' : 'Aprovar'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="text-sm text-gray-500 mt-4">
            Total de usuários pendentes: {safeUsers.length}
          </div>
        </>
      )}
    </div>
  );
};

export default PendingUsersPage;
