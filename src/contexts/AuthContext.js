// src/contexts/AuthContext.js
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
      console.error('Erro no login:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao fazer login' 
      };
    }
  };

  const register = async (userData) => {
    try {
      // Mapear os campos para o que o back-end espera
      const payload = {
        nome: userData.nome,
        cpf: userData.cpf,
        cnh: userData.cnh,
        placa: userData.placa,
        email: userData.email,
        senha: userData.senha
      };
      
      const response = await api.post('/auth/register', payload);
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(user);
      
      return { success: true };
    } catch (error) {
      console.error('Erro no registro:', error);
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

  // Login de demonstração (apenas para teste)
  const loginSimulado = () => {
    // Tenta fazer login com credenciais de demonstração
    login('demo@envelopedigital.com', '123456');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout,
      loginSimulado
    }}>
      {children}
    </AuthContext.Provider>
  );
};