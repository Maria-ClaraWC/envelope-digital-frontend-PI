import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('@App:user');
    const storedToken = localStorage.getItem('@App:token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      api.defaults.headers.Authorization = `Bearer ${storedToken}`;
    }
    
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { user, token } = response.data;

      localStorage.setItem('@App:user', JSON.stringify(user));
      localStorage.setItem('@App:token', token);
      
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(user);
      
      return user;
    } catch (error) {
      throw new Error('Falha na autenticação');
    }
  };

  // NOVA FUNÇÃO: Login simulado para testes
  const loginSimulado = () => {
    const usuarioTeste = {
      id: 1,
      nome: 'Usuário Teste',
      email: 'teste@teste.com',
      cpf: '123.456.789-00'
    };
    
    const tokenSimulado = 'token_simulado_para_testes';
    
    localStorage.setItem('@App:user', JSON.stringify(usuarioTeste));
    localStorage.setItem('@App:token', tokenSimulado);
    
    setUser(usuarioTeste);
    
    return usuarioTeste;
  };

  const logout = () => {
    localStorage.removeItem('@App:user');
    localStorage.removeItem('@App:token');
    delete api.defaults.headers.Authorization;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, loginSimulado, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};