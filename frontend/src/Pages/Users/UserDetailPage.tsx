import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserDetail } from '../../hooks/User/useUserDetail';
import { useUserLoans } from '../../hooks/Loan/useUserLoans';
import Spinner from '../../components/layout/Spinner';
import { useAuth } from '../../context/AuthContext';
import { useUpdateUser, UpdateUserFormData } from '../../hooks/User/useUpdateUser';

const UserDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, assignableRoles, loading, error, refetch } = useUserDetail(id || '');
  const { loans, loading: loansLoading, error: loansError } = useUserLoans(id || '');
  const { hasRole } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { updateUser, loading: updateLoading, error: updateError, success: updateSuccess } = useUpdateUser();
  const [formData, setFormData] = useState<UpdateUserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: ''
  });
  const [validationErrors, setValidationErrors] = useState<{ email?: string; phoneNumber?: string }>(() => ({}));

  // Phone mask & validation (same as CreateUserPage)
  const formatBrazilianPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    const limited = numbers.slice(0, 11);
    if (limited.length <= 2) return limited;
    if (limited.length <= 6) return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    if (limited.length <= 10) return `(${limited.slice(0, 2)}) ${limited.slice(2, 6)}-${limited.slice(6)}`;
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
  };
  const validateBrazilianPhone = (phone: string): boolean => {
    if (!phone) return true;
    const numbers = phone.replace(/\D/g, '');
    return numbers.length === 10 || numbers.length === 11;
  };
  const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const beginEdit = () => {
    if (!user) return;
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      password: ''
    });
    setIsEditing(true);
    setSaveError(null);
    setValidationErrors({});
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setSaveError(null);
    setSaving(false);
  };

  const handleInputChange = (field: keyof UpdateUserFormData, value: string) => {
    let processedValue = value;
    if (field === 'phoneNumber') {
      processedValue = formatBrazilianPhone(value);
      if (processedValue && !validateBrazilianPhone(processedValue)) {
        setValidationErrors(prev => ({ ...prev, phoneNumber: 'Telefone inválido. Use o formato: (11) 91234-5678' }));
      } else {
        setValidationErrors(prev => { const { phoneNumber, ...rest } = prev; return rest; });
      }
    } else if (field === 'email') {
      if (value && !validateEmail(value)) {
        setValidationErrors(prev => ({ ...prev, email: 'Email inválido' }));
      } else {
        setValidationErrors(prev => { const { email, ...rest } = prev; return rest; });
      }
    }
    setFormData(prev => ({ ...prev, [field]: processedValue }));
  };

  const handleSave = async () => {
    if (!user) return;
    if (Object.keys(validationErrors).length > 0) return;
    setSaving(true);
    setSaveError(null);
    try {
      await updateUser(user.id, formData);
      await refetch();
      setIsEditing(false);
    } catch (err: any) {
      setSaveError(err.message || 'Erro desconhecido');
    } finally {
      setSaving(false);
    }
  };
  
  const canManageUsers = hasRole(['Administrador', 'Bibliotecário', 'Desenvolvedor']);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size={60} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 px-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          Erro: {error}
        </div>
        <button
          onClick={() => navigate('/users')}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Voltar para usuários
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-20 px-6">
        <div className="text-gray-600 mb-4">Usuário não encontrado.</div>
        <button
          onClick={() => navigate('/users')}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Voltar para usuários
        </button>
      </div>
    );
  }

  return (
    <div className="pt-20 px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/users')}
          className="text-blue-600 hover:text-blue-800 font-medium mb-4 inline-flex items-center"
        >
          ← Voltar para usuários
        </button>
        
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold text-gray-900">
              {user.firstName} {user.lastName}
            </h1>
            {user.roles && user.roles.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.roles.map((role, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {role}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Nenhuma permissão atribuída</p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              user.active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {user.active ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - User Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Informações Pessoais</h2>
              {canManageUsers && (
                <div className="flex items-center gap-3">
                  {!isEditing && (
                    <button
                      onClick={beginEdit}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Editar
                    </button>
                  )}
                  {isEditing && (
                    <>
                      <button
                        onClick={cancelEdit}
                        disabled={saving}
                        className="text-gray-600 hover:text-gray-800 font-medium text-sm disabled:opacity-50"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                      >
                        {saving ? 'Salvando...' : 'Salvar'}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              {!isEditing && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <p className="text-gray-900">{user.firstName} {user.lastName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                    <p className="text-gray-900">{user.phoneNumber || 'Não informado'}</p>
                  </div>
                </>
              )}
              {isEditing && (
                <>
                  {saveError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                      {saveError}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Primeiro Nome</label>
                      <input
                        name="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={saving}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sobrenome</label>
                      <input
                        name="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={saving}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                        disabled={saving}
                      />
                      {validationErrors.email && <p className="text-xs text-red-600 mt-1">{validationErrors.email}</p>}
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                      <input
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        placeholder="(11) 91234-5678"
                        className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.phoneNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                        disabled={saving}
                      />
                      {validationErrors.phoneNumber && <p className="text-xs text-red-600 mt-1">{validationErrors.phoneNumber}</p>}
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha (opcional)</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password || ''}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={saving}
                        placeholder="Mínimo 8 caracteres"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          
          {/* Loan History */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Histórico de empréstimos</h2>
            
            {loansLoading ? (
              <div className="flex justify-center py-8">
                <Spinner size={40} />
              </div>
            ) : loansError ? (
              <div className="text-center py-8 text-red-600">
                <p>Erro ao carregar empréstimos: {loansError}</p>
              </div>
            ) : !loans || loans.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhum empréstimo encontrado</p>
              </div>
            ) : (
              <div className="space-y-3">
                {loans.map((loan) => (
                  <div
                    key={loan.id}
                    onClick={() => navigate(`/loans/${loan.id}`)}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {loan.bookTitle}
                        </h3>
                        <div className="text-sm text-gray-600">
                          {new Date(loan.requestDate).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {loan.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Statistics */}
        <div className="space-y-6">
          {/* Statistics Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Estatísticas</h2>
            
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-blue-600 font-medium mb-1">
                  Empréstimos ativos
                </div>
                <div className="text-3xl font-bold text-blue-900">
                  {user.activeLoans}
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm text-green-600 font-medium mb-1">
                  Total de empréstimos
                </div>
                <div className="text-3xl font-bold text-green-900">
                  {user.totalLoans}
                </div>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
