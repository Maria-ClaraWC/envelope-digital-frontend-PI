// pages/PesquisarViagens/index.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaCalendarAlt, FaMapMarkerAlt, FaDollarSign, FaFilter, FaTimes } from 'react-icons/fa';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

const Container = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
`;

const Content = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
`;

const PageTitle = styled.h1`
  font-size: ${props => props.theme.fontSizes.xxlarge};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const PageSubtitle = styled.p`
  color: ${props => props.theme.colors.darkGray};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const FilterSection = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.small};
`;

const FilterTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.large};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  font-weight: 600;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const FilterActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: flex-end;
`;

const ResultsSection = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.small};
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg};
  padding-bottom: ${props => props.theme.spacing.md};
  border-bottom: 2px solid ${props => props.theme.colors.background};
  
  h2 {
    font-size: ${props => props.theme.fontSizes.large};
    color: ${props => props.theme.colors.black};
    font-weight: 600;
  }
  
  span {
    background: ${props => props.theme.colors.background};
    padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
    border-radius: ${props => props.theme.borderRadius.small};
    font-size: ${props => props.theme.fontSizes.small};
    color: ${props => props.theme.colors.darkGray};
  }
`;

const ViagemCard = styled(Card)`
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.md};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(4px);
    box-shadow: ${props => props.theme.shadows.medium};
  }
`;

const ViagemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.md};
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.sm};
`;

const ViagemRoute = styled.div`
  font-weight: 700;
  font-size: ${props => props.theme.fontSizes.large};
  color: ${props => props.theme.colors.black};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  flex-wrap: wrap;
  
  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const ViagemValue = styled.div`
  font-weight: 700;
  font-size: ${props => props.theme.fontSizes.xlarge};
  color: ${props => props.theme.colors.primary};
`;

const ViagemDetails = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  flex-wrap: wrap;
  margin-top: ${props => props.theme.spacing.md};
  padding-top: ${props => props.theme.spacing.md};
  border-top: 1px solid ${props => props.theme.colors.background};
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.fontSizes.small};
  color: ${props => props.theme.colors.darkGray};
  
  svg {
    color: ${props => props.theme.colors.primary};
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
    margin-bottom: ${props => props.theme.spacing.sm};
  }
  
  small {
    font-size: ${props => props.theme.fontSizes.small};
  }
`;

const ActiveFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const FilterBadge = styled.span`
  background: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => props.theme.fontSizes.small};
  color: ${props => props.theme.colors.black};
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  
  svg {
    cursor: pointer;
    font-size: 0.7rem;
    color: ${props => props.theme.colors.darkGray};
    
    &:hover {
      color: ${props => props.theme.colors.error};
    }
  }
`;

const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
};

const formatarData = (data) => {
  if (!data) return '';
  return new Date(data).toLocaleDateString('pt-BR');
};

