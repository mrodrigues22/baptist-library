import React from 'react';
import { useSettings } from '../../hooks/Setting/useSettings';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/layout/Spinner';
import SettingsList from '../../components/settingsList/SettingsList';

const SettingsPage = () => {
  const { settings, loading, error, refetch } = useSettings();
  const { hasRole } = useAuth();

  const canManageSettings = hasRole(['Administrador', 'Desenvolvedor']);

  if (!canManageSettings) {
    return (
      <div className="pt-20 px-6">
        <h1 className="text-3xl font-bold mb-4">Configurações</h1>
        <div className="text-red-600">Você não tem permissão para acessar esta página.</div>
      </div>
    );
  }

  return (
    <div className="pt-20 px-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Configurações</h1>
      </div>
      
      {error && <div className="text-red-600 mb-4">Erro: {error}</div>}
      
      {loading || settings === null ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size={60} />
        </div>
      ) : settings.length === 0 ? (
        <div className="text-gray-600">Nenhuma configuração encontrada.</div>
      ) : (
        <SettingsList 
          settings={settings}
          onUpdate={refetch}
        />
      )}
    </div>
  );
};

export default SettingsPage;
