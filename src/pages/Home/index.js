import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';

const Container = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
`;

const Content = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
`;

const AddViagemSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xxl};
`;

const AddCard = styled(Card)`
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    background-color: ${props => props.theme.colors.primary}10;
  }
`;

const PlusIcon = styled(FaPlus)`
  font-size: 4rem;
  color: ${props => props.theme.colors.primary};
`;

const AddText = styled.p`
  margin-top: ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.fontSizes.large};
  color: ${props => props.theme.colors.darkGray};
  font-weight: 500;
`;

const Divider = styled.hr`
  border: none;
  border-top: 2px solid ${props => props.theme.colors.primary}40;
  margin: ${props => props.theme.spacing.xl} 0;
`;

const ViagensAnteriores = styled.section`
  h2 {
    color: ${props => props.theme.colors.primary};
    margin-bottom: ${props => props.theme.spacing.lg};
    font-size: ${props => props.theme.fontSizes.xlarge};
  }
`;

const ViagensGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const ViagemCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const ViagemData = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${props => props.theme.fontSizes.medium};
`;

const ViagemLocal = styled.div`
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
  margin: ${props => props.theme.spacing.xs} 0;
`;

const ViagemPeriodo = styled.div`
  color: ${props => props.theme.colors.darkGray};
  font-size: ${props => props.theme.fontSizes.small};
`;

export const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [viagens, setViagens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarViagens();
  }, []);

  const carregarViagens = async () => {
    try {
      const response = await api.get('/viagens');
      setViagens(response.data);
    } catch (error) {
      console.error('Erro ao carregar viagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  return (
    <Container>
      <Header />
      
      <Content>
        <AddViagemSection>
          <AddCard onClick={() => navigate('/nova-viagem')}>
            <PlusIcon />
          </AddCard>
          <AddText>Adicionar Nova Viagem</AddText>
        </AddViagemSection>

        <Divider />

        <ViagensAnteriores>
          <h2>Viagens Anteriores</h2>
          
          {loading ? (
            <p>Carregando...</p>
          ) : (
            <ViagensGrid>
              {viagens.map(viagem => (
                <ViagemCard 
                  key={viagem.id}
                  onClick={() => navigate(`/viagem/${viagem.id}`)}
                >
                  <ViagemLocal>
                    {viagem.cidade_saida} → {viagem.cidade_chegada}
                  </ViagemLocal>
                  
                  <ViagemPeriodo>
                    {formatarData(viagem.data_entrada)} - {formatarData(viagem.data_chegada)}
                  </ViagemPeriodo>
                  
                  <ViagemData>
                    <span>KM: {viagem.km_saida} - {viagem.km_entrada}</span>
                    <span>Peso: {viagem.peso_saida}t</span>
                  </ViagemData>
                </ViagemCard>
              ))}
            </ViagensGrid>
          )}
        </ViagensAnteriores>
      </Content>
    </Container>
  );
};