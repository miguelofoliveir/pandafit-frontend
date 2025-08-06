import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTreino, useMarcarComoFeito } from '../services/api';

const TreinoDetalhe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: treino, isLoading, error } = useTreino(id!);
  const marcarFeitoMutation = useMarcarComoFeito();

  const handleMarcarComoFeito = async () => {
    if (!treino) return;

    try {
      await marcarFeitoMutation.mutateAsync({
        tipo: 'treino',
        referencia: treino._id,
        nomeItem: treino.nome,
      });
      alert('Treino marcado como feito! 🎉');
    } catch (error) {
      console.error('Erro ao marcar treino como feito:', error);
      alert('Erro ao marcar treino como feito');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !treino) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Erro ao carregar treino
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>Treino não encontrado ou erro no servidor</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Link
            to="/treinos"
            className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-fit"
          >
            ← Voltar
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{treino.nome}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 self-start">
                {treino.grupoMuscular}
              </span>
              <span className="text-sm text-gray-500">
                {treino.exercicios?.length || 0} exercícios
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleMarcarComoFeito}
            disabled={marcarFeitoMutation.isPending}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {marcarFeitoMutation.isPending ? 'Marcando...' : '✅ Marcar como Feito'}
          </button>
          <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            ✏️ Editar Treino
          </button>
        </div>
      </div>

      {/* Informações do treino */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Informações do Treino
          </h3>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <dt className="text-sm font-medium text-gray-500">Nome</dt>
              <dd className="mt-1 text-sm text-gray-900">{treino.nome}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Grupo Muscular</dt>
              <dd className="mt-1 text-sm text-gray-900">{treino.grupoMuscular}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Criado em</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(treino.criadoEm).toLocaleDateString('pt-BR')}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Total de Exercícios</dt>
              <dd className="mt-1 text-sm text-gray-900">{treino.exercicios?.length || 0}</dd>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de exercícios */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Exercícios do Treino
          </h3>
          
          {treino.exercicios && treino.exercicios.length > 0 ? (
            <div className="space-y-4">
              {treino.exercicios.map((exercicioId, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 h-8 w-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Exercício ID: {exercicioId}
                      </p>
                      <p className="text-sm text-gray-500">
                        Clique em "Ver Exercícios" para ver detalhes completos
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/exercicios"
                    className="inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full sm:w-auto"
                  >
                    Ver Exercícios
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">💪</div>
              <h3 className="text-lg font-medium text-gray-900">Nenhum exercício adicionado</h3>
              <p className="mt-1 text-sm text-gray-500">
                Este treino ainda não possui exercícios. Edite o treino para adicionar exercícios.
              </p>
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Editar Treino
                </button>
                <Link
                  to="/exercicios"
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Ver Exercícios Disponíveis
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dicas */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <div className="text-blue-400">💡</div>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Dicas para um bom treino
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>Faça um aquecimento antes de começar</li>
                <li>Mantenha a forma correta durante os exercícios</li>
                <li>Descanse adequadamente entre as séries</li>
                <li>Hidrate-se durante o treino</li>
                <li>Não se esqueça do alongamento no final</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreinoDetalhe;