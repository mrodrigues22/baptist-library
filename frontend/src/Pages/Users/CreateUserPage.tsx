import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/layout/Spinner';
import { useCreateUser, CreateUserFormData } from '../../hooks/User/useCreateUser';
import { useAssignableRoles } from '../../hooks/User/useAssignableRoles';

const CreateUserPage = () => {
  const navigate = useNavigate();
  const { createUser, loading, error, success } = useCreateUser();
  const { roles: assignableRoles, loading: rolesLoading, error: rolesError } = useAssignableRoles();

  const [formData, setFormData] = useState<CreateUserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    roleName: ''
  });

  const handleInputChange = (field: keyof CreateUserFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const createdUser = await createUser(formData);

      // Navigate to the users page after a short delay
      setTimeout(() => {
        navigate('/users');
      }, 1500);
    } catch (err: any) {
      // Error is handled by the hook
    }
  };

  return (
    <div className="pt-20 px-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/users')}
        className="text-blue-600 hover:text-secondary font-medium mb-6 flex items-center"
      >
        ← Voltar para usuários
      </button>

      {/* Main card */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Adicionar novo usuário</h1>

        {rolesLoading && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4">
            Carregando funções disponíveis...
          </div>
        )}

        {rolesError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {rolesError}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            Usuário criado com sucesso. Redirecionando...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              Nome <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              required
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Sobrenome <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              required
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Telefone
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Role */}
          <div>
            <label htmlFor="roleName" className="block text-sm font-medium text-gray-700 mb-1">
              Função <span className="text-red-500">*</span>
            </label>
            <select
              id="roleName"
              required
              value={formData.roleName}
              onChange={(e) => handleInputChange('roleName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={loading || rolesLoading}
            >
              <option value="">Selecione uma função</option>
              {assignableRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              required
              minLength={8}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={loading}
            />
            <p className="text-sm text-gray-500 mt-1">Mínimo de 8 caracteres</p>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar senha <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              required
              minLength={8}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Submit buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || rolesLoading}
              className="flex-1 bg-primary hover:bg-secondary text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Spinner size={20} />
                  <span className="ml-2">Criando...</span>
                </>
              ) : (
                'Criar usuário'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/users')}
              disabled={loading || rolesLoading}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserPage;
