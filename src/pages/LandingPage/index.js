import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { useAuth } from '../../contexts/AuthContext';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${props => props.theme.colors.background} 0%, #D4C4B0 100%);
  padding: ${props => props.theme.spacing.xl};
`;

const Content = styled.div`
  max-width: 500px;
  width: 100%;
  text-align: center;
  background-color: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: ${props => props.theme.spacing.xxl} ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.large};
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
  font-weight: 700;
  letter-spacing: -0.5px;
`;

const TruckIcon = styled.div`
  font-size: 5rem;
  margin: ${props => props.theme.spacing.xl} 0;
  color: ${props => props.theme.colors.primary};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: center;
  flex-wrap: wrap;
  margin-top: ${props => props.theme.spacing.xl};
`;

const DemoBadge = styled.div`
  margin-top: ${props => props.theme.spacing.lg};
  padding: ${props => props.theme.spacing.sm};
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 0.75rem;
  color: ${props => props.theme.colors.darkGray};
`;

export const LandingPage = () => {
  const navigate = useNavigate();
  const { loginSimulado } = useAuth();

  const acessoRapido = () => {
    loginSimulado();
    navigate('/home');
  };

  return (
    <Container>
      <Content>
        <Title>Envelope Digital</Title>
        <TruckIcon>🚛</TruckIcon>
        <ButtonContainer>
          <Button onClick={() => navigate('/register')}>
            Cadastrar
          </Button>
          <Button outline onClick={() => navigate('/login')}>
            Login
          </Button>
        </ButtonContainer>
        <DemoBadge>
          🔧 Modo de demonstração - Clique em "Login" e use o acesso rápido
        </DemoBadge>
      </Content>
    </Container>
  );
};