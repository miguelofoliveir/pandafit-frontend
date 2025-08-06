import React from 'react';
import { Link } from 'react-router-dom';
import { useDashboardData } from '../services/api';

const Dashboard: React.FC = () => {
  const { data: dashboardData, isLoading, error } = useDashboardData();

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
              Erro ao carregar dados do dashboard
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>Verifique se o backend está rodando na porta 8000</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const quickActions = [
    {
      title: 'Treinos',
      description: 'Gerencie seus treinos',
      icon: '🏋️',
      href: '/treinos',
      color: 'bg-blue-500',
    },
    {
      title: 'Exercícios',
      description: 'Catálogo de exercícios',
      icon: '💪',
      href: '/exercicios',
      color: 'bg-green-500',
    },
    {
      title: 'Dieta',
      description: 'Plano alimentar',
      icon: '🍽️',
      href: '/dieta',
      color: 'bg-yellow-500',
    },
    {
      title: 'Histórico',
      description: 'Acompanhe seu progresso',
      icon: '📜',
      href: '/historico',
      color: 'bg-purple-500',
    },
    {
      title: 'Configurações',
      description: 'Ajustes do sistema',
      icon: '⚙️',
      href: '/configuracoes',
      color: 'bg-gray-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm sm:text-base text-gray-600">
          Bem-vindo ao PandaFit! Aqui está um resumo da sua atividade.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">🏋️</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total de Treinos
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {dashboardData?.totalTreinos || 0}
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
                <div className="text-2xl">✅</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Treinos Feitos
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {dashboardData?.ultimosTreinos?.length || 0}
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
                    Refeições Feitas
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {dashboardData?.ultimasRefeicoes?.length || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Últimos Treinos */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Últimos Treinos Feitos
            </h3>
            <div className="mt-5">
              {dashboardData?.ultimosTreinos?.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {dashboardData.ultimosTreinos.map((treino, index) => (
                    <li key={index} className="py-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-lg">🏋️</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {treino.nomeItem}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(treino.dataFeito).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">Nenhum treino feito ainda.</p>
              )}
            </div>
          </div>
        </div>

        {/* Últimas Refeições */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Últimas Refeições Feitas
            </h3>
            <div className="mt-5">
              {dashboardData?.ultimasRefeicoes?.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {dashboardData.ultimasRefeicoes.map((refeicao, index) => (
                    <li key={index} className="py-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-lg">🍽️</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {refeicao.nomeItem}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(refeicao.dataFeito).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">Nenhuma refeição feita ainda.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Atalhos Rápidos</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.href}
              className="group bg-white p-4 sm:p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
            >
              <div>
                <span className={`inline-flex p-2 sm:p-3 rounded-lg ${action.color} text-white text-lg sm:text-xl`}>
                  {action.icon}
                </span>
              </div>
              <div className="mt-3 sm:mt-4">
                <h3 className="text-sm sm:text-lg font-medium text-gray-900 group-hover:text-gray-600">
                  {action.title}
                </h3>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">
                  {action.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;