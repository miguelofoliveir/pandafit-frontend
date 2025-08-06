import React, { useState } from 'react';
import { useDieta, useCreateRefeicao, useMarcarComoFeito } from '../services/api';
import type { Refeicao, Alimento } from '../services/api';

const Dieta: React.FC = () => {
  const { data: refeicoes, isLoading, error } = useDieta();
  const createRefeicaoMutation = useCreateRefeicao();
  const marcarFeitoMutation = useMarcarComoFeito();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRefeicao, setNewRefeicao] = useState({
    nome: '',
    horario: '',
    alimentos: [] as Alimento[],
  });

  const [alimentoTemp, setAlimentoTemp] = useState({
    nome: '',
    quantidade: '',
    calorias: 0,
  });

  const handleCreateRefeicao = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRefeicaoMutation.mutateAsync(newRefeicao);
      setShowCreateForm(false);
      setNewRefeicao({
        nome: '',
        horario: '',
        alimentos: [],
      });
    } catch (error) {
      console.error('Erro ao criar refeição:', error);
    }
  };

  const handleAddAlimento = () => {
    if (alimentoTemp.nome.trim() && alimentoTemp.quantidade.trim() && alimentoTemp.calorias > 0) {
      setNewRefeicao({
        ...newRefeicao,
        alimentos: [...newRefeicao.alimentos, { ...alimentoTemp }],
      });
      setAlimentoTemp({
        nome: '',
        quantidade: '',
        calorias: 0,
      });
    }
  };

  const handleRemoveAlimento = (index: number) => {
    setNewRefeicao({
      ...newRefeicao,
      alimentos: newRefeicao.alimentos.filter((_, i) => i !== index),
    });
  };

  const handleMarcarRefeicaoFeita = async (refeicao: Refeicao) => {
    try {
      await marcarFeitoMutation.mutateAsync({
        tipo: 'refeicao',
        referencia: refeicao._id,
        nomeItem: refeicao.nome,
      });
      alert('Refeição marcada como feita! 🍽️');
    } catch (error) {
      console.error('Erro ao marcar refeição como feita:', error);
      alert('Erro ao marcar refeição como feita');
    }
  };

  // Função para calcular calorias de uma refeição
  const calcularCaloriasRefeicao = (alimentos: Alimento[]): number => {
    return alimentos.reduce((total, alimento) => total + alimento.calorias, 0);
  };

  // Agrupar refeições por horário
  const refeicoesPorHorario = refeicoes?.reduce((acc: { [key: string]: Refeicao[] }, refeicao: Refeicao) => {
    const horario = refeicao.horario;
    if (!acc[horario]) {
      acc[horario] = [];
    }
    acc[horario].push(refeicao);
    return acc;
  }, {}) || {};

  // Calcular calorias totais do dia
  const caloriasTotaisDia = refeicoes?.reduce((total: number, refeicao: Refeicao) => {
    return total + calcularCaloriasRefeicao(refeicao.alimentos);
  }, 0) || 0;

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
              Erro ao carregar dieta
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>Verifique se o backend está rodando na porta 8000</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dieta</h1>
          <p className="mt-1 text-sm sm:text-base text-gray-600">
            Gerencie seu plano alimentar e acompanhe as calorias
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full sm:w-auto"
        >
          <span className="mr-2">+</span>
          Nova Refeição
        </button>
      </div>

      {/* Resumo de calorias */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-bold text-green-600">{caloriasTotaisDia}</div>
          <div className="text-sm text-gray-500 mt-1">Calorias totais do dia</div>
        </div>
      </div>

      {/* Form de criação */}
      {showCreateForm && (
        <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 border border-gray-200">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-semibold">🥗</span>
              </div>
            </div>
            <div className="ml-3">
              <h2 className="text-xl font-semibold text-gray-900">Nova Refeição</h2>
              <p className="text-sm text-gray-500">Adicione uma nova refeição ao seu plano alimentar</p>
            </div>
          </div>
          <form onSubmit={handleCreateRefeicao} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Refeição
                </label>
                <input
                  type="text"
                  id="nome"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Ex: Café da Manhã"
                  value={newRefeicao.nome}
                  onChange={(e) => setNewRefeicao({ ...newRefeicao, nome: e.target.value })}
                />
              </div>
              
              <div>
                <label htmlFor="horario" className="block text-sm font-medium text-gray-700 mb-2">
                  Horário
                </label>
                <input
                  type="time"
                  id="horario"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  value={newRefeicao.horario}
                  onChange={(e) => setNewRefeicao({ ...newRefeicao, horario: e.target.value })}
                />
              </div>
            </div>

            {/* Alimentos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Alimentos
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-3">
                <input
                  type="text"
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Nome do alimento"
                  value={alimentoTemp.nome}
                  onChange={(e) => setAlimentoTemp({ ...alimentoTemp, nome: e.target.value })}
                />
                <input
                  type="text"
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Quantidade"
                  value={alimentoTemp.quantidade}
                  onChange={(e) => setAlimentoTemp({ ...alimentoTemp, quantidade: e.target.value })}
                />
                <input
                  type="number"
                  min="0"
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Calorias"
                  value={alimentoTemp.calorias || ''}
                  onChange={(e) => setAlimentoTemp({ ...alimentoTemp, calorias: parseInt(e.target.value) || 0 })}
                />
                <button
                  type="button"
                  onClick={handleAddAlimento}
                  className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Adicionar
                </button>
              </div>
              
              {newRefeicao.alimentos.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Alimentos adicionados ({calcularCaloriasRefeicao(newRefeicao.alimentos)} calorias):
                  </div>
                  {newRefeicao.alimentos.map((alimento, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 px-3 py-3 rounded-md"
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{alimento.nome}</div>
                        <div className="text-xs text-gray-600">
                          {alimento.quantidade} • {alimento.calorias} calorias
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAlimento(index)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={createRefeicaoMutation.isPending}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {createRefeicaoMutation.isPending ? 'Criando...' : 'Criar Refeição'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de refeições por horário */}
      <div className="space-y-6">
        {Object.keys(refeicoesPorHorario).length > 0 ? (
          Object.entries(refeicoesPorHorario)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([horario, refeicoesList]) => (
              <div key={horario} className="bg-white shadow rounded-lg">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    {horario} - {refeicoesList.reduce((total, r) => total + calcularCaloriasRefeicao(r.alimentos), 0)} calorias
                  </h3>
                </div>
                <div className="p-4 sm:p-6 space-y-4">
                  {refeicoesList.map((refeicao) => (
                    <div
                      key={refeicao._id}
                      className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                          <h4 className="text-lg font-medium text-gray-900">{refeicao.nome}</h4>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 self-start">
                            {calcularCaloriasRefeicao(refeicao.alimentos)} cal
                          </span>
                        </div>
                        
                        {refeicao.alimentos.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Alimentos:</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {refeicao.alimentos.map((alimento, index) => (
                                <div key={index} className="flex items-start bg-white p-2 rounded border">
                                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 mt-1.5"></span>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-gray-900">{alimento.nome}</div>
                                    <div className="text-xs text-gray-600">
                                      {alimento.quantidade} • {alimento.calorias} cal
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={() => handleMarcarRefeicaoFeita(refeicao)}
                        disabled={marcarFeitoMutation.isPending}
                        className="inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 w-full sm:w-auto"
                      >
                        ✅ Marcar como Feita
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
        ) : (
          <div className="bg-white shadow rounded-lg p-6 sm:p-12 text-center">
            <div className="text-4xl mb-4">🍽️</div>
            <h3 className="text-lg font-medium text-gray-900">Nenhuma refeição encontrada</h3>
            <p className="mt-1 text-sm text-gray-500">
              Comece criando seu plano alimentar.
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full sm:w-auto"
            >
              Criar Primeira Refeição
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dieta;