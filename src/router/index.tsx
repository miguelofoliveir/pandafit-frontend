import React, { ComponentType } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePreloadCommonRoutes } from '../hooks/usePreloadRoute';

// Função auxiliar para criar lazy imports com retry
const lazyWithRetry = (factory: () => Promise<{ default: ComponentType<any> }>) => {
  return React.lazy(() =>
    factory().catch((error) => {
      console.warn('Erro no lazy loading, tentando novamente...', error);
      // Retry após um pequeno delay
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(factory());
        }, 500);
      });
    })
  );
};

// Componente para proteger rotas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Layout principal com navegação
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  // Preload das rotas mais comuns para melhorar a experiência
  usePreloadCommonRoutes();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b w-full">
        <div className="w-full max-w-none mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">🐼 PandaFit</h1>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-gray-700 text-sm sm:text-base">Olá, {user?.nome}</span>
              <button
                onClick={logout}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sair
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-md"
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b w-full">
        {/* Desktop Navigation */}
        <div className="hidden md:block w-full max-w-none mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex space-x-8">
            <Link
              to="/"
              className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-12"
            >
              Dashboard
            </Link>
            <Link
              to="/treinos"
              className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-12"
            >
              Treinos
            </Link>
            <Link
              to="/exercicios"
              className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-12"
            >
              Exercícios
            </Link>
            <Link
              to="/dieta"
              className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-12"
            >
              Dieta
            </Link>
            <Link
              to="/historico"
              className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-12"
            >
              Histórico
            </Link>
            <Link
              to="/configuracoes"
              className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-12"
            >
              Configurações
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                📊 Dashboard
              </Link>
              <Link
                to="/treinos"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                🏋️ Treinos
              </Link>
              <Link
                to="/exercicios"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                💪 Exercícios
              </Link>
              <Link
                to="/dieta"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                🍽️ Dieta
              </Link>
              <Link
                to="/historico"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                📜 Histórico
              </Link>
              <Link
                to="/configuracoes"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                ⚙️ Configurações
              </Link>
              
              {/* Mobile user info and logout */}
              <div className="border-t pt-4 mt-4">
                <div className="px-3 py-2">
                  <p className="text-sm text-gray-500">Olá, {user?.nome}</p>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  🚪 Sair
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="w-full max-w-none mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-4 sm:py-6 lg:py-8">
        <div className="max-w-8xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

// Error Boundary para capturar erros de lazy loading
class LazyLoadErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Erro no lazy loading:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Erro ao carregar página
            </h2>
            <p className="text-gray-600 mb-4">
              Houve um problema ao carregar a página. Tente recarregar.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Recarregar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Componente principal do roteador
const AppRouter: React.FC = () => {
  // Lazy loading das páginas com retry
  const Login = lazyWithRetry(() => import('../pages/Login'));
  const Dashboard = lazyWithRetry(() => import('../pages/Dashboard'));
  const Treinos = lazyWithRetry(() => import('../pages/Treinos'));
  const TreinoDetalhe = lazyWithRetry(() => import('../pages/TreinoDetalhe'));
  const Exercicios = lazyWithRetry(() => import('../pages/Exercicios'));
  const Dieta = lazyWithRetry(() => import('../pages/Dieta'));
  const Historico = lazyWithRetry(() => import('../pages/Historico'));
  const Configuracoes = lazyWithRetry(() => import('../pages/Configuracoes'));

  return (
    <BrowserRouter>
      <LazyLoadErrorBoundary>
        <React.Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando página...</p>
            </div>
          </div>
        }>
          <Routes>
          {/* Rota de login (não protegida) */}
          <Route path="/login" element={<Login />} />
          
          {/* Rotas protegidas */}
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/treinos" element={
            <ProtectedRoute>
              <MainLayout>
                <Treinos />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/treinos/:id" element={
            <ProtectedRoute>
              <MainLayout>
                <TreinoDetalhe />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/exercicios" element={
            <ProtectedRoute>
              <MainLayout>
                <Exercicios />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/dieta" element={
            <ProtectedRoute>
              <MainLayout>
                <Dieta />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/historico" element={
            <ProtectedRoute>
              <MainLayout>
                <Historico />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/configuracoes" element={
            <ProtectedRoute>
              <MainLayout>
                <Configuracoes />
              </MainLayout>
            </ProtectedRoute>
          } />
          
            {/* Redirect para dashboard se rota não encontrada */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </React.Suspense>
      </LazyLoadErrorBoundary>
    </BrowserRouter>
  );
};

export default AppRouter;