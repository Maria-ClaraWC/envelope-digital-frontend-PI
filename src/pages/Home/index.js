import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
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

const AddSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xxl};
`;

const AddCard = styled(Card)`
  width: 200px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px dashed ${props => props.theme.colors.primary};

  &:hover {
    transform: scale(1.05);
    background-color: ${props => props.theme.colors.primary}10;
    border-color: ${props => props.theme.colors.primaryDark};
  }
`;

const PlusIcon = styled(FaPlus)`
  font-size: 4rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const AddText = styled.p`
  font-size: ${props => props.theme.fontSizes.medium};
  color: ${props => props.theme.colors.darkGray};
  font-weight: 500;
`;

const FilterSection = styled.section`
  background-color: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.small};
`;

const FilterTitle = styled.h3`
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.fontSizes.large};
  font-weight: 600;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const FilterButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: flex-end;
`;

const ViagensSection = styled.section`
  h2 {
    color: ${props => props.theme.colors.primary};
    margin-bottom: ${props => props.theme.spacing.lg};
    font-size: ${props => props.theme.fontSizes.xlarge};
    font-weight: 600;
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
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const ViagemLocal = styled.div`
  font-size: ${props => props.theme.fontSizes.large};
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
`;

const ViagemPeriodo = styled.div`
  color: ${props => props.theme.colors.darkGray};
  font-size: ${props => props.theme.fontSizes.small};
`;

const ViagemData = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${props => props.theme.spacing.sm};
  padding-top: ${props => props.theme.spacing.sm};
  border-top: 1px solid ${props => props.theme.colors.gray};
  font-size: ${props => props.theme.fontSizes.small};
  color: ${props => props.theme.colors.darkGray};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xxl};
  background-color: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.large};
  color: ${props => props.theme.colors.darkGray};
  
  p {
    margin: ${props => props.theme.spacing.sm} 0;
  }
  
  p:first-child {
    font-size: ${props => props.theme.fontSizes.large};
    margin-bottom: ${props => props.theme.spacing.md};
  }
`;

const DemoBadge = styled.div`
  background-color: #FFE4B5;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.medium};
  margin-bottom: ${props => props.theme.spacing.lg};
  text-align: center;
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fontSizes.small};
`;

// Dados simulados
const viagensSimuladas = [
  {
    id: 1,
    cidade_saida: 'São Paulo',
    cidade_chegada: 'Rio de Janeiro',
    data_entrada: '2024-03-15',
    data_chegada: '2024-03-17',
    km_saida: 1000,
    km_entrada: 1500,
    peso_saida: 20,
    total_liquido: 8500
  },
  {
    id: 2,
    cidade_saida: 'Curitiba',
    cidade_chegada: 'Porto Alegre',
    data_entrada: '2024-03-10',
    data_chegada: '2024-03-12',
    km_saida: 2000,
    km_entrada: 2450,
    peso_saida: 18,
    total_liquido: 7200
  },
  {
    id: 3,
    cidade_saida: 'Belo Horizonte',
    cidade_chegada: 'Brasília',
    data_entrada: '2024-03-05',
    data_chegada: '2024-03-07',
    km_saida: 3000,
    km_entrada: 3450,
    peso_saida: 22,
    total_liquido: 9800
  }
];

