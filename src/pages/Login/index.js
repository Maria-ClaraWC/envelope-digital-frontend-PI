// pages/Login/index.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useAuth } from '../../contexts/AuthContext';
import { masks } from '../../utils/masks';
import { validators } from '../../utils/validators';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${props => props.theme.colors.background} 0%, #D4C4B0 100%);
  padding: ${props => props.theme.spacing.xl};
`;

const LoginCard = styled.div`
  background-color: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: ${props => props.theme.spacing.xxl} ${props => props.theme.spacing.xl};
  width: 100%;
  max-width: 450px;
  box-shadow: ${props => props.theme.shadows.large};
`;

const Title = styled.h2`
  color: ${props => props.theme.colors.primary};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
  font-size: ${props => props.theme.fontSizes.xxlarge};
  font-weight: 600;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const StyledLink = styled(Link)`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-size: ${props => props.theme.fontSizes.medium};
  text-align: center;
  display: block;
  margin-top: ${props => props.theme.spacing.lg};
  
  &:hover {
    text-decoration: underline;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: ${props => props.theme.spacing.lg} 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid ${props => props.theme.colors.background};
  }
  
  span {
    margin: 0 ${props => props.theme.spacing.md};
    color: ${props => props.theme.colors.darkGray};
    font-size: ${props => props.theme.fontSizes.small};
  }
`;

const CpfLoginButton = styled(Button)`
  background-color: ${props => props.theme.colors.primary};
  margin-top: ${props => props.theme.spacing.sm};
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
`;

const DemoButton = styled(Button)`
  margin-top: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.success};
  
  &:hover {
    background-color: ${props => props.theme.colors.success}cc;
  }
`;

export const Login = () => {
  const navigate = useNavigate();
  const { login, loginSimulado } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cpfLogin, setCpfLogin] = useState('');
  const [cpfLoading, setCpfLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    try {
      await login(data);
      navigate('/home');
    } catch (err) {
      setError('Credenciais inválidas. Tente novamente.');
    } finally {
      setLoading(false);
    }
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      loginSimulado();
      navigate('/home');
    } catch (err) {
      setError('CPF não encontrado. Faça o cadastro primeiro.');
    } finally {
      setCpfLoading(false);
    }
  };

  const handleDemoAccess = () => {
    loginSimulado();
    navigate('/home');
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
            label="Email"
            placeholder="seu@email.com"
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

        <DemoButton type="button" fullWidth onClick={handleDemoAccess} outline>
          ⚡ Acesso Rápido (Demonstração)
        </DemoButton>

        <StyledLink to="/register">
          Não tem uma conta? Cadastre-se
        </StyledLink>
      </LoginCard>
    </Container>
  );
};