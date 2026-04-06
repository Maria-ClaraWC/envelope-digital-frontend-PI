// src/pages/PesquisarViagens/index.js
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import CidadeSearchIBGE from '../../components/CidadeSearchIBGE';
import api from '../../services/api';
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaFilter, 
  FaTimes, 
  FaSort, 
  FaSortUp, 
  FaSortDown,
  FaTruck,
  FaMoneyBillWave,
  FaRoad,
  FaArrowLeft,
  FaArrowRight,
  FaWeightHanging,
  FaClipboardList,
  FaSpinner,
  FaGlobeAmericas
} from 'react-icons/fa';

const Container = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
`;

const Content = styled.main`
  max-width: 1400px;
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
  font-size: ${props => props.theme.fontSizes.medium};
`;

const FilterSection = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.medium};
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.$expanded ? props.theme.spacing.lg : '0'};
  cursor: pointer;
  padding-bottom: ${props => props.$expanded ? props.theme.spacing.sm : '0'};
  border-bottom: ${props => props.$expanded ? `2px solid ${props.theme.colors.primary}20` : 'none'};
  
  &:hover {
    opacity: 0.8;
  }
`;

const FilterTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.large};
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  font-weight: 600;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-top: ${props => props.theme.spacing.lg};
  max-height: ${props => props.$expanded ? '2000px' : '0'};
  overflow: hidden;
  transition: max-height 0.4s ease-in-out;
`;

const FilterGroup = styled.div`
  background: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.medium};
`;

const FilterGroupTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.fontSizes.medium};
  border-bottom: 1px solid ${props => props.theme.colors.primary}20;
  padding-bottom: ${props => props.theme.spacing.xs};
`;

const FilterActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: flex-end;
  flex-wrap: wrap;
  margin-top: ${props => props.theme.spacing.lg};
  padding-top: ${props => props.theme.spacing.md};
  border-top: 1px solid ${props => props.theme.colors.gray};
`;

const InputField = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
  
  label {
    display: block;
    margin-bottom: ${props => props.theme.spacing.xs};
    font-weight: 500;
    color: ${props => props.theme.colors.black};
    font-size: ${props => props.theme.fontSizes.small};
  }
  
  input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    transition: all 0.3s;
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
      box-shadow: 0 0 0 2px rgba(154, 103, 103, 0.1);
    }
  }
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
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.md};
  
  h2 {
    font-size: ${props => props.theme.fontSizes.large};
    color: ${props => props.theme.colors.black};
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: ${props => props.theme.spacing.sm};
  }
  
  span {
    background: ${props => props.theme.colors.primary}10;
    padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
    border-radius: ${props => props.theme.borderRadius.small};
    font-size: ${props => props.theme.fontSizes.small};
    color: ${props => props.theme.colors.primary};
    font-weight: 600;
  }
`;

const SortControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  flex-wrap: wrap;
  margin-bottom: ${props => props.theme.spacing.lg};
  padding-bottom: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.background};
`;

const SortButton = styled.button`
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.white : props.theme.colors.darkGray};
  border: 1px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.gray};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.fontSizes.small};
  border-radius: ${props => props.theme.borderRadius.small};
  transition: all 0.3s;
  
  &:hover {
    background: ${props => props.active ? props.theme.colors.primaryDark : props.theme.colors.background};
    transform: translateY(-2px);
  }
`;

const ViagemCard = styled(Card)`
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.md};
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
  
  &:hover {
    transform: translateX(4px);
    box-shadow: ${props => props.theme.shadows.medium};
    border-left-color: ${props => props.theme.colors.primary};
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
  background: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.small};
  
  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xxl} ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.darkGray};
  
  svg {
    font-size: 4rem;
    margin-bottom: ${props => props.theme.spacing.md};
    opacity: 0.5;
    color: ${props => props.theme.colors.primary};
  }
  
  p {
    margin-bottom: ${props => props.theme.spacing.sm};
    font-size: ${props => props.theme.fontSizes.large};
  }
`;

const ActiveFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.lg};
  padding-bottom: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.background};
`;