export const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [viagens, setViagens] = useState([]);
  const [filteredViagens, setFilteredViagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usandoSimulacao, setUsandoSimulacao] = useState(false);
  const [filters, setFilters] = useState({
    nomeMotorista: '',
    cidadeOrigem: '',
    cidadeDestino: '',
    dataInicio: '',
    dataFim: ''
  });

  useEffect(() => {
    carregarViagens();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [filters, viagens]);

  const carregarViagens = async () => {
    try {
      const response = await api.get('/viagens');
      setViagens(response.data);
      setFilteredViagens(response.data);
      setUsandoSimulacao(false);
    } catch (error) {
      setViagens(viagensSimuladas);
      setFilteredViagens(viagensSimuladas);
      setUsandoSimulacao(true);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let resultado = [...viagens];
    
    if (filters.cidadeOrigem) {
      resultado = resultado.filter(v => 
        v.cidade_saida?.toLowerCase().includes(filters.cidadeOrigem.toLowerCase())
      );
    }
    
    if (filters.cidadeDestino) {
      resultado = resultado.filter(v => 
        v.cidade_chegada?.toLowerCase().includes(filters.cidadeDestino.toLowerCase())
      );
    }
    
    if (filters.dataInicio) {
      resultado = resultado.filter(v => v.data_entrada >= filters.dataInicio);
    }
    
    if (filters.dataFim) {
      resultado = resultado.filter(v => v.data_chegada <= filters.dataFim);
    }
    
    setFilteredViagens(resultado);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const limparFiltros = () => {
    setFilters({
      nomeMotorista: '',
      cidadeOrigem: '',
      cidadeDestino: '',
      dataInicio: '',
      dataFim: ''
    });
  };

  const formatarData = (data) => {
    if (!data) return '';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  return (
    <Container>
      <Header />
      
      <Content>
        <AddSection>
          <AddCard onClick={() => navigate('/nova-viagem')}>
            <PlusIcon />
            <AddText>Adicionar nova viagem</AddText>
          </AddCard>
        </AddSection>

        {usandoSimulacao && (
          <DemoBadge>
            ⚠️ Modo de demonstração - Dados simulados (backend não conectado)
          </DemoBadge>
        )}

        <FilterSection>
          <FilterTitle>Filtros de Pesquisa</FilterTitle>
          <FilterGrid>
            <Input
              label="Nome do Motorista"
              placeholder="Digite o nome do motorista"
              value={filters.nomeMotorista}
              onChange={(e) => handleFilterChange('nomeMotorista', e.target.value)}
            />
            <Input
              label="Cidade de Origem"
              placeholder="Digite a cidade de origem"
              value={filters.cidadeOrigem}
              onChange={(e) => handleFilterChange('cidadeOrigem', e.target.value)}
            />
            <Input
              label="Cidade de Destino"
              placeholder="Digite a cidade de destino"
              value={filters.cidadeDestino}
              onChange={(e) => handleFilterChange('cidadeDestino', e.target.value)}
            />
            <Input
              label="Data Início (a partir de)"
              type="date"
              value={filters.dataInicio}
              onChange={(e) => handleFilterChange('dataInicio', e.target.value)}
            />
            <Input
              label="Data Fim (até)"
              type="date"
              value={filters.dataFim}
              onChange={(e) => handleFilterChange('dataFim', e.target.value)}
            />
          </FilterGrid>
          <FilterButtons>
            <Button small onClick={aplicarFiltros}>
              🔍 PESQUISAR
            </Button>
            <Button small outline onClick={limparFiltros}>
              Limpar
            </Button>
          </FilterButtons>
        </FilterSection>

        <ViagensSection>
          <h2>Resultados ({filteredViagens.length})</h2>
          
          {loading ? (
            <EmptyState>
              <p>Carregando...</p>
            </EmptyState>
          ) : filteredViagens.length === 0 ? (
            <EmptyState>
              <p>Nenhuma viagem encontrada com os filtros selecionados.</p>
            </EmptyState>
          ) : (
            <ViagensGrid>
              {filteredViagens.map(viagem => (
                <ViagemCard 
                  key={viagem.id}
                  onClick={() => navigate(`/viagem/${viagem.id}`)}
                >
                  <ViagemLocal>
                    {viagem.cidade_saida} → {viagem.cidade_chegada}
                  </ViagemLocal>
                  <ViagemPeriodo>
                    📅 {formatarData(viagem.data_entrada)} - {formatarData(viagem.data_chegada)}
                  </ViagemPeriodo>
                  <ViagemData>
                    <span>📊 KM: {viagem.km_saida} - {viagem.km_entrada}</span>
                    <span>⚖️ {viagem.peso_saida}t</span>
                  </ViagemData>
                  <ViagemData>
                    <span>💰 {formatarMoeda(viagem.total_liquido || 0)}</span>
                  </ViagemData>
                </ViagemCard>
              ))}
            </ViagensGrid>
          )}
        </ViagensSection>
      </Content>
    </Container>
  );
};