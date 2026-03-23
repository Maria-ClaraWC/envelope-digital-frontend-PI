import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      api.defaults.headers.Authorization = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (login, senha) => {
    try {
      const response = await api.post('/auth/login', { login, senha });
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao fazer login' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao cadastrar' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.Authorization;
    setUser(null);
  };

  // Função de login simulado para desenvolvimento/demo
  const loginSimulado = () => {
    const userSimulado = {
      id: 1,
      nome: 'Usuário Demo',
      email: 'demo@envelopedigital.com',
      cpf: '000.000.000-00'
    };
    const tokenSimulado = 'demo-token-123456';
    
    localStorage.setItem('token', tokenSimulado);
    localStorage.setItem('user', JSON.stringify(userSimulado));
    api.defaults.headers.Authorization = `Bearer ${tokenSimulado}`;
    setUser(userSimulado);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout,
      loginSimulado  // Adicionado aqui
    }}>
      {children}
    </AuthContext.Provider>
  );
};