const FilterBadge = styled.span`
  background: ${props => props.theme.colors.primary}15;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => props.theme.fontSizes.small};
  color: ${props => props.theme.colors.primary};
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  font-weight: 500;
  
  svg {
    cursor: pointer;
    font-size: 0.8rem;
    
    &:hover {
      color: ${props => props.theme.colors.error};
    }
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.xl};
  padding-top: ${props => props.theme.spacing.lg};
  border-top: 1px solid ${props => props.theme.colors.background};
  flex-wrap: wrap;
`;

const PageButton = styled.button`
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.white : props.theme.colors.darkGray};
  border: 1px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.gray};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.small};
  cursor: pointer;
  transition: all 0.3s;
  min-width: 40px;
  
  &:hover:not(:disabled) {
    background: ${props => props.active ? props.theme.colors.primaryDark : props.theme.colors.background};
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StatsBar = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.primaryDark} 100%);
  color: white;
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.medium};
  margin-bottom: ${props => props.theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${props => props.theme.spacing.md};
  
  div {
    text-align: center;
    
    strong {
      font-size: ${props => props.theme.fontSizes.xlarge};
      display: block;
      margin-bottom: ${props => props.theme.spacing.xs};
    }
    
    span {
      font-size: ${props => props.theme.fontSizes.small};
      opacity: 0.9;
    }
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xxl};
  color: ${props => props.theme.colors.primary};
  
  svg {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
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
  const [filteredViagens, setFilteredViagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [sortField, setSortField] = useState('data_entrada');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    dataInicio: '',
    dataFim: '',
    valorMin: '',
    valorMax: '',
    kmMin: '',
    kmMax: '',
    pesoMin: '',
    pesoMax: ''
  });

  const carregarViagens = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/viagens');
      setViagens(response.data || []);
      setFilteredViagens(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar viagens:', error);
      setViagens([]);
      setFilteredViagens([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarViagens();
  }, [carregarViagens]);

  const aplicarFiltros = useCallback(() => {
    let resultado = [...viagens];
    
    if (cidadeOrigem && cidadeOrigem.cidade) {
      resultado = resultado.filter(v => 
        v.cidade_saida?.toLowerCase().includes(cidadeOrigem.cidade?.toLowerCase())
      );
    }
    
    if (cidadeDestino && cidadeDestino.cidade) {
      resultado = resultado.filter(v => 
        v.cidade_chegada?.toLowerCase().includes(cidadeDestino.cidade?.toLowerCase())
      );
    }
    
    if (filters.dataInicio) {
      resultado = resultado.filter(v => v.data_entrada >= filters.dataInicio);
    }
    
    if (filters.dataFim) {
      resultado = resultado.filter(v => v.data_entrada <= filters.dataFim);
    }
    
    if (filters.valorMin) {
      resultado = resultado.filter(v => (Number(v.total_liquido) || 0) >= Number(filters.valorMin));
    }
    
    if (filters.valorMax) {
      resultado = resultado.filter(v => (Number(v.total_liquido) || 0) <= Number(filters.valorMax));
    }
    
    if (filters.kmMin) {
      resultado = resultado.filter(v => (Number(v.km_saida) || 0) >= Number(filters.kmMin));
    }
    
    if (filters.kmMax) {
      resultado = resultado.filter(v => (Number(v.km_entrada) || 0) <= Number(filters.kmMax));
    }
    
    if (filters.pesoMin) {
      resultado = resultado.filter(v => (Number(v.peso_saida) || 0) >= Number(filters.pesoMin));
    }
    
    if (filters.pesoMax) {
      resultado = resultado.filter(v => (Number(v.peso_saida) || 0) <= Number(filters.pesoMax));
    }
    
    resultado.sort((a, b) => {
      let aVal, bVal;
      
      switch (sortField) {
        case 'data_entrada':
          aVal = new Date(a.data_entrada);
          bVal = new Date(b.data_entrada);
          break;
        case 'total_liquido':
          aVal = Number(a.total_liquido) || 0;
          bVal = Number(b.total_liquido) || 0;
          break;
        case 'cidade_saida':
          aVal = a.cidade_saida || '';
          bVal = b.cidade_saida || '';
          break;
        case 'peso_saida':
          aVal = Number(a.peso_saida) || 0;
          bVal = Number(b.peso_saida) || 0;
          break;
        case 'km_total':
          aVal = (Number(a.km_entrada) || 0) - (Number(a.km_saida) || 0);
          bVal = (Number(b.km_entrada) || 0) - (Number(b.km_saida) || 0);
          break;
        default:
          aVal = a[sortField] || 0;
          bVal = b[sortField] || 0;
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    
    setFilteredViagens(resultado);
    setCurrentPage(1);
  }, [viagens, cidadeOrigem, cidadeDestino, filters, sortField, sortOrder]);

  useEffect(() => {
    aplicarFiltros();
  }, [aplicarFiltros]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const limparFiltros = () => {
    setCidadeOrigem(null);
    setCidadeDestino(null);
    setFilters({
      dataInicio: '',
      dataFim: '',
      valorMin: '',
      valorMax: '',
      kmMin: '',
      kmMax: '',
      pesoMin: '',
      pesoMax: ''
    });
    setSortField('data_entrada');
    setSortOrder('desc');
  };

  const removerFiltro = (field) => {
    if (field === 'cidadeOrigem') {
      setCidadeOrigem(null);
    } else if (field === 'cidadeDestino') {
      setCidadeDestino(null);
    } else {
      setFilters(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort size={12} />;
    return sortOrder === 'asc' ? <FaSortUp size={12} /> : <FaSortDown size={12} />;
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredViagens.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredViagens.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const calcularEstatisticas = () => {
    const totalViagens = filteredViagens.length;
    const totalValor = filteredViagens.reduce((sum, v) => sum + (Number(v.total_liquido) || 0), 0);
    const totalPeso = filteredViagens.reduce((sum, v) => sum + (Number(v.peso_saida) || 0), 0);
    const mediaValor = totalViagens > 0 ? totalValor / totalViagens : 0;
    
    return { totalViagens, totalValor, totalPeso, mediaValor };
  };

  const stats = calcularEstatisticas();

  const activeFiltersList = [
    cidadeOrigem && { id: 'cidadeOrigem', label: `📍 Origem: ${cidadeOrigem.cidade} - ${cidadeOrigem.estado_sigla}` },
    cidadeDestino && { id: 'cidadeDestino', label: `📍 Destino: ${cidadeDestino.cidade} - ${cidadeDestino.estado_sigla}` },
    filters.dataInicio && { id: 'dataInicio', label: `📅 A partir de: ${formatarData(filters.dataInicio)}` },
    filters.dataFim && { id: 'dataFim', label: `📅 Até: ${formatarData(filters.dataFim)}` },
    filters.valorMin && { id: 'valorMin', label: `💰 Valor min: ${formatarMoeda(filters.valorMin)}` },
    filters.valorMax && { id: 'valorMax', label: `💰 Valor max: ${formatarMoeda(filters.valorMax)}` },
    filters.kmMin && { id: 'kmMin', label: `📊 KM min: ${filters.kmMin}` },
    filters.kmMax && { id: 'kmMax', label: `📊 KM max: ${filters.kmMax}` },
    filters.pesoMin && { id: 'pesoMin', label: `⚖️ Peso min: ${filters.pesoMin}t` },
    filters.pesoMax && { id: 'pesoMax', label: `⚖️ Peso max: ${filters.pesoMax}t` }
  ].filter(Boolean);

  if (loading) {
    return (
      <Container>
        <Header />
        <Content>
          <LoadingContainer>
            <FaSpinner size={48} />
            <p>Carregando viagens...</p>
          </LoadingContainer>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Header />
      
      <Content>
        <PageTitle>
          <FaSearch size={32} /> Pesquisar Viagens
        </PageTitle>
        <PageSubtitle>
          Encontre viagens por rota, período, valor ou quilometragem - Pesquise em todos os estados do Brasil
        </PageSubtitle>

        <FilterSection>
          <FilterHeader $expanded={filtersExpanded} onClick={() => setFiltersExpanded(!filtersExpanded)}>
            <FilterTitle>
              <FaFilter size={20} /> Filtros de Pesquisa
            </FilterTitle>
            <span style={{ fontSize: '20px' }}>{filtersExpanded ? '▲' : '▼'}</span>
          </FilterHeader>
          
          <FilterGrid $expanded={filtersExpanded}>
            <FilterGroup>
              <FilterGroupTitle>
                <FaGlobeAmericas size={16} /> Localização
              </FilterGroupTitle>
              <CidadeSearchIBGE 
                onSelect={setCidadeOrigem}
                placeholder="Digite o nome da cidade de origem..."
                label="Cidade de Origem"
              />
              <div style={{ marginTop: '16px' }}>
                <CidadeSearchIBGE 
                  onSelect={setCidadeDestino}
                  placeholder="Digite o nome da cidade de destino..."
                  label="Cidade de Destino"
                />
              </div>
            </FilterGroup>

            <FilterGroup>
              <FilterGroupTitle>
                <FaCalendarAlt size={16} /> Período
              </FilterGroupTitle>
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
            </FilterGroup>

            <FilterGroup>
              <FilterGroupTitle>
                <FaMoneyBillWave size={16} /> Valores
              </FilterGroupTitle>
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
            </FilterGroup>

            <FilterGroup>
              <FilterGroupTitle>
                <FaRoad size={16} /> Quilometragem
              </FilterGroupTitle>
              <InputField>
                <label>KM Mínimo</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.kmMin}
                  onChange={(e) => handleFilterChange('kmMin', e.target.value)}
                />
              </InputField>
              <InputField>
                <label>KM Máximo</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.kmMax}
                  onChange={(e) => handleFilterChange('kmMax', e.target.value)}
                />
              </InputField>
            </FilterGroup>

            <FilterGroup>
              <FilterGroupTitle>
                <FaWeightHanging size={16} /> Peso da Carga
              </FilterGroupTitle>
              <InputField>
                <label>Peso Mínimo (toneladas)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="0"
                  value={filters.pesoMin}
                  onChange={(e) => handleFilterChange('pesoMin', e.target.value)}
                />
              </InputField>
              <InputField>
                <label>Peso Máximo (toneladas)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="0"
                  value={filters.pesoMax}
                  onChange={(e) => handleFilterChange('pesoMax', e.target.value)}
                />
              </InputField>
            </FilterGroup>
          </FilterGrid>
          
          <FilterActions>
            <Button outline onClick={limparFiltros}>
              <FaTimes /> Limpar Tudo
            </Button>
          </FilterActions>
        </FilterSection>

        {filteredViagens.length > 0 && (
          <StatsBar>
            <div>
              <strong>{stats.totalViagens}</strong>
              <span>Viagens Encontradas</span>
            </div>
            <div>
              <strong>{formatarMoeda(stats.totalValor)}</strong>
              <span>Valor Total</span>
            </div>
            <div>
              <strong>{stats.totalPeso.toFixed(1)} t</strong>
              <span>Peso Total</span>
            </div>
            <div>
              <strong>{formatarMoeda(stats.mediaValor)}</strong>
              <span>Média por Viagem</span>
            </div>
          </StatsBar>
        )}

        <ResultsSection>
          <ResultsHeader>
            <h2>
              <FaClipboardList /> Resultados 
              <span>{filteredViagens.length} viagens</span>
            </h2>
          </ResultsHeader>
          
          <SortControls>
            <span style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>Ordenar por:</span>
            <SortButton 
              onClick={() => handleSort('data_entrada')}
              active={sortField === 'data_entrada'}
            >
              <FaCalendarAlt size={12} /> Data {getSortIcon('data_entrada')}
            </SortButton>
            <SortButton 
              onClick={() => handleSort('total_liquido')}
              active={sortField === 'total_liquido'}
            >
              <FaMoneyBillWave size={12} /> Valor {getSortIcon('total_liquido')}
            </SortButton>
            <SortButton 
              onClick={() => handleSort('cidade_saida')}
              active={sortField === 'cidade_saida'}
            >
              <FaMapMarkerAlt size={12} /> Origem {getSortIcon('cidade_saida')}
            </SortButton>
            <SortButton 
              onClick={() => handleSort('peso_saida')}
              active={sortField === 'peso_saida'}
            >
              <FaWeightHanging size={12} /> Peso {getSortIcon('peso_saida')}
            </SortButton>
            <SortButton 
              onClick={() => handleSort('km_total')}
              active={sortField === 'km_total'}
            >
              <FaRoad size={12} /> KM Total {getSortIcon('km_total')}
            </SortButton>
          </SortControls>
          
          {activeFiltersList.length > 0 && (
            <ActiveFilters>
              {activeFiltersList.map(filter => (
                <FilterBadge key={filter.id}>
                  {filter.label}
                  <FaTimes onClick={() => removerFiltro(filter.id)} />
                </FilterBadge>
              ))}
            </ActiveFilters>
          )}
          
          {currentItems.length === 0 ? (
            <EmptyState>
              <FaSearch size={48} />
              <p>Nenhuma viagem encontrada com os filtros selecionados.</p>
              <div style={{ marginTop: '20px' }}>
                <Button onClick={() => navigate('/nova-viagem')}>
                  <FaTruck /> Cadastrar Nova Viagem
                </Button>
              </div>
            </EmptyState>
          ) : (
            <>
              {currentItems.map(viagem => (
                <ViagemCard 
                  key={viagem.id_viagem} 
                  onClick={() => navigate(`/viagem/${viagem.id_viagem}`)}
                >
                  <ViagemHeader>
                    <ViagemRoute>
                      <FaMapMarkerAlt size={18} />
                      {viagem.cidade_saida || 'Origem'} → {viagem.cidade_chegada || 'Destino'}
                    </ViagemRoute>
                    <ViagemValue>{formatarMoeda(viagem.total_liquido || 0)}</ViagemValue>
                  </ViagemHeader>
                  <ViagemDetails>
                    <DetailItem>
                      <FaCalendarAlt size={12} />
                      {formatarData(viagem.data_entrada)}
                    </DetailItem>
                    {viagem.km_saida && viagem.km_entrada && (
                      <DetailItem>
                        <FaRoad size={12} />
                        KM: {Math.round(viagem.km_saida)} - {Math.round(viagem.km_entrada)} 
                        ({Math.round((viagem.km_entrada - viagem.km_saida))} km)
                      </DetailItem>
                    )}
                    {viagem.peso_saida && (
                      <DetailItem>
                        <FaWeightHanging size={12} />
                        {viagem.peso_saida} t
                      </DetailItem>
                    )}
                    <DetailItem>
                      <FaMoneyBillWave size={12} />
                      {formatarMoeda(viagem.total_bruto || 0)} bruto
                    </DetailItem>
                  </ViagemDetails>
                </ViagemCard>
              ))}
              
              {totalPages > 1 && (
                <PaginationContainer>
                  <PageButton 
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <FaArrowLeft /> Anterior
                  </PageButton>
                  
                  {[...Array(Math.min(totalPages, 5)).keys()].map((_, index) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = index + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = index + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + index;
                    } else {
                      pageNumber = currentPage - 2 + index;
                    }
                    
                    if (pageNumber < 1 || pageNumber > totalPages) return null;
                    
                    return (
                      <PageButton
                        key={pageNumber}
                        onClick={() => paginate(pageNumber)}
                        active={currentPage === pageNumber}
                      >
                        {pageNumber}
                      </PageButton>
                    );
                  })}
                  
                  <PageButton 
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Próximo <FaArrowRight />
                  </PageButton>
                </PaginationContainer>
              )}
            </>
          )}
        </ResultsSection>
      </Content>
    </Container>
  );
};

export default PesquisarViagens;