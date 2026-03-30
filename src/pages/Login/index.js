// src/pages/Login/index.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useAuth } from '../../contexts/AuthContext';

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

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  text-align: center;
  font-size: ${props => props.theme.fontSizes.small};
`;

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </Form>

        <StyledLink to="/register">
          Não tem uma conta? Cadastre-se
        </StyledLink>
      </LoginCard>
    </Container>
  );
};