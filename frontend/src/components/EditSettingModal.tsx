import React, { useState } from 'react';
import { useUpdateSetting } from '../hooks/Setting/useUpdateSetting';

interface EditSettingModalProps {
  settingId: number;
  settingName: string;
  currentValue: number;
  onClose: () => void;
  onSuccess: () => void;
}

const EditSettingModal: React.FC<EditSettingModalProps> = ({
  settingId,
  settingName,
  currentValue,
  onClose,
  onSuccess,
}) => {
  const [value, setValue] = useState(currentValue.toString());
  const { updateSetting, loading, error: hookError } = useUpdateSetting();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numValue = parseInt(value);
    if (isNaN(numValue)) {
      setError('Por favor, insira um número válido');
      return;
    }

    try {
      await updateSetting(settingId, numValue);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar configuração');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Editar {settingName}
          </h2>
          <p className="text-gray-600 mb-4">Valor atual: {currentValue}</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-2">
                Novo valor
              </label>
              <input
                id="value"
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            {(error || hookError) && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error || hookError}</p>
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Salvando...
                  </>
                ) : (
                  'Salvar'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSettingModal;
