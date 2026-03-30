// src/pages/Home/index.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSearch, FaChartLine, FaTruck, FaHistory } from 'react-icons/fa';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

// ============ ESTILOS (adicione todos os estilos que estavam faltando) ============

const Container = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
`;

const Content = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xxl};
  font-size: ${props => props.theme.fontSizes.large};
  color: ${props => props.theme.colors.primary};
`;

const WelcomeSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
  text-align: center;
`;

const WelcomeTitle = styled.h1`
  font-size: ${props => props.theme.fontSizes.xxlarge};
  color: ${props => props.theme.colors.black};
  margin-bottom: ${props => props.theme.spacing.sm};
  
  span {
    color: ${props => props.theme.colors.primary};
  }
`;

const WelcomeSubtitle = styled.p`
  color: ${props => props.theme.colors.darkGray};
  font-size: ${props => props.theme.fontSizes.medium};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.white};
  text-align: center;
  
  h3 {
    font-size: ${props => props.theme.fontSizes.xlarge};
    font-weight: 700;
    margin-bottom: ${props => props.theme.spacing.xs};
  }
  
  p {
    font-size: ${props => props.theme.fontSizes.small};
    opacity: 0.9;
  }
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const ActionCard = styled(Card)`
  text-align: center;
  padding: ${props => props.theme.spacing.xl} ${props => props.theme.spacing.lg};
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.theme.colors.white};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.medium};
  }
`;

const ActionIcon = styled.div`
  font-size: 2.5rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ActionTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.large};
  color: ${props => props.theme.colors.black};
  margin-bottom: ${props => props.theme.spacing.sm};
  font-weight: 600;
`;

const ActionDescription = styled.p`
  color: ${props => props.theme.colors.darkGray};
  font-size: ${props => props.theme.fontSizes.small};
`;

const RecentSection = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.small};
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg};
  padding-bottom: ${props => props.theme.spacing.md};
  border-bottom: 2px solid ${props => props.theme.colors.background};
  
  h2 {
    font-size: ${props => props.theme.fontSizes.large};
    color: ${props => props.theme.colors.black};
    display: flex;
    align-items: center;
    gap: ${props => props.theme.spacing.sm};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xxl} ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.darkGray};
  
  svg {
    font-size: 3rem;
    margin-bottom: ${props => props.theme.spacing.md};
    opacity: 0.5;
    color: ${props => props.theme.colors.primary};
  }
  
  p {
    margin-bottom: ${props => props.theme.spacing.md};
  }
`;

const ViagemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const ViagemItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.medium};
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.theme.colors.beige};
    transform: translateX(4px);
  }
`;

const ViagemInfo = styled.div`
  flex: 1;
  
  h4 {
    font-weight: 600;
    color: ${props => props.theme.colors.black};
    margin-bottom: ${props => props.theme.spacing.xs};
  }
  
  p {
    font-size: ${props => props.theme.fontSizes.small};
    color: ${props => props.theme.colors.darkGray};
  }
`;

const ViagemValue = styled.div`
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fontSizes.large};
`;

// ============ COMPONENTE HOME ============

export const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [viagens, setViagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalViagens: 0, totalRecebido: 0, mediaViagem: 0 });

  useEffect(() => {
    carregarViagens();
  }, []);

  const carregarViagens = async () => {
    setLoading(true);
    try {
      const response = await api.get('/viagens');
      const viagensData = response.data || [];
      
      setViagens(viagensData.slice(-5));
      
      const totalRecebido = viagensData.reduce((sum, v) => sum + (v.total_liquido || 0), 0);
      setStats({
        totalViagens: viagensData.length,
        totalRecebido,
        mediaViagem: viagensData.length > 0 ? totalRecebido / viagensData.length : 0
      });
    } catch (error) {
      console.error('Erro ao carregar viagens:', error);
      setViagens([]);
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (data) => {
    if (!data) return '';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
  };

  const acoes = [
    {
      icon: <FaPlus />,
      title: 'Adicionar nova viagem',
      description: 'Cadastre uma nova viagem com todos os detalhes',
      onClick: () => navigate('/nova-viagem')
    },
    {
      icon: <FaSearch />,
      title: 'Pesquisar Viagens',
      description: 'Busque viagens por período, rota ou valor',
      onClick: () => navigate('/pesquisar-viagens')
    },
    {
      icon: <FaChartLine />,
      title: 'Meus Resultados',
      description: 'Visualize seus ganhos e estatísticas',
      onClick: () => navigate('/pesquisar-viagens')
    }
  ];

  if (loading) {
    return (
      <Container>
        <Header />
        <Content>
          <LoadingContainer>🔄 Carregando suas viagens...</LoadingContainer>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Header />
      
      <Content>
        <WelcomeSection>
          <WelcomeTitle>
            Olá, <span>{user?.nome || 'Motorista'}</span>
          </WelcomeTitle>
          <WelcomeSubtitle>
            Gerencie suas viagens e acompanhe seus resultados
          </WelcomeSubtitle>
        </WelcomeSection>

        <StatsGrid>
          <StatCard>
            <h3>{stats.totalViagens}</h3>
            <p>Viagens Realizadas</p>
          </StatCard>
          <StatCard>
            <h3>{formatarMoeda(stats.totalRecebido)}</h3>
            <p>Total Recebido</p>
          </StatCard>
          <StatCard>
            <h3>{formatarMoeda(stats.mediaViagem)}</h3>
            <p>Média por Viagem</p>
          </StatCard>
        </StatsGrid>

        <ActionGrid>
          {acoes.map((acao, index) => (
            <ActionCard key={index} onClick={acao.onClick}>
              <ActionIcon>{acao.icon}</ActionIcon>
              <ActionTitle>{acao.title}</ActionTitle>
              <ActionDescription>{acao.description}</ActionDescription>
            </ActionCard>
          ))}
        </ActionGrid>

        <RecentSection>
          <SectionHeader>
            <h2>
              <FaHistory /> Últimas Viagens
            </h2>
            <Button small onClick={() => navigate('/pesquisar-viagens')}>
              Ver todas
            </Button>
          </SectionHeader>
          
          {viagens.length === 0 ? (
            <EmptyState>
              <FaTruck />
              <p>Nenhuma viagem cadastrada ainda.</p>
              <Button small onClick={() => navigate('/nova-viagem')}>
                <FaPlus /> Adicionar nova viagem
              </Button>
            </EmptyState>
          ) : (
            <ViagemList>
              {viagens.map(viagem => (
                <ViagemItem key={viagem.id_viagem} onClick={() => navigate(`/viagem/${viagem.id_viagem}`)}>
                  <ViagemInfo>
                    <h4>{viagem.cidade_saida || 'Origem'} → {viagem.cidade_chegada || 'Destino'}</h4>
                    <p>📅 {formatarData(viagem.data_entrada)}</p>
                  </ViagemInfo>
                  <ViagemValue>{formatarMoeda(viagem.total_liquido || 0)}</ViagemValue>
                </ViagemItem>
              ))}
            </ViagemList>
          )}
        </RecentSection>
      </Content>
    </Container>
  );
};