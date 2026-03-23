// src/pages/PesquisarViagens/index.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import CidadeSearch from '../../components/CidadeSearch';
import api from '../../services/api';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaFilter, FaTimes } from 'react-icons/fa';

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

const CityField = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
  
  label {
    display: block;
    margin-bottom: ${props => props.theme.spacing.xs};
    font-weight: 500;
    color: ${props => props.theme.colors.black};
  }
`;

const InputField = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
  
  label {
    display: block;
    margin-bottom: ${props => props.theme.spacing.xs};
    font-weight: 500;
    color: ${props => props.theme.colors.black};
  }
  
  input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    
    &:focus {
      outline: none;
      border-color: #9A6767;
      box-shadow: 0 0 0 2px rgba(154, 103, 103, 0.1);
    }
  }
`;

const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
};

const formatarData = (data) => {
  if (!data) return '';
  return new Date(data).toLocaleDateString('pt-BR');
};

const PesquisarViagens = () => {
  const navigate = useNavigate();
  const [cidadeOrigem, setCidadeOrigem] = useState(null);
  const [cidadeDestino, setCidadeDestino] = useState(null);
  const [viagens, setViagens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    dataInicio: '',
    dataFim: '',
    valorMin: '',
    valorMax: ''
  });
  const [activeFilters, setActiveFilters] = useState([]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const aplicarFiltros = (resultados) => {
    let resultado = [...resultados];
    const novosActiveFilters = [];
    
    if (cidadeOrigem) {
      resultado = resultado.filter(v => 
        v.cidade_saida?.toLowerCase().includes(cidadeOrigem.cidade?.toLowerCase())
      );
      novosActiveFilters.push({ field: 'cidadeOrigem', label: `Origem: ${cidadeOrigem.cidade}` });
    }
    
    if (cidadeDestino) {
      resultado = resultado.filter(v => 
        v.cidade_chegada?.toLowerCase().includes(cidadeDestino.cidade?.toLowerCase())
      );
      novosActiveFilters.push({ field: 'cidadeDestino', label: `Destino: ${cidadeDestino.cidade}` });
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
    
    setViagens(resultado);
    setActiveFilters(novosActiveFilters);
  };

  const handleSearch = async () => {
    if (!cidadeOrigem && !cidadeDestino && !filters.dataInicio && !filters.dataFim && !filters.valorMin && !filters.valorMax) {
      alert('Selecione pelo menos um filtro para pesquisar');
      return;
    }
    
    setLoading(true);
    try {
      const params = {};
      if (cidadeOrigem) params.id_saida = cidadeOrigem.id;
      if (cidadeDestino) params.id_chegada = cidadeDestino.id;
      if (filters.dataInicio) params.data_inicio = filters.dataInicio;
      if (filters.dataFim) params.data_fim = filters.dataFim;
      if (filters.valorMin) params.valor_min = filters.valorMin;
      if (filters.valorMax) params.valor_max = filters.valorMax;
      
      const response = await api.get('/viagens', { params });
      aplicarFiltros(response.data);
    } catch (error) {
      console.error('Erro ao pesquisar viagens:', error);
      alert(error.response?.data?.error || 'Erro ao pesquisar viagens');
      setViagens([]);
    } finally {
      setLoading(false);
    }
  };

  const limparFiltros = () => {
    setCidadeOrigem(null);
    setCidadeDestino(null);
    setFilters({
      dataInicio: '',
      dataFim: '',
      valorMin: '',
      valorMax: ''
    });
    setActiveFilters([]);
    setViagens([]);
  };

  const removerFiltro = (field) => {
    if (field === 'cidadeOrigem') {
      setCidadeOrigem(null);
    } else if (field === 'cidadeDestino') {
      setCidadeDestino(null);
    } else {
      setFilters(prev => ({ ...prev, [field]: '' }));
    }
    setTimeout(() => handleSearch(), 100);
  };

  return (
    <Container>
      <Header />
      
      <Content>
        <PageTitle>
          <FaSearch /> Pesquisar Viagens
        </PageTitle>
        <PageSubtitle>
          Encontre viagens por rota, período ou valor
        </PageSubtitle>

        <FilterSection>
          <FilterTitle>
            <FaFilter /> Filtros de Pesquisa
          </FilterTitle>
          
          <FilterGrid>
            <CityField>
              <label>Cidade de Origem</label>
              <CidadeSearch 
                onSelect={setCidadeOrigem}
                placeholder="Todas as origens"
              />
            </CityField>
            
            <CityField>
              <label>Cidade de Destino</label>
              <CidadeSearch 
                onSelect={setCidadeDestino}
                placeholder="Todos os destinos"
              />
            </CityField>
            
            <InputField>
              <label>Data Início (a partir de)</label>
              <input
                type="date"
                value={filters.dataInicio}
                onChange={(e) => handleFilterChange('dataInicio', e.target.value)}
              />
            </InputField>
            
            <InputField>
              <label>Data Fim (até)</label>
              <input
                type="date"
                value={filters.dataFim}
                onChange={(e) => handleFilterChange('dataFim', e.target.value)}
              />
            </InputField>
            
            <InputField>
              <label>Valor Mínimo (R$)</label>
              <input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={filters.valorMin}
                onChange={(e) => handleFilterChange('valorMin', e.target.value)}
              />
            </InputField>
            
            <InputField>
              <label>Valor Máximo (R$)</label>
              <input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={filters.valorMax}
                onChange={(e) => handleFilterChange('valorMax', e.target.value)}
              />
            </InputField>
          </FilterGrid>
          
          <FilterActions>
            <Button outline onClick={limparFiltros}>
              Limpar Tudo
            </Button>
            <Button onClick={handleSearch} disabled={loading}>
              <FaSearch /> {loading ? 'Pesquisando...' : 'PESQUISAR'}
            </Button>
          </FilterActions>
        </FilterSection>

        <ResultsSection>
          <ResultsHeader>
            <h2>Resultados ({viagens.length})</h2>
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
          
          {viagens.length === 0 ? (
            <EmptyState>
              <FaSearch />
              <p>Nenhuma viagem encontrada com os filtros selecionados.</p>
              <small>Tente ajustar os filtros ou cadastrar uma nova viagem.</small>
            </EmptyState>
          ) : (
            viagens.map(viagem => (
              <ViagemCard key={viagem.id_viagem} onClick={() => navigate(`/viagem/${viagem.id_viagem}`)}>
                <ViagemHeader>
                  <ViagemRoute>
                    <FaMapMarkerAlt />
                    {viagem.cidade_saida || 'Origem'} → {viagem.cidade_chegada || 'Destino'}
                  </ViagemRoute>
                  <ViagemValue>{formatarMoeda(viagem.total_liquido)}</ViagemValue>
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
                  {viagem.peso_saida && (
                    <DetailItem>
                      ⚖️ {viagem.peso_saida} toneladas
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

export default PesquisarViagens;