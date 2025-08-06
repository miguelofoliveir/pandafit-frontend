import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistorico } from '../services/api';
import type { HistoricoItem } from '../services/api';

const Historico: React.FC = () => {
  const [filtros, setFiltros] = useState({
    tipo: '',
    data: '',
  });

  const { data: historico, isLoading, error } = useHistorico(filtros);

  const handleFiltroChange = (key: string, value: string) => {
    setFiltros(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFiltros = () => {
    setFiltros({ tipo: '', data: '' });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Erro ao carregar histórico
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>Verifique se o backend está rodando na porta 8000</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Agrupar histórico por data
  const historicoPorData = historico?.reduce((acc: { [key: string]: HistoricoItem[] }, item: HistoricoItem) => {
    const data = new Date(item.dataFeito).toLocaleDateString('pt-BR');
    if (!acc[data]) {
      acc[data] = [];
    }
    acc[data].push(item);
    return acc;
  }, {}) || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Histórico</h1>
        <p className="mt-1 text-sm sm:text-base text-gray-600">
          Acompanhe seu progresso e atividades realizadas
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Filtros</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">
              Tipo de Atividade
            </label>
            <select
              id="tipo"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={filtros.tipo}
              onChange={(e) => handleFiltroChange('tipo', e.target.value)}
            >
              <option value="">Todos os tipos</option>
              <option value="treino">Treinos</option>
              <option value="refeicao">Refeições</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="data" className="block text-sm font-medium text-gray-700">
              Data
            </label>
            <input
              type="date"
              id="data"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={filtros.data}
              onChange={(e) => handleFiltroChange('data', e.target.value)}
            />
          </div>

          <div className="flex items-end sm:col-span-2 md:col-span-1">
            <button
              onClick={clearFiltros}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">📊</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total de Atividades
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {historico?.length || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">🏋️</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Treinos Realizados
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {historico?.filter((item: HistoricoItem) => item.tipo === 'treino').length || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">🍽️</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Refeições Realizadas
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {historico?.filter((item: HistoricoItem) => item.tipo === 'refeicao').length || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista do histórico */}
      <div className="space-y-6">
        {Object.keys(historicoPorData).length > 0 ? (
          Object.entries(historicoPorData)
            .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime()) // Mais recente primeiro
            .map(([data, itens]) => (
              <div key={data} className="bg-white shadow rounded-lg">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    {data} ({itens.length} {itens.length === 1 ? 'atividade' : 'atividades'})
                  </h3>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="space-y-3">
                    {itens.map((item) => (
                      <div
                        key={item._id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {item.tipo === 'treino' ? (
                              <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm">🏋️</span>
                              </div>
                            ) : (
                              <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm">🍽️</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {item.nomeItem}
                            </p>
                            <p className="text-sm text-gray-500">
                              {item.tipo === 'treino' ? 'Treino realizado' : 'Refeição consumida'} às{' '}
                              {new Date(item.dataFeito).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center self-start">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.tipo === 'treino'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {item.tipo === 'treino' ? 'Treino' : 'Refeição'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
        ) : (
          <div className="bg-white shadow rounded-lg p-6 sm:p-12 text-center">
            <div className="text-4xl mb-4">📜</div>
            <h3 className="text-lg font-medium text-gray-900">Nenhuma atividade encontrada</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filtros.tipo || filtros.data
                ? 'Tente ajustar os filtros para ver mais resultados.'
                : 'Comece realizando treinos e marcando refeições como feitas.'}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                to="/treinos"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Ver Treinos
              </Link>
              <Link
                to="/dieta"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Ver Dieta
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Historico;