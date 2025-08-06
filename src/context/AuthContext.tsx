import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  nome: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userId: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Verificar se existe token no localStorage ao inicializar
    const savedToken = localStorage.getItem('pandafit_token');
    const savedUser = localStorage.getItem('pandafit_user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (userId: string, password: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: userId, senha: password }),
      });

      if (!response.ok) {
        throw new Error('Credenciais inválidas');
      }

      const data = await response.json();
      
      // Token mockado para desenvolvimento
      const mockToken = `mock_token_${userId}_${Date.now()}`;
      const userData = { id: userId, nome: data.nome || `Usuário ${userId}` };

      setToken(mockToken);
      setUser(userData);

      // Salvar no localStorage
      localStorage.setItem('pandafit_token', mockToken);
      localStorage.setItem('pandafit_user', JSON.stringify(userData));
    } catch (error) {
      throw new Error('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('pandafit_token');
    localStorage.removeItem('pandafit_user');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};