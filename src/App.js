// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { GlobalStyle } from './styles/global';
import { theme } from './styles/theme';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { NovaViagem } from './pages/NovaViagem';
import PesquisarViagens from './pages/PesquisarViagens';
import DetalhesViagem from './pages/DetalhesViagem';
import EditarViagem from './pages/EditarViagem';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Carregando...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/home" 
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/nova-viagem" 
        element={
          <PrivateRoute>
            <NovaViagem />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/pesquisar-viagens" 
        element={
          <PrivateRoute>
            <PesquisarViagens />
          </PrivateRoute>
        } 

        
      />

      
      <Route 
  path="/viagem/editar/:id" 
  element={
    <PrivateRoute>
      <EditarViagem />
    </PrivateRoute>
  } 
/>
      <Route 
        path="/viagem/:id" 
        element={
          <PrivateRoute>
            <DetalhesViagem />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AuthProvider>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;