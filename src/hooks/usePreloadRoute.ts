import { useEffect } from 'react';

// Hook para preload de rotas específicas
export const usePreloadRoute = (routeName: string) => {
  useEffect(() => {
    const preloadRoute = async () => {
      try {
        switch (routeName) {
          case 'dashboard':
            await import('../pages/Dashboard');
            break;
          case 'treinos':
            await import('../pages/Treinos');
            break;
          case 'exercicios':
            await import('../pages/Exercicios');
            break;
          case 'dieta':
            await import('../pages/Dieta');
            break;
          case 'historico':
            await import('../pages/Historico');
            break;
          case 'configuracoes':
            await import('../pages/Configuracoes');
            break;
          case 'treino-detalhe':
            await import('../pages/TreinoDetalhe');
            break;
          default:
            break;
        }
      } catch (error) {
        console.warn(`Erro ao fazer preload da rota ${routeName}:`, error);
      }
    };

    // Fazer preload após um pequeno delay para não interferir com a renderização inicial
    const timeoutId = setTimeout(preloadRoute, 1000);

    return () => clearTimeout(timeoutId);
  }, [routeName]);
};

// Hook para preload de múltiplas rotas comuns
export const usePreloadCommonRoutes = () => {
  useEffect(() => {
    const preloadCommonRoutes = async () => {
      try {
        // Preload das rotas mais comumente acessadas
        await Promise.all([
          import('../pages/Dashboard'),
          import('../pages/Treinos'),
          import('../pages/Exercicios'),
        ]);
      } catch (error) {
        console.warn('Erro ao fazer preload das rotas comuns:', error);
      }
    };

    // Fazer preload após 2 segundos para não interferir com a navegação inicial
    const timeoutId = setTimeout(preloadCommonRoutes, 2000);

    return () => clearTimeout(timeoutId);
  }, []);
};