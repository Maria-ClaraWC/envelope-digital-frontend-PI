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
  padding: ${props => props.theme.spacing.xl};
`;

const LoginCard = styled.div`
  background-color: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: ${props => props.theme.spacing.xl};
  width: 100%;
  max-width: 400px;
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
  margin-top: ${props => props.theme.spacing.sm};
  text-align: right;
  
  &:hover {
    text-decoration: underline;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin: ${props => props.theme.spacing.md} 0;
  gap: ${props => props.theme.spacing.xs};
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${props => props.theme.colors.primary};
`;

const CheckboxLabel = styled.label`
  font-size: ${props => props.theme.fontSizes.small};
  color: ${props => props.theme.colors.darkGray};
  cursor: pointer;
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
    
    try {
      await login(data);
      navigate('/home');
    } catch (err) {
      setError('Credenciais inválidas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <LoginCard>
        <Title>Login</Title>
        
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="CPF ou E-mail"
            placeholder="Digite seu CPF ou e-mail"
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
              required: 'Campo obrigatório',
              minLength: {
                value: 6,
                message: 'A senha deve ter no mínimo 6 caracteres'
              }
            })}
            error={errors.senha?.message}
          />

          <CheckboxContainer>
            <Checkbox 
              type="checkbox" 
              id="remember" 
              {...register('remember')}
            />
            <CheckboxLabel htmlFor="remember">
              Lembrar meu acesso
            </CheckboxLabel>
          </CheckboxContainer>

          <StyledLink to="/forgot-password">
            Esqueceu sua senha?
          </StyledLink>

          {error && (
            <span style={{ color: '#FF6B6B', marginTop: '1rem' }}>
              {error}
            </span>
          )}

          <Button 
            type="submit" 
            fullWidth 
            disabled={loading}
            style={{ marginTop: '1.5rem' }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </Form>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <StyledLink to="/register">
            Não tem uma conta? Cadastre-se
          </StyledLink>
        </div>
      </LoginCard>
    </Container>
  );
};