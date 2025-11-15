import React, { useState, useEffect, useRef } from 'react';
import { useUserSearch } from '../hooks/User/useUserSearch';
import { useCreateLoan } from '../hooks/Loan/useCreateLoan';
import { logError } from '../shared/utils/logger';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role?: string;
  active: boolean;
}

interface LoanBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: number;
  bookTitle: string;
  onSuccess: () => void;
}

const LoanBookModal: React.FC<LoanBookModalProps> = ({
  isOpen,
  onClose,
  bookId,
  bookTitle,
  onSuccess,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use custom hooks
  const { users: filteredUsers, loading, error: searchError } = useUserSearch(searchTerm, isOpen);
  const { createLoan, loading: submitting, error } = useCreateLoan();

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setSelectedUser(null);
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setSearchTerm(`${user.firstName} ${user.lastName}`);
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser) {
      return;
    }

    try {
      await createLoan({
        bookId: bookId,
        requesterUserId: selectedUser.id,
      });
      
      onSuccess();
      onClose();
    } catch (err) {
      // Error is handled by the hook
      logError('Error creating loan:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Emprestar livro
          </h2>
          <p className="text-gray-600 mb-6">{bookTitle}</p>

          {(error || searchError) && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error || searchError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6" ref={dropdownRef}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Selecionar leitor
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchTerm(value);
                    if (value.length > 0) {
                      setIsDropdownOpen(true);
                    } else {
                      setIsDropdownOpen(false);
                    }
                    if (selectedUser && value !== `${selectedUser.firstName} ${selectedUser.lastName}`) {
                      setSelectedUser(null);
                    }
                  }}
                  onFocus={() => {
                    if (searchTerm.length > 0) {
                      setIsDropdownOpen(true);
                    }
                  }}
                  placeholder="Digite para buscar por nome ou email..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                {isDropdownOpen && searchTerm.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {loading ? (
                      <div className="px-4 py-3 text-gray-500 text-center flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Buscando...
                      </div>
                    ) : filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          onClick={() => handleSelectUser(user)}
                          className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                          {user.role && (
                            <div className="text-xs text-gray-500 mt-1">{user.role}</div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-gray-500 text-center">
                        Nenhum usuário encontrado
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {selectedUser && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm font-medium text-blue-900">
                    Usuário selecionado:
                  </div>
                  <div className="text-blue-800 mt-1">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </div>
                  <div className="text-sm text-blue-600">{selectedUser.email}</div>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                disabled={submitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={!selectedUser || submitting}
              >
                {submitting ? 'Criando...' : 'Confirmar empréstimo'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoanBookModal;
