import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import InputMask from 'inputmask';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { masks } from '../../utils/masks';
import { validators } from '../../utils/validators';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.xl};
`;

const RegisterCard = styled.div`
  background-color: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: ${props => props.theme.spacing.xl};
  width: 100%;
  max-width: 500px;
  box-shadow: ${props => props.theme.shadows.large};
`;

const Title = styled.h2`
  color: ${props => props.theme.colors.primary};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
  font-size: ${props => props.theme.fontSizes.xlarge};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const StyledLink = styled(Link)`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-size: ${props => props.theme.fontSizes.small};
  text-align: center;
  margin-top: ${props => props.theme.spacing.md};
  
  &:hover {
    text-decoration: underline;
  }
`;

export const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('senha');

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      // Aqui vai a chamada para a API
      console.log('Dados do cadastro:', data);
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate('/login');
    } catch (error) {
      console.error('Erro no cadastro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <RegisterCard>
        <Title>Criar Conta</Title>
        
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Nome Completo"
            placeholder="Digite seu nome completo"
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
            label="CNH"
            placeholder="Digite sua CNH"
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
            label="Placa do Caminhão"
            placeholder="AAA-0000"
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
            label="E-mail"
            type="email"
            placeholder="Digite seu e-mail"
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
            type="password"
            placeholder="Digite sua senha"
            {...register('senha', { 
              required: 'Senha é obrigatória',
              minLength: {
                value: 8,
                message: 'A senha deve ter no mínimo 8 caracteres'
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: 'A senha deve conter maiúscula, minúscula e número'
              }
            })}
            error={errors.senha?.message}
          />

          <Input
            label="Confirmar Senha"
            type="password"
            placeholder="Confirme sua senha"
            {...register('confirmSenha', { 
              required: 'Confirmação de senha é obrigatória',
              validate: value => 
                value === password || 'As senhas não coincidem'
            })}
            error={errors.confirmSenha?.message}
          />

          <Button 
            type="submit" 
            fullWidth 
            disabled={loading}
            style={{ marginTop: '1rem' }}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
        </Form>

        <StyledLink to="/login">
          Já tem uma conta? Faça login
        </StyledLink>
      </RegisterCard>
    </Container>
  );
};