import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = 'http://localhost:8000/api';

// Função auxiliar para fazer requisições
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('pandafit_token');

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    throw new Error(`Erro ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

// ================== TREINOS ==================

export interface Treino {
  _id: string;
  nome: string;
  grupoMuscular?: string; // Para compatibilidade com treinos antigos
  gruposMusculares?: string[]; // Nova propriedade para múltiplos grupos
  exercicios: string[];
  criadoEm: string;
}

export const useTreinos = () => {
  return useQuery({
    queryKey: ['treinos'],
    queryFn: () => apiRequest('/treinos'),
  });
};

export const useTreino = (id: string) => {
  return useQuery({
    queryKey: ['treino', id],
    queryFn: () => apiRequest(`/treinos/${id}`),
    enabled: !!id,
  });
};

export const useCreateTreino = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (treino: Omit<Treino, '_id' | 'criadoEm'>) =>
      apiRequest('/treinos', {
        method: 'POST',
        body: JSON.stringify(treino),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treinos'] });
    },
  });
};

export const useUpdateTreino = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, treino }: { id: string; treino: Partial<Treino> }) =>
      apiRequest(`/treinos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(treino),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treinos'] });
    },
  });
};

export const useDeleteTreino = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/treinos/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treinos'] });
    },
  });
};

// ================== EXERCÍCIOS ==================

export interface Exercicio {
  _id: string;
  nome: string;
  series: number;
  tecnica: string;
  urlVideo?: string;
  grupoMuscular: string;
  criadoEm: string;
}

export const useExercicios = () => {
  return useQuery({
    queryKey: ['exercicios'],
    queryFn: () => apiRequest('/exercicios'),
  });
};

export const useExercicio = (id: string) => {
  return useQuery({
    queryKey: ['exercicio', id],
    queryFn: () => apiRequest(`/exercicios/${id}`),
    enabled: !!id,
  });
};

export const useCreateExercicio = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (exercicio: Omit<Exercicio, '_id' | 'criadoEm'>) =>
      apiRequest('/exercicios', {
        method: 'POST',
        body: JSON.stringify(exercicio),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercicios'] });
    },
  });
};

export const useUpdateExercicio = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, exercicio }: { id: string; exercicio: Partial<Exercicio> }) =>
      apiRequest(`/exercicios/${id}`, {
        method: 'PUT',
        body: JSON.stringify(exercicio),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercicios'] });
    },
  });
};

export const useDeleteExercicio = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/exercicios/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercicios'] });
    },
  });
};

// ================== DIETA ==================

export interface Alimento {
  nome: string;
  quantidade: string;
  calorias: number;
}

export interface Refeicao {
  _id: string;
  nome: string;
  horario: string;
  alimentos: Alimento[];
  criadoEm: string;
}

export const useDieta = () => {
  return useQuery({
    queryKey: ['dieta'],
    queryFn: () => apiRequest('/dieta'),
  });
};

export const useCreateRefeicao = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (refeicao: Omit<Refeicao, '_id' | 'criadoEm'>) =>
      apiRequest('/dieta', {
        method: 'POST',
        body: JSON.stringify(refeicao),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dieta'] });
    },
  });
};

// ================== HISTÓRICO ==================

export interface HistoricoItem {
  _id: string;
  tipo: 'treino' | 'refeicao';
  referencia: string; // ID do treino ou refeição
  nomeItem: string;
  dataFeito: string;
  criadoEm: string;
}

export const useHistorico = (filtros?: { tipo?: string; data?: string }) => {
  return useQuery({
    queryKey: ['historico', filtros],
    queryFn: () => {
      const params = new URLSearchParams();
      if (filtros?.tipo) params.append('tipo', filtros.tipo);
      if (filtros?.data) params.append('data', filtros.data);
      
      const queryString = params.toString();
      return apiRequest(`/historico${queryString ? `?${queryString}` : ''}`);
    },
  });
};

export const useMarcarComoFeito = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (item: { tipo: 'treino' | 'refeicao'; referencia: string; nomeItem: string }) =>
      apiRequest('/historico', {
        method: 'POST',
        body: JSON.stringify({
          ...item,
          dataFeito: new Date().toISOString(),
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['historico'] });
    },
  });
};

// ================== CONFIGURAÇÕES ==================

export const useResetBanco = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () =>
      apiRequest('/reset', {
        method: 'POST',
      }),
    onSuccess: () => {
      // Invalidar todas as queries após reset
      queryClient.invalidateQueries();
    },
  });
};

// ================== DASHBOARD ==================

export const useDashboardData = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const [treinos, historico] = await Promise.all([
        apiRequest('/treinos'),
        apiRequest('/historico'),
      ]);

      // Filtrar últimos treinos e refeições do histórico
      const ultimosTreinos = historico
        .filter((item: any) => item.tipo === 'treino')
        .slice(0, 3);
        
      const ultimasRefeicoes = historico
        .filter((item: any) => item.tipo === 'refeicao')
        .slice(0, 3);

      return {
        totalTreinos: treinos.length,
        ultimosTreinos,
        ultimasRefeicoes,
      };
    },
  });
};