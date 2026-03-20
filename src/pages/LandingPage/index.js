import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.xl};
`;

const Content = styled.div`
  max-width: 800px;
  width: 100%;
  text-align: center;
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontSizes.xxlarge};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
  font-weight: 700;
`;

const Subtitle = styled.h2`
  font-size: ${props => props.theme.fontSizes.large};
  color: ${props => props.theme.colors.darkGray};
  margin-bottom: ${props => props.theme.spacing.xl};
  font-weight: 400;
`;

const TruckImage = styled.div`
  margin: ${props => props.theme.spacing.xl} 0;
  font-size: 8rem;
  color: ${props => props.theme.colors.primary};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: center;
  flex-wrap: wrap;
`;

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Content>
        <Title>Bem-vindo ao Gestão de Viagens</Title>
        <Subtitle>Controle todas as suas viagens de forma simples e eficiente</Subtitle>
        
        <TruckImage>
          🚛
        </TruckImage>

        <ButtonContainer>
          <Button onClick={() => navigate('/login')}>
            Login
          </Button>
          <Button outline onClick={() => navigate('/register')}>
            Criar Conta
          </Button>
        </ButtonContainer>
      </Content>
    </Container>
  );
};