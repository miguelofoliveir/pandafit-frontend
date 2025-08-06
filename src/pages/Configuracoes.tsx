import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useResetBanco } from '../services/api';

const Configuracoes: React.FC = () => {
  const { user, logout } = useAuth();
  const resetBancoMutation = useResetBanco();
  const [showResetModal, setShowResetModal] = useState(false);

  const handleResetBanco = async () => {
    try {
      await resetBancoMutation.mutateAsync();
      setShowResetModal(false);
      alert('Banco de dados resetado com sucesso! 🔄');
    } catch (error) {
      console.error('Erro ao resetar banco:', error);
      alert('Erro ao resetar banco de dados');
    }
  };

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair?')) {
      logout();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="mt-1 text-sm sm:text-base text-gray-600">
          Gerencie as configurações do sistema e sua conta
        </p>
      </div>

      {/* Informações do usuário */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Informações da Conta
          </h3>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">ID do Usuário</dt>
              <dd className="mt-1 text-sm text-gray-900">{user?.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Nome</dt>
              <dd className="mt-1 text-sm text-gray-900">{user?.nome}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Conectado
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Tipo de Login</dt>
              <dd className="mt-1 text-sm text-gray-900">Desenvolvimento (Mock)</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Configurações do Sistema */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Configurações do Sistema
          </h3>
          
          <div className="space-y-6">
            {/* Informações do Backend */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Informações do Backend</h4>
              <dl className="text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <dt>URL do Backend:</dt>
                  <dd className="font-mono">http://localhost:8000</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Banco de Dados:</dt>
                  <dd>MongoDB Atlas</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Autenticação:</dt>
                  <dd>Token Mockado (Desenvolvimento)</dd>
                </div>
              </dl>
            </div>

            {/* Versão do Sistema */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Versão do Sistema</h4>
              <dl className="text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <dt>Frontend:</dt>
                  <dd>v1.0.0</dd>
                </div>
                <div className="flex justify-between">
                  <dt>React:</dt>
                  <dd>v19.1.0</dd>
                </div>
                <div className="flex justify-between">
                  <dt>TypeScript:</dt>
                  <dd>v5.8.3</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Vite:</dt>
                  <dd>v7.0.4</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Ações do Sistema */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Ações do Sistema
          </h3>
          
          <div className="space-y-4">
            {/* Reset do Banco */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <div>
                <h4 className="text-sm font-medium text-yellow-800">
                  Resetar Banco de Dados
                </h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Remove todos os dados do sistema (treinos, exercícios, dieta, histórico).
                  Esta ação não pode ser desfeita.
                </p>
              </div>
              <button
                onClick={() => setShowResetModal(true)}
                disabled={resetBancoMutation.isPending}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 w-full sm:w-auto"
              >
                {resetBancoMutation.isPending ? 'Resetando...' : '🔄 Resetar Banco'}
              </button>
            </div>

            {/* Logout */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div>
                <h4 className="text-sm font-medium text-red-800">
                  Sair da Conta
                </h4>
                <p className="text-sm text-red-700 mt-1">
                  Desconecta sua conta e retorna para a tela de login.
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 w-full sm:w-auto"
              >
                🚪 Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmação para reset */}
      {showResetModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">
                Confirmar Reset do Banco
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Tem certeza que deseja resetar o banco de dados? Esta ação irá:
                </p>
                <ul className="text-sm text-gray-500 mt-2 text-left space-y-1">
                  <li>• Remover todos os treinos</li>
                  <li>• Remover todos os exercícios</li>
                  <li>• Remover todas as refeições</li>
                  <li>• Limpar todo o histórico</li>
                </ul>
                <p className="text-sm text-red-600 mt-2 font-medium">
                  Esta ação não pode ser desfeita!
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 px-4 py-3">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleResetBanco}
                  disabled={resetBancoMutation.isPending}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {resetBancoMutation.isPending ? 'Resetando...' : 'Confirmar Reset'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dicas de desenvolvimento */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <div className="text-blue-400">💡</div>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Dicas para Desenvolvimento
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>O backend deve estar rodando em http://localhost:8000</li>
                <li>Use qualquer ID e senha para fazer login (autenticação mockada)</li>
                <li>O token é armazenado no localStorage para persistência</li>
                <li>Use o reset do banco para limpar dados de teste</li>
                <li>Todas as requisições usam React Query para cache e estado</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;