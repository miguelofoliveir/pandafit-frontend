import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTreinos, useCreateTreino, useDeleteTreino, useUpdateTreino } from '../services/api';
import type { Treino } from '../services/api';

const Treinos: React.FC = () => {
  const { data: treinos, isLoading, error } = useTreinos();
  const createTreinoMutation = useCreateTreino();
  const deleteTreinoMutation = useDeleteTreino();
  const updateTreinoMutation = useUpdateTreino();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingTreino, setEditingTreino] = useState<Treino | null>(null);
  const [newTreino, setNewTreino] = useState({
    nome: '',
    gruposMusculares: [] as string[],
    exercicios: [] as string[],
  });
  const [editTreino, setEditTreino] = useState({
    nome: '',
    gruposMusculares: [] as string[],
    exercicios: [] as string[],
  });

  // Lista de grupos musculares disponíveis
  const gruposMusculares = [
    'Dorsais',
    'Posterior de Ombros',
    'Trapézio',
    'Lombar',
    'Peitorais',
    'Deltoide Anterior',
    'Deltoide Lateral',
    'Quadríceps',
    'Posteriores de Coxa',
    'Glúteos',
    'Panturrilhas',
    'Bíceps',
    'Antebraços',
    'Tríceps',
    'Abdominais',
    'Oblíquos'
  ];

  // Preseleções rápidas para treinos comuns
  const preselecoesRapidas = [
    {
      nome: 'Treino A - Costas/Ombros',
      grupos: ['Dorsais', 'Posterior de Ombros', 'Trapézio', 'Lombar']
    },
    {
      nome: 'Treino B - Peito/Ombros',
      grupos: ['Peitorais', 'Deltoide Anterior', 'Deltoide Lateral']
    },
    {
      nome: 'Treino C - Pernas',
      grupos: ['Quadríceps', 'Posteriores de Coxa', 'Glúteos', 'Panturrilhas']
    },
    {
      nome: 'Treino D - Braços/Abdômen',
      grupos: ['Bíceps', 'Antebraços', 'Tríceps', 'Abdominais']
    }
  ];

  const handleGrupoMuscularChange = (grupo: string) => {
    setNewTreino(prev => ({
      ...prev,
      gruposMusculares: prev.gruposMusculares.includes(grupo)
        ? prev.gruposMusculares.filter(g => g !== grupo)
        : [...prev.gruposMusculares, grupo]
    }));
  };

  const aplicarPresselecao = (grupos: string[]) => {
    setNewTreino(prev => ({
      ...prev,
      gruposMusculares: grupos
    }));
  };

  const limparSelecao = () => {
    setNewTreino(prev => ({
      ...prev,
      gruposMusculares: []
    }));
  };

  const handleCreateTreino = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTreino.gruposMusculares.length === 0) {
      alert('Selecione pelo menos um grupo muscular');
      return;
    }
    try {
      await createTreinoMutation.mutateAsync(newTreino);
      setShowCreateForm(false);
      setNewTreino({ nome: '', gruposMusculares: [], exercicios: [] });
    } catch (error) {
      console.error('Erro ao criar treino:', error);
    }
  };

  const handleDeleteTreino = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este treino?')) {
      try {
        await deleteTreinoMutation.mutateAsync(id);
      } catch (error) {
        console.error('Erro ao excluir treino:', error);
      }
    }
  };

  const handleEditTreino = (treino: Treino) => {
    setEditingTreino(treino);
    setEditTreino({
      nome: treino.nome,
      gruposMusculares: treino.gruposMusculares || [treino.grupoMuscular].filter(Boolean),
      exercicios: treino.exercicios || [],
    });
    setShowEditForm(true);
  };

  const handleUpdateTreino = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTreino) return;
    if (editTreino.gruposMusculares.length === 0) {
      alert('Selecione pelo menos um grupo muscular');
      return;
    }
    try {
      await updateTreinoMutation.mutateAsync({
        id: editingTreino._id,
        treino: editTreino,
      });
      setShowEditForm(false);
      setEditingTreino(null);
      setEditTreino({ nome: '', gruposMusculares: [], exercicios: [] });
    } catch (error) {
      console.error('Erro ao atualizar treino:', error);
    }
  };

  const handleEditGrupoMuscularChange = (grupo: string) => {
    setEditTreino(prev => ({
      ...prev,
      gruposMusculares: prev.gruposMusculares.includes(grupo)
        ? prev.gruposMusculares.filter(g => g !== grupo)
        : [...prev.gruposMusculares, grupo]
    }));
  };

  const aplicarPresselecaoEdit = (grupos: string[]) => {
    setEditTreino(prev => ({
      ...prev,
      gruposMusculares: grupos
    }));
  };

  const limparSelecaoEdit = () => {
    setEditTreino(prev => ({
      ...prev,
      gruposMusculares: []
    }));
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
              Erro ao carregar treinos
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Treinos</h1>
          <p className="mt-1 text-sm sm:text-base text-gray-600">
            Gerencie seus treinos e rotinas de exercícios
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full sm:w-auto"
        >
          <span className="mr-2">+</span>
          Criar Treino
        </button>
      </div>

      {/* Form de criação */}
      {showCreateForm && (
        <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 border border-gray-200">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-indigo-600 font-semibold">🏋️</span>
              </div>
            </div>
            <div className="ml-3">
              <h2 className="text-xl font-semibold text-gray-900">Novo Treino</h2>
              <p className="text-sm text-gray-500">Crie um novo treino personalizado</p>
            </div>
          </div>
          <form onSubmit={handleCreateTreino} className="space-y-6">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Treino
              </label>
              <input
                type="text"
                id="nome"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Ex: Treino de Peito"
                value={newTreino.nome}
                onChange={(e) => setNewTreino({ ...newTreino, nome: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Grupos Musculares
              </label>
              
              {/* Preseleções rápidas */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-600 mb-2">Preseleções rápidas:</p>
                <div className="flex flex-wrap gap-2">
                  {preselecoesRapidas.map((preseleção) => (
                    <button
                      key={preseleção.nome}
                      type="button"
                      onClick={() => aplicarPresselecao(preseleção.grupos)}
                      className="px-3 py-1 text-xs font-medium rounded-full border border-indigo-300 text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {preseleção.nome}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={limparSelecao}
                    className="px-3 py-1 text-xs font-medium rounded-full border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Limpar
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {gruposMusculares.map((grupo) => (
                  <label key={grupo} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newTreino.gruposMusculares.includes(grupo)}
                      onChange={() => handleGrupoMuscularChange(grupo)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{grupo}</span>
                  </label>
                ))}
              </div>
              {newTreino.gruposMusculares.length > 0 && (
                <div className="mt-3 p-3 bg-indigo-50 rounded-md">
                  <p className="text-sm font-medium text-indigo-800 mb-1">
                    Grupos selecionados ({newTreino.gruposMusculares.length}):
                  </p>
                  <p className="text-sm text-indigo-700">
                    {newTreino.gruposMusculares.join(', ')}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={createTreinoMutation.isPending}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {createTreinoMutation.isPending ? 'Criando...' : 'Criar Treino'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Form de edição */}
      {showEditForm && editingTreino && (
        <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 border border-gray-200">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 font-semibold">✏️</span>
              </div>
            </div>
            <div className="ml-3">
              <h2 className="text-xl font-semibold text-gray-900">Editar Treino</h2>
              <p className="text-sm text-gray-500">Modifique as informações do treino</p>
            </div>
          </div>
          <form onSubmit={handleUpdateTreino} className="space-y-6">
            <div>
              <label htmlFor="edit-nome" className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Treino
              </label>
              <input
                type="text"
                id="edit-nome"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                placeholder="Ex: Treino de Peito"
                value={editTreino.nome}
                onChange={(e) => setEditTreino({ ...editTreino, nome: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Grupos Musculares
              </label>
              
              {/* Preseleções rápidas */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-600 mb-2">Preseleções rápidas:</p>
                <div className="flex flex-wrap gap-2">
                  {preselecoesRapidas.map((preseleção) => (
                    <button
                      key={preseleção.nome}
                      type="button"
                      onClick={() => aplicarPresselecaoEdit(preseleção.grupos)}
                      className="px-3 py-1 text-xs font-medium rounded-full border border-orange-300 text-orange-700 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      {preseleção.nome}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={limparSelecaoEdit}
                    className="px-3 py-1 text-xs font-medium rounded-full border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Limpar
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {gruposMusculares.map((grupo) => (
                  <label key={grupo} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editTreino.gruposMusculares.includes(grupo)}
                      onChange={() => handleEditGrupoMuscularChange(grupo)}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{grupo}</span>
                  </label>
                ))}
              </div>
              {editTreino.gruposMusculares.length > 0 && (
                <div className="mt-3 p-3 bg-orange-50 rounded-md">
                  <p className="text-sm font-medium text-orange-800 mb-1">
                    Grupos selecionados ({editTreino.gruposMusculares.length}):
                  </p>
                  <p className="text-sm text-orange-700">
                    {editTreino.gruposMusculares.join(', ')}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setShowEditForm(false);
                  setEditingTreino(null);
                  setEditTreino({ nome: '', gruposMusculares: [], exercicios: [] });
                }}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={updateTreinoMutation.isPending}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
              >
                {updateTreinoMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de treinos */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {treinos?.length > 0 ? (
            treinos.map((treino: Treino) => (
              <li key={treino._id}>
                <div className="px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium">
                        🏋️
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <Link
                          to={`/treinos/${treino._id}`}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          {treino.nome}
                        </Link>
                      </div>
                      <div className="flex flex-wrap items-center gap-1 mt-1">
                        {/* Exibe grupos musculares múltiplos ou o único grupo antigo */}
                        {(treino.gruposMusculares || [treino.grupoMuscular].filter(Boolean)).map((grupo, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                          >
                            {grupo}
                          </span>
                        ))}
                        <span className="ml-2 text-xs text-gray-500">
                          {treino.exercicios?.length || 0} exercícios
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2 w-full sm:w-auto">
                    <Link
                      to={`/treinos/${treino._id}`}
                      className="inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Ver Detalhes
                    </Link>
                    <button
                      onClick={() => handleEditTreino(treino)}
                      className="inline-flex items-center justify-center px-3 py-1.5 border border-orange-300 text-xs font-medium rounded text-orange-700 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteTreino(treino._id)}
                      disabled={deleteTreinoMutation.isPending}
                      className="inline-flex items-center justify-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li>
              <div className="px-4 py-8 text-center">
                <div className="text-4xl mb-4">🏋️</div>
                <h3 className="text-lg font-medium text-gray-900">Nenhum treino encontrado</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Comece criando seu primeiro treino.
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Criar Primeiro Treino
                </button>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Treinos;