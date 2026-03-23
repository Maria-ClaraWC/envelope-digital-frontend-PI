// pages/Login/index.js - Parte relevante
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useAuth } from '../../contexts/AuthContext';
import { masks } from '../../utils/masks';
import { validators } from '../../utils/validators';

// ... (restante dos estilos)

export const Login = () => {
  const navigate = useNavigate();
  const { login, loginSimulado } = useAuth(); // Certifique-se de importar loginSimulado
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cpfLogin, setCpfLogin] = useState('');
  const [cpfLoading, setCpfLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    const result = await login(data.login, data.senha);
    
    if (result.success) {
      navigate('/home');
    } else {
      setError(result.error || 'Credenciais inválidas. Tente novamente.');
    }
    
    setLoading(false);
  };

  const handleCpfLogin = async () => {
    if (!cpfLogin) {
      setError('Digite um CPF válido');
      return;
    }
    
    const cpfLimpo = cpfLogin.replace(/\D/g, '');
    if (!validators.isValidCPF(cpfLimpo)) {
      setError('CPF inválido');
      return;
    }
    
    setCpfLoading(true);
    setError('');
    
    try {
      // Tentar login com CPF
      const result = await login(cpfLimpo, '123456'); // senha padrão para demo
      
      if (result.success) {
        navigate('/home');
      } else {
        setError('CPF não encontrado. Faça o cadastro primeiro.');
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setCpfLoading(false);
    }
  };

  const handleDemoAccess = () => {
    if (loginSimulado) {
      loginSimulado();
      navigate('/home');
    } else {
      console.error('loginSimulado não disponível');
      // Fallback para login padrão
      onSubmit({ login: 'demo@demo.com', senha: '123456' });
    }
  };

  const handleCpfChange = (e) => {
    setCpfLogin(masks.cpf(e.target.value));
  };

  return (
    <Container>
      <LoginCard>
        <Title>Login</Title>
        
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email ou CPF"
            placeholder="seu@email.com ou 000.000.000-00"
            {...register('login', { 
              required: 'Campo obrigatório' 
            })}
            error={errors.login?.message}
          />

          <Input
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
            {...register('senha', { 
              required: 'Campo obrigatório'
            })}
            error={errors.senha?.message}
          />

          {error && (
            <span style={{ color: '#FF6B6B', fontSize: '0.875rem', textAlign: 'center' }}>
              {error}
            </span>
          )}

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </Form>

        <Divider>
          <span>ou</span>
        </Divider>

        <Input
          label="Login com CPF"
          placeholder="000.000.000-00"
          value={cpfLogin}
          onChange={handleCpfChange}
        />
        <CpfLoginButton 
          type="button" 
          fullWidth 
          onClick={handleCpfLogin}
          disabled={cpfLoading}
        >
          {cpfLoading ? 'Verificando...' : '🔑 Entrar com CPF'}
        </CpfLoginButton>

        <DemoButton type="button" fullWidth onClick={handleDemoAccess}>
          ⚡ Acesso Rápido (Demonstração)
        </DemoButton>

        <StyledLink to="/register">
          Não tem uma conta? Cadastre-se
        </StyledLink>
      </LoginCard>
    </Container>
  );
};