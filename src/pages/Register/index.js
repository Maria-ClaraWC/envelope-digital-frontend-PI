// src/pages/Register/index.js
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

const RegisterCard = styled.div`
  background-color: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: ${props => props.theme.spacing.xxl} ${props => props.theme.spacing.xl};
  width: 100%;
  max-width: 550px;
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

const PasswordToggle = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  align-self: flex-end;
  font-size: ${props => props.theme.fontSizes.small};
  margin-top: -${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.md};
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  text-align: center;
  font-size: ${props => props.theme.fontSizes.small};
  margin-top: ${props => props.theme.spacing.sm};
`;

export const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('senha');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    try {
      const result = await registerUser(data);
      
      if (result.success) {
        alert('✅ Cadastro realizado com sucesso!');
        navigate('/home');
      } else {
        setError(result.error || 'Erro ao cadastrar. Tente novamente.');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor. Verifique se o back-end está rodando.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <RegisterCard>
        <Title>Cadastro de Motorista</Title>
        
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Nome Completo"
            placeholder="Digite seu nome"
            {...register('nome', { 
              required: 'Nome é obrigatório',
              minLength: {
                value: 3,
                message: 'Nome deve ter no mínimo 3 caracteres'
              }
            })}
            error={errors.nome?.message}
          />

          <Input
            label="CPF"
            placeholder="000.000.000-00"
            {...register('cpf', { 
              required: 'CPF é obrigatório',
              validate: (value) => 
                validators.isValidCPF(value) || 'CPF inválido'
            })}
            onChange={(e) => {
              e.target.value = masks.cpf(e.target.value);
            }}
            error={errors.cpf?.message}
          />

          <Input
            label="Placa do Caminhão"
            placeholder="ABC-1234"
            {...register('placa', { 
              required: 'Placa é obrigatória',
              pattern: {
                value: /^[A-Z]{3}-\d{4}$/,
                message: 'Placa inválida (formato AAA-0000)'
              }
            })}
            onChange={(e) => {
              e.target.value = masks.placa(e.target.value);
            }}
            error={errors.placa?.message}
          />

          <Input
            label="CNH"
            placeholder="Número da CNH"
            {...register('cnh', { 
              required: 'CNH é obrigatória',
              minLength: {
                value: 11,
                message: 'CNH deve ter 11 caracteres'
              }
            })}
            error={errors.cnh?.message}
          />

          <Input
            label="Email"
            type="email"
            placeholder="seu@email.com"
            {...register('email', { 
              required: 'E-mail é obrigatório',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'E-mail inválido'
              }
            })}
            error={errors.email?.message}
          />

          <Input
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            placeholder="Digite sua senha"
            {...register('senha', { 
              required: 'Senha é obrigatória',
              minLength: {
                value: 6,
                message: 'A senha deve ter no mínimo 6 caracteres'
              }
            })}
            error={errors.senha?.message}
          />
          <PasswordToggle type="button" onClick={() => setShowPassword(prev => !prev)}>
            {showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          </PasswordToggle>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
        </Form>

        <StyledLink to="/login">
          Já tem uma conta? Fazer login
        </StyledLink>
      </RegisterCard>
    </Container>
  );
};