export const PesquisarViagens = () => {
  const navigate = useNavigate();
  const [viagens, setViagens] = useState([]);
  const [filteredViagens, setFilteredViagens] = useState([]);
  const [filters, setFilters] = useState({
    cidadeOrigem: '',
    cidadeDestino: '',
    dataInicio: '',
    dataFim: '',
    valorMin: '',
    valorMax: ''
  });
  const [activeFilters, setActiveFilters] = useState([]);

  useEffect(() => {
    carregarViagens();
  }, []);

  const carregarViagens = () => {
    const viagensSalvas = JSON.parse(localStorage.getItem('@App:viagens') || '[]');
    const viagensMock = [
      {
        id: 1,
        cidade_saida: 'São Paulo',
        cidade_chegada: 'Rio de Janeiro',
        data_entrada: '2024-03-15',
        data_chegada: '2024-03-17',
        km_saida: 1000,
        km_entrada: 1500,
        pesoSaida: 20,
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
        pesoSaida: 18,
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
        pesoSaida: 22,
        total_liquido: 9800
      }
    ];
    
    setViagens(viagensSalvas.length > 0 ? viagensSalvas : viagensMock);
    setFilteredViagens(viagensSalvas.length > 0 ? viagensSalvas : viagensMock);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const aplicarFiltros = () => {
    let resultado = [...viagens];
    const novosActiveFilters = [];
    
    if (filters.cidadeOrigem) {
      resultado = resultado.filter(v => 
        v.cidade_saida?.toLowerCase().includes(filters.cidadeOrigem.toLowerCase())
      );
      novosActiveFilters.push({ field: 'cidadeOrigem', label: `Origem: ${filters.cidadeOrigem}` });
    }
    
    if (filters.cidadeDestino) {
      resultado = resultado.filter(v => 
        v.cidade_chegada?.toLowerCase().includes(filters.cidadeDestino.toLowerCase())
      );
      novosActiveFilters.push({ field: 'cidadeDestino', label: `Destino: ${filters.cidadeDestino}` });
    }
    
    if (filters.dataInicio) {
      resultado = resultado.filter(v => v.data_entrada >= filters.dataInicio);
      novosActiveFilters.push({ field: 'dataInicio', label: `A partir de: ${formatarData(filters.dataInicio)}` });
    }
    
    if (filters.dataFim) {
      resultado = resultado.filter(v => v.data_entrada <= filters.dataFim);
      novosActiveFilters.push({ field: 'dataFim', label: `Até: ${formatarData(filters.dataFim)}` });
    }
    
    if (filters.valorMin) {
      resultado = resultado.filter(v => (v.total_liquido || 0) >= Number(filters.valorMin));
      novosActiveFilters.push({ field: 'valorMin', label: `Valor min: ${formatarMoeda(filters.valorMin)}` });
    }
    
    if (filters.valorMax) {
      resultado = resultado.filter(v => (v.total_liquido || 0) <= Number(filters.valorMax));
      novosActiveFilters.push({ field: 'valorMax', label: `Valor max: ${formatarMoeda(filters.valorMax)}` });
    }
    
    setFilteredViagens(resultado);
    setActiveFilters(novosActiveFilters);
  };

  const limparFiltros = () => {
    setFilters({
      cidadeOrigem: '',
      cidadeDestino: '',
      dataInicio: '',
      dataFim: '',
      valorMin: '',
      valorMax: ''
    });
    setFilteredViagens(viagens);
    setActiveFilters([]);
  };

  const removerFiltro = (field) => {
    setFilters(prev => ({ ...prev, [field]: '' }));
    setTimeout(() => aplicarFiltros(), 0);
  };

  return (
    <Container>
      <Header />
      
      <Content>
        <PageTitle>
          <FaSearch /> Filtros de Pesquisa
        </PageTitle>
        <PageSubtitle>
          Encontre viagens por período, rota ou valor
        </PageSubtitle>

        <FilterSection>
          <FilterTitle>
            <FaFilter /> Filtros
          </FilterTitle>
          
          <FilterGrid>
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
            <Input
              label="Valor Mínimo (R$)"
              type="number"
              placeholder="0,00"
              value={filters.valorMin}
              onChange={(e) => handleFilterChange('valorMin', e.target.value)}
            />
            <Input
              label="Valor Máximo (R$)"
              type="number"
              placeholder="0,00"
              value={filters.valorMax}
              onChange={(e) => handleFilterChange('valorMax', e.target.value)}
            />
          </FilterGrid>
          
          <FilterActions>
            <Button outline onClick={limparFiltros}>
              Limpar
            </Button>
            <Button onClick={aplicarFiltros}>
              <FaSearch /> PESQUISAR
            </Button>
          </FilterActions>
        </FilterSection>

        <ResultsSection>
          <ResultsHeader>
            <h2>Resultados ({filteredViagens.length})</h2>
            <span>viagens encontradas</span>
          </ResultsHeader>
          
          {activeFilters.length > 0 && (
            <ActiveFilters>
              {activeFilters.map(filter => (
                <FilterBadge key={filter.field}>
                  {filter.label}
                  <FaTimes onClick={() => removerFiltro(filter.field)} />
                </FilterBadge>
              ))}
            </ActiveFilters>
          )}
          
          {filteredViagens.length === 0 ? (
            <EmptyState>
              <FaSearch />
              <p>Nenhuma viagem encontrada com os filtros selecionados.</p>
            </EmptyState>
          ) : (
            filteredViagens.map(viagem => (
              <ViagemCard key={viagem.id} onClick={() => navigate(`/viagem/${viagem.id}`)}>
                <ViagemHeader>
                  <ViagemRoute>
                    <FaMapMarkerAlt />
                    {viagem.cidade_saida || 'Origem'} → {viagem.cidade_chegada || 'Destino'}
                  </ViagemRoute>
                  <ViagemValue>{formatarMoeda(viagem.total_liquido || 0)}</ViagemValue>
                </ViagemHeader>
                <ViagemDetails>
                  <DetailItem>
                    <FaCalendarAlt />
                    {formatarData(viagem.data_entrada)}
                  </DetailItem>
                  {viagem.km_saida && viagem.km_entrada && (
                    <DetailItem>
                      📊 KM: {viagem.km_saida} - {viagem.km_entrada}
                    </DetailItem>
                  )}
                  {viagem.pesoSaida && (
                    <DetailItem>
                      ⚖️ {viagem.pesoSaida} kg
                    </DetailItem>
                  )}
                </ViagemDetails>
              </ViagemCard>
            ))
          )}
        </ResultsSection>
      </Content>
    </Container>
  );
};