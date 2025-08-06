import React, { useState } from 'react';
import { useExercicios, useCreateExercicio } from '../services/api';
import type { Exercicio } from '../services/api';

const Exercicios: React.FC = () => {
  const { data: exercicios, isLoading, error } = useExercicios();
  const createExercicioMutation = useCreateExercicio();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newExercicio, setNewExercicio] = useState({
    nome: '',
    series: 3,
    tecnica: '',
    urlVideo: '',
    grupoMuscular: '',
  });

  const handleCreateExercicio = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createExercicioMutation.mutateAsync(newExercicio);
      setShowCreateForm(false);
      setNewExercicio({
        nome: '',
        series: 3,
        tecnica: '',
        urlVideo: '',
        grupoMuscular: '',
      });
    } catch (error) {
      console.error('Erro ao criar exercício:', error);
    }
  };

  // Função para extrair ID do vídeo do YouTube
  const getYouTubeVideoId = (url: string | undefined) => {
    if (!url || typeof url !== 'string') {
      return null;
    }
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
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
              Erro ao carregar exercícios
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Exercícios</h1>
          <p className="mt-1 text-sm sm:text-base text-gray-600">
            Catálogo de exercícios com vídeos demonstrativos
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full sm:w-auto"
        >
          <span className="mr-2">+</span>
          Novo Exercício
        </button>
      </div>

      {/* Form de criação */}
      {showCreateForm && (
        <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 border border-gray-200">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-indigo-600 font-semibold">💪</span>
              </div>
            </div>
            <div className="ml-3">
              <h2 className="text-xl font-semibold text-gray-900">Novo Exercício</h2>
              <p className="text-sm text-gray-500">Adicione um novo exercício ao banco de dados</p>
            </div>
          </div>
          <form onSubmit={handleCreateExercicio} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Exercício
                </label>
                <input
                  type="text"
                  id="nome"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Ex: Supino Reto"
                  value={newExercicio.nome}
                  onChange={(e) => setNewExercicio({ ...newExercicio, nome: e.target.value })}
                />
              </div>
              
              <div>
                <label htmlFor="grupoMuscular" className="block text-sm font-medium text-gray-700 mb-2">
                  Grupo Muscular
                </label>
                <select
                  id="grupoMuscular"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={newExercicio.grupoMuscular}
                  onChange={(e) => setNewExercicio({ ...newExercicio, grupoMuscular: e.target.value })}
                >
                  <option value="">Selecione um grupo muscular</option>
                  <option value="Peito">Peito</option>
                  <option value="Costas">Costas</option>
                  <option value="Pernas">Pernas</option>
                  <option value="Ombros">Ombros</option>
                  <option value="Braços">Braços</option>
                  <option value="Abdome">Abdome</option>
                  <option value="Cardio">Cardio</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="series" className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Séries
                </label>
                <input
                  type="number"
                  id="series"
                  min="1"
                  max="10"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={newExercicio.series}
                  onChange={(e) => setNewExercicio({ ...newExercicio, series: parseInt(e.target.value) })}
                />
              </div>

              <div>
                <label htmlFor="urlVideo" className="block text-sm font-medium text-gray-700 mb-2">
                  URL do Vídeo (YouTube)
                </label>
                <input
                  type="url"
                  id="urlVideo"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={newExercicio.urlVideo}
                  onChange={(e) => setNewExercicio({ ...newExercicio, urlVideo: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="tecnica" className="block text-sm font-medium text-gray-700 mb-2">
                Técnica / Instruções
              </label>
              <textarea
                id="tecnica"
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-vertical"
                placeholder="Descreva a técnica correta para executar o exercício..."
                value={newExercicio.tecnica}
                onChange={(e) => setNewExercicio({ ...newExercicio, tecnica: e.target.value })}
              />
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
                disabled={createExercicioMutation.isPending}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {createExercicioMutation.isPending ? 'Criando...' : 'Criar Exercício'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de exercícios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {exercicios?.length > 0 ? (
          exercicios.map((exercicio: Exercicio) => {
            const videoId = getYouTubeVideoId(exercicio.urlVideo);
            
            return (
              <div key={exercicio._id} className="bg-white shadow rounded-lg overflow-hidden">
                {/* Vídeo do YouTube */}
                {videoId && (
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={exercicio.nome}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-48"
                    />
                  </div>
                )}
                
                {/* Conteúdo */}
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{exercicio.nome}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 self-start">
                      {exercicio.grupoMuscular}
                    </span>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {exercicio.series} séries
                    </span>
                  </div>

                  {exercicio.tecnica && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Técnica:</h4>
                      <p className="text-sm text-gray-600">{exercicio.tecnica}</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-xs text-gray-500">
                    <span>
                      Criado em {new Date(exercicio.criadoEm).toLocaleDateString('pt-BR')}
                    </span>
                    {exercicio.urlVideo && !videoId && (
                      <a
                        href={exercicio.urlVideo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-500 self-start"
                      >
                        Ver Vídeo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 text-center py-12">
            <div className="text-4xl mb-4">💪</div>
            <h3 className="text-lg font-medium text-gray-900">Nenhum exercício encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              Comece criando seu primeiro exercício.
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Criar Primeiro Exercício
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Exercicios;