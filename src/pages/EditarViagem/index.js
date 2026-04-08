// src/pages/EditarViagem/index.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useAuth } from '../../contexts/AuthContext';
import CidadeSearchIBGE from '../../components/CidadeSearchIBGE';
import api from '../../services/api';
import { FaTrash, FaPlus, FaGasPump, FaWrench, FaRoad, FaGift, FaCalculator, FaSave, FaTimes } from 'react-icons/fa';

const Container = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
`;

const Content = styled.main`
  max-width: 1000px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
`;

const PageTitle = styled.h1`
  font-size: ${props => props.theme.fontSizes.xxlarge};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.xl};
  font-weight: 700;
  border-left: 5px solid ${props => props.theme.colors.primary};
  padding-left: ${props => props.theme.spacing.md};
`;

const FormSection = styled.section`
  background-color: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.small};
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes.large};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
  padding-bottom: ${props => props.theme.spacing.sm};
  border-bottom: 2px solid ${props => props.theme.colors.primary}40;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const HalfRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ValueLabel = styled.div`
  font-size: ${props => props.theme.fontSizes.small};
  color: ${props => props.theme.colors.darkGray};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const ValueDisplay = styled.div`
  background-color: ${props => props.theme.colors.gray};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => props.theme.fontSizes.large};
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
  text-align: right;
  margin-top: ${props => props.theme.spacing.sm};
`;

const TableContainer = styled.div`
  overflow-x: auto;
  margin: ${props => props.theme.spacing.md} 0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: ${props => props.theme.spacing.sm};
    text-align: left;
    border-bottom: 1px solid ${props => props.theme.colors.gray};
  }
  
  th {
    background-color: ${props => props.theme.colors.background};
    font-weight: 600;
    color: ${props => props.theme.colors.primary};
  }
  
  td {
    input, select {
      width: 100%;
      padding: ${props => props.theme.spacing.xs};
      border: 1px solid ${props => props.theme.colors.gray};
      border-radius: ${props => props.theme.borderRadius.small};
      
      &:focus {
        outline: none;
        border-color: ${props => props.theme.colors.primary};
      }
    }
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.error};
  cursor: pointer;
  font-size: 1.2rem;
  padding: ${props => props.theme.spacing.xs};
  
  &:hover {
    opacity: 0.7;
    transform: scale(1.1);
  }
`;

const AddButton = styled.button`
  background: none;
  border: 2px dashed ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.small};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  margin-top: ${props => props.theme.spacing.sm};
  transition: all 0.3s;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary}10;
    transform: translateY(-2px);
  }
`;

const TotalRow = styled.div`
  text-align: right;
  font-size: ${props => props.theme.fontSizes.large};
  font-weight: 600;
  margin-top: ${props => props.theme.spacing.md};
  padding-top: ${props => props.theme.spacing.md};
  border-top: 2px solid ${props => props.theme.colors.gray};
  color: ${props => props.theme.colors.primary};
`;

const RadioGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  margin: ${props => props.theme.spacing.md} 0;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  cursor: pointer;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-top: ${props => props.theme.spacing.md};
`;

const SummaryCard = styled.div`
  background-color: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.medium};
  text-align: center;
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const SummaryValue = styled.div`
  font-size: ${props => props.theme.fontSizes.xlarge};
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin-top: ${props => props.theme.spacing.xs};
`;

const SummaryLabel = styled.div`
  font-size: ${props => props.theme.fontSizes.small};
  color: ${props => props.theme.colors.darkGray};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${props => props.theme.spacing.xl};
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

const ErrorMessage = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.medium};
  margin-bottom: ${props => props.theme.spacing.lg};
  border-left: 4px solid #c62828;
`;

const SuccessMessage = styled.div`
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.medium};
  margin-bottom: ${props => props.theme.spacing.lg};
  border-left: 4px solid #2e7d32;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  button {
    background: none;
    border: none;
    color: #2e7d32;
    cursor: pointer;
    font-size: 1.2rem;
    
    &:hover {
      opacity: 0.7;
    }
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xxl};
  font-size: ${props => props.theme.fontSizes.large};
  color: ${props => props.theme.colors.primary};
`;

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

const EditarViagem = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    dataInicio: '',
    dataFim: '',
    kmSaida: '',
    kmChegada: '',
    cidadeSaida: null,
    cidadeChegada: null,
    pesoSaida: '',
    pesoChegada: '',
    precoTonelada: '',
  });
  
  const [abastecimentos, setAbastecimentos] = useState([]);
  const [oficinas, setOficinas] = useState([]);
  const [pedagios, setPedagios] = useState([]);
  const [gorjetas, setGorjetas] = useState([]);
  const [faltaMercadoria, setFaltaMercadoria] = useState('nao');
  const [kilosFalta, setKilosFalta] = useState('');
  const [precoFalta, setPrecoFalta] = useState('');

  useEffect(() => {
    carregarViagem();
  }, [id]);

  const carregarViagem = async () => {
    setLoading(true);
    try {
      const drafts = getDraftsFromStorage();
      if (drafts[id]) {
        const draft = drafts[id];
        setFormData(draft.formData || {
          dataInicio: '',
          dataFim: '',
          kmSaida: '',
          kmChegada: '',
          cidadeSaida: null,
          cidadeChegada: null,
          pesoSaida: '',
          pesoChegada: '',
          precoTonelada: ''
        });
        setAbastecimentos(draft.abastecimentos || []);
        setOficinas(draft.oficinas || []);
        setPedagios(draft.pedagios || []);
        setGorjetas(draft.gorjetas || []);
        setFaltaMercadoria(draft.faltaMercadoria || 'nao');
        setKilosFalta(draft.kilosFalta || '');
        setPrecoFalta(draft.precoFalta || '');
        setSuccess('Rascunho carregado localmente.');
        setLoading(false);
        return;
      }

      const response = await api.get(`/viagens/${id}`);
      const viagem = response.data;
      
      // Preencher formulário
      setFormData({
        dataInicio: viagem.data_entrada?.split('T')[0] || '',
        dataFim: viagem.data_chegada?.split('T')[0] || '',
        kmSaida: viagem.km_saida || '',
        kmChegada: viagem.km_entrada || '',
        cidadeSaida: viagem.cidade_saida ? {
          cidade: viagem.cidade_saida,
          estado_sigla: viagem.estado_saida
        } : null,
        cidadeChegada: viagem.cidade_chegada ? {
          cidade: viagem.cidade_chegada,
          estado_sigla: viagem.estado_chegada
        } : null,
        pesoSaida: viagem.peso_saida || '',
        pesoChegada: viagem.peso_chegada || '',
        precoTonelada: viagem.preco_tonelada || '',
      });
      
      setAbastecimentos(viagem.abastecimentos || []);
      setOficinas(viagem.oficinas || []);
      setPedagios(viagem.pedagios || []);
      setGorjetas(viagem.gorjetas || []);
      
      if (viagem.faltaMercadoria) {
        setFaltaMercadoria('sim');
        setKilosFalta(viagem.faltaMercadoria.kilos_falta || '');
        setPrecoFalta(viagem.faltaMercadoria.preco_falta || '');
      }

      const savedDrafts = getDraftsFromStorage();
      if (savedDrafts[id]) {
        const draft = savedDrafts[id];
        setFormData(draft.formData || {
          dataInicio: viagem.data_entrada?.split('T')[0] || '',
          dataFim: viagem.data_chegada?.split('T')[0] || '',
          kmSaida: viagem.km_saida || '',
          kmChegada: viagem.km_entrada || '',
          cidadeSaida: viagem.cidade_saida ? {
            cidade: viagem.cidade_saida,
            estado_sigla: viagem.estado_saida
          } : null,
          cidadeChegada: viagem.cidade_chegada ? {
            cidade: viagem.cidade_chegada,
            estado_sigla: viagem.estado_chegada
          } : null,
          pesoSaida: viagem.peso_saida || '',
          pesoChegada: viagem.peso_chegada || '',
          precoTonelada: viagem.preco_tonelada || '',
        });
        setAbastecimentos(draft.abastecimentos || viagem.abastecimentos || []);
        setOficinas(draft.oficinas || viagem.oficinas || []);
        setPedagios(draft.pedagios || viagem.pedagios || []);
        setGorjetas(draft.gorjetas || viagem.gorjetas || []);
        if (draft.faltaMercadoria === 'sim') {
          setFaltaMercadoria('sim');
          setKilosFalta(draft.kilosFalta || '');
          setPrecoFalta(draft.precoFalta || '');
        }
        setSuccess('Rascunho carregado automaticamente.');
      }
      
    } catch (error) {
      console.error('Erro ao carregar viagem:', error);
      setError('Erro ao carregar dados da viagem');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleCidadeSaidaSelect = (city) => {
    setFormData(prev => ({ ...prev, cidadeSaida: city }));
  };
  
  const handleCidadeChegadaSelect = (city) => {
    setFormData(prev => ({ ...prev, cidadeChegada: city }));
  };
  
  // Abastecimentos
  const handleAddAbastecimento = () => {
    setAbastecimentos(prev => [...prev, { id_abastecimento: Date.now(), data: '', km: '', posto: '', litros: '', valor_litros: '', total: 0 }]);
  };
  
  const handleAbastecimentoChange = (index, field, value) => {
    const updated = [...abastecimentos];
    updated[index][field] = value;
    if (field === 'litros' || field === 'valor_litros') {
      updated[index].total = (Number(updated[index].litros) || 0) * (Number(updated[index].valor_litros) || 0);
    }
    setAbastecimentos(updated);
  };
  
  const handleRemoveAbastecimento = (index) => {
    setAbastecimentos(prev => prev.filter((_, i) => i !== index));
  };
  
  // Oficinas
  const handleAddOficina = () => {
    setOficinas(prev => [...prev, { id_oficina: Date.now(), data: '', km: '', tipo: '', preco: '' }]);
  };
  
  const handleOficinaChange = (index, field, value) => {
    const updated = [...oficinas];
    updated[index][field] = value;
    setOficinas(updated);
  };
  
  const handleRemoveOficina = (index) => {
    setOficinas(prev => prev.filter((_, i) => i !== index));
  };
  
  // Pedágios
  const handleAddPedagio = () => {
    setPedagios(prev => [...prev, { id_pedagio: Date.now(), valor: '' }]);
  };
  
  const handlePedagioChange = (index, value) => {
    const updated = [...pedagios];
    updated[index].valor = value;
    setPedagios(updated);
  };
  
  const handleRemovePedagio = (index) => {
    setPedagios(prev => prev.filter((_, i) => i !== index));
  };
  
  // Gorjetas
  const handleAddGorjeta = () => {
    setGorjetas(prev => [...prev, { id_gorjeta: Date.now(), valor: '' }]);
  };
  
  const handleGorjetaChange = (index, value) => {
    const updated = [...gorjetas];
    updated[index].valor = value;
    setGorjetas(updated);
  };
  
  const handleRemoveGorjeta = (index) => {
    setGorjetas(prev => prev.filter((_, i) => i !== index));
  };
  
  const precoTotal = (formData.pesoSaida * formData.precoTonelada) || 0;
  const adiantamento = precoTotal * 0.8;
  const ordemPagamento = precoTotal * 0.8;
  
  const totalAbastecimentos = abastecimentos.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
  const totalOficinas = oficinas.reduce((sum, item) => sum + (Number(item.preco) || 0), 0);
  const totalPedagios = pedagios.reduce((sum, item) => sum + (Number(item.valor) || 0), 0);
  const totalGorjetas = gorjetas.reduce((sum, item) => sum + (Number(item.valor) || 0), 0);
  const totalFaltaMercadoria = faltaMercadoria === 'sim' ? (Number(kilosFalta) || 0) * (Number(precoFalta) || 0) : 0;
  
  const totalGastos = totalAbastecimentos + totalOficinas + totalPedagios + totalFaltaMercadoria + totalGorjetas;
  const comissao = precoTotal * 0.1;
  const totalLiquido = precoTotal - totalGastos - comissao;
  
  const getDraftsFromStorage = () => {
    try {
      const saved = localStorage.getItem('viagemDrafts');
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error('Erro ao ler rascunhos:', error);
      return {};
    }
  };

  const saveDraftToStorage = (draftId, draftData) => {
    try {
      const drafts = getDraftsFromStorage();
      const updatedDrafts = {
        ...drafts,
        [draftId]: {
          id: draftId,
          updatedAt: Date.now(),
          cidadeSaida: draftData.formData?.cidadeSaida?.cidade || '',
          cidadeChegada: draftData.formData?.cidadeChegada?.cidade || '',
          dataInicio: draftData.formData?.dataInicio || '',
          totalLiquido: draftData.totalLiquido || 0,
          formData: draftData.formData,
          abastecimentos: draftData.abastecimentos,
          oficinas: draftData.oficinas,
          pedagios: draftData.pedagios,
          gorjetas: draftData.gorjetas,
          faltaMercadoria: draftData.faltaMercadoria,
          kilosFalta: draftData.kilosFalta,
          precoFalta: draftData.precoFalta
        }
      };
      localStorage.setItem('viagemDrafts', JSON.stringify(updatedDrafts));
    } catch (error) {
      console.error('Erro ao salvar rascunho:', error);
    }
  };

  const removeDraftFromStorage = (draftId) => {
    try {
      const drafts = getDraftsFromStorage();
      if (drafts[draftId]) {
        delete drafts[draftId];
        localStorage.setItem('viagemDrafts', JSON.stringify(drafts));
      }
    } catch (error) {
      console.error('Erro ao remover rascunho:', error);
    }
  };

  const handleSaveDraft = () => {
    setError('');
    setSuccess('');

    const draftData = {
      formData,
      abastecimentos,
      oficinas,
      pedagios,
      gorjetas,
      faltaMercadoria,
      kilosFalta,
      precoFalta,
      totalLiquido
    };

    saveDraftToStorage(id, draftData);
    setSuccess('✅ Rascunho salvo com sucesso!');
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    setSaving(true);
    
    try {
      const viagemData = {
        dataInicio: formData.dataInicio,
        dataFim: formData.dataFim || formData.dataInicio,
        kmSaida: parseFloat(formData.kmSaida) || 0,
        kmChegada: parseFloat(formData.kmChegada) || 0,
        cidadeSaida: formData.cidadeSaida,
        cidadeChegada: formData.cidadeChegada,
        pesoSaida: parseFloat(formData.pesoSaida) || 0,
        pesoChegada: parseFloat(formData.pesoChegada) || 0,
        precoTonelada: parseFloat(formData.precoTonelada) || 0,
        abastecimentos: abastecimentos.filter(a => a.data && a.litros && a.valor_litros),
        oficinas: oficinas.filter(o => o.data && o.preco),
        pedagios: pedagios.filter(p => p.valor),
        gorjetas: gorjetas.filter(g => g.valor)
      };
      
      if (faltaMercadoria === 'sim' && kilosFalta && precoFalta) {
        viagemData.faltaMercadoria = {
          kilosFalta: parseFloat(kilosFalta) || 0,
          precoFalta: parseFloat(precoFalta) || 0
        };
      }
      
      const response = await api.put(`/viagens/${id}`, viagemData);
      
      if (response.status === 200 || response.status === 201) {
        removeDraftFromStorage(id);
        setSuccess('✅ Viagem atualizada com sucesso!');
        setTimeout(() => {
          navigate(`/viagem/${id}`);
        }, 2000);
      }
      
    } catch (error) {
      console.error('Erro ao atualizar viagem:', error);
      setError(error.response?.data?.error || 'Erro ao atualizar viagem');
      setTimeout(() => setError(''), 5000);
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <Container>
        <Header />
        <Content>
          <LoadingContainer>🔄 Carregando dados da viagem...</LoadingContainer>
        </Content>
      </Container>
    );
  }
  
  return (
    <Container>
      <Header />
      
      <Content>
        <PageTitle>Editar Viagem</PageTitle>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && (
          <SuccessMessage>
            <span>{success}</span>
            <button onClick={() => setSuccess('')}>✕</button>
          </SuccessMessage>
        )}
        
        {/* Dados da Viagem */}
        <FormSection>
          <SectionTitle>
            <FaCalculator /> Dados da Viagem
          </SectionTitle>
          
          <HalfRow>
            <Input
              label="Data de Início *"
              type="date"
              value={formData.dataInicio}
              onChange={(e) => handleInputChange('dataInicio', e.target.value)}
              required
            />
            <Input
              label="Data de Fim"
              type="date"
              value={formData.dataFim}
              onChange={(e) => handleInputChange('dataFim', e.target.value)}
            />
          </HalfRow>
          
          <HalfRow>
            <Input
              label="KM ao Sair"
              type="number"
              placeholder="0"
              value={formData.kmSaida}
              onChange={(e) => handleInputChange('kmSaida', e.target.value)}
            />
            <Input
              label="KM ao Fim"
              type="number"
              placeholder="0"
              value={formData.kmChegada}
              onChange={(e) => handleInputChange('kmChegada', e.target.value)}
            />
          </HalfRow>
          
          <CityField>
            <label>Cidade de Início *</label>
            <CidadeSearchIBGE 
              onSelect={handleCidadeSaidaSelect}
              initialValue={formData.cidadeSaida}
              placeholder="Digite o nome da cidade de origem..."
            />
          </CityField>
          
          <CityField>
            <label>Cidade de Destino *</label>
            <CidadeSearchIBGE 
              onSelect={handleCidadeChegadaSelect}
              initialValue={formData.cidadeChegada}
              placeholder="Digite o nome da cidade de destino..."
            />
          </CityField>
          
          <HalfRow>
            <Input
              label="Peso no Início (toneladas) *"
              type="number"
              step="0.1"
              placeholder="0"
              value={formData.pesoSaida}
              onChange={(e) => handleInputChange('pesoSaida', e.target.value)}
            />
            <Input
              label="Peso no Fim (toneladas)"
              type="number"
              step="0.1"
              placeholder="0"
              value={formData.pesoChegada}
              onChange={(e) => handleInputChange('pesoChegada', e.target.value)}
            />
          </HalfRow>
          
          <FormRow>
            <Input
              label="Preço da Tonelada (R$) *"
              type="number"
              step="0.01"
              placeholder="0,00"
              value={formData.precoTonelada}
              onChange={(e) => handleInputChange('precoTonelada', e.target.value)}
            />
            <div>
              <ValueLabel>Preço Total (R$)</ValueLabel>
              <ValueDisplay>{formatCurrency(precoTotal)}</ValueDisplay>
            </div>
          </FormRow>
          
          <FormRow>
            <div>
              <ValueLabel>Valor do Adiantamento (R$)</ValueLabel>
              <ValueDisplay>{formatCurrency(adiantamento)}</ValueDisplay>
            </div>
            <div>
              <ValueLabel>Ordem de Pagamento</ValueLabel>
              <ValueDisplay>{formatCurrency(ordemPagamento)}</ValueDisplay>
            </div>
          </FormRow>
        </FormSection>
        
        {/* Abastecimento */}
        <FormSection>
          <SectionTitle>
            <FaGasPump /> Abastecimento
          </SectionTitle>
          
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>KM</th>
                  <th>Posto</th>
                  <th>Litros</th>
                  <th>Valor/Litro (R$)</th>
                  <th>Valor Total (R$)</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {abastecimentos.map((item, index) => (
                  <tr key={item.id_abastecimento || index}>
                    <td>
                      <input
                        type="date"
                        value={item.data}
                        onChange={(e) => handleAbastecimentoChange(index, 'data', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        placeholder="0"
                        value={item.km}
                        onChange={(e) => handleAbastecimentoChange(index, 'km', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="Posto"
                        value={item.posto}
                        onChange={(e) => handleAbastecimentoChange(index, 'posto', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0"
                        value={item.litros}
                        onChange={(e) => handleAbastecimentoChange(index, 'litros', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0"
                        value={item.valor_litros}
                        onChange={(e) => handleAbastecimentoChange(index, 'valor_litros', e.target.value)}
                      />
                    </td>
                    <td>{formatCurrency(item.total)}</td>
                    <td>
                      <ActionButton onClick={() => handleRemoveAbastecimento(index)}>
                        <FaTrash />
                      </ActionButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
          
          <AddButton onClick={handleAddAbastecimento}>
            <FaPlus /> Adicionar linha
          </AddButton>
          
          <TotalRow>Total: {formatCurrency(totalAbastecimentos)}</TotalRow>
        </FormSection>
        
        {/* Oficina */}
        <FormSection>
          <SectionTitle>
            <FaWrench /> Oficina
          </SectionTitle>
          
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>KM</th>
                  <th>Tipo</th>
                  <th>Valor (R$)</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {oficinas.map((item, index) => (
                  <tr key={item.id_oficina || index}>
                    <td>
                      <input
                        type="date"
                        value={item.data}
                        onChange={(e) => handleOficinaChange(index, 'data', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        placeholder="0"
                        value={item.km}
                        onChange={(e) => handleOficinaChange(index, 'km', e.target.value)}
                      />
                    </td>
                    <td>
                      <select value={item.tipo} onChange={(e) => handleOficinaChange(index, 'tipo', e.target.value)}>
                        <option value="">Selecione</option>
                        <option value="manutencao">Manutenção</option>
                        <option value="pneu">Pneu</option>
                        <option value="oleo">Troca de Óleo</option>
                        <option value="motor">Motor</option>
                        <option value="outros">Outros</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={item.preco}
                        onChange={(e) => handleOficinaChange(index, 'preco', e.target.value)}
                      />
                    </td>
                    <td>
                      <ActionButton onClick={() => handleRemoveOficina(index)}>
                        <FaTrash />
                      </ActionButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
          
          <AddButton onClick={handleAddOficina}>
            <FaPlus /> Adicionar linha
          </AddButton>
          
          <TotalRow>Total Pago: {formatCurrency(totalOficinas)}</TotalRow>
        </FormSection>
        
        {/* Pedágio */}
        <FormSection>
          <SectionTitle>
            <FaRoad /> Pedágio
          </SectionTitle>
          
          {pedagios.map((item, index) => (
            <div key={item.id_pedagio || index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
              <Input
                label="Valor do pedágio"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={item.valor}
                onChange={(e) => handlePedagioChange(index, e.target.value)}
                style={{ flex: 1 }}
              />
              <ActionButton onClick={() => handleRemovePedagio(index)} style={{ marginTop: '24px' }}>
                <FaTrash />
              </ActionButton>
            </div>
          ))}
          
          <AddButton onClick={handleAddPedagio}>
            <FaPlus /> Adicionar valor
          </AddButton>
          
          <TotalRow>Total Pago: {formatCurrency(totalPedagios)}</TotalRow>
        </FormSection>
        
        {/* Outros */}
        <FormSection>
          <SectionTitle>
            <FaGift /> Outros
          </SectionTitle>
          
          <div>
            <ValueLabel>Houve falta de mercadoria?</ValueLabel>
            <RadioGroup>
              <RadioLabel>
                <input
                  type="radio"
                  name="faltaMercadoria"
                  value="sim"
                  checked={faltaMercadoria === 'sim'}
                  onChange={(e) => setFaltaMercadoria(e.target.value)}
                />
                Sim
              </RadioLabel>
              <RadioLabel>
                <input
                  type="radio"
                  name="faltaMercadoria"
                  value="nao"
                  checked={faltaMercadoria === 'nao'}
                  onChange={(e) => setFaltaMercadoria(e.target.value)}
                />
                Não
              </RadioLabel>
            </RadioGroup>
          </div>
          
          {faltaMercadoria === 'sim' && (
            <HalfRow>
              <Input
                label="Kilos de falta"
                type="number"
                placeholder="0"
                value={kilosFalta}
                onChange={(e) => setKilosFalta(e.target.value)}
              />
              <Input
                label="Preço por kilo (R$)"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={precoFalta}
                onChange={(e) => setPrecoFalta(e.target.value)}
              />
            </HalfRow>
          )}
          
          <div style={{ marginTop: '20px' }}>
            <ValueLabel>Gorjetas</ValueLabel>
            {gorjetas.map((item, index) => (
              <div key={item.id_gorjeta || index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Valor da gorjeta"
                  value={item.valor}
                  onChange={(e) => handleGorjetaChange(index, e.target.value)}
                  style={{ flex: 1 }}
                />
                <ActionButton onClick={() => handleRemoveGorjeta(index)}>
                  <FaTrash />
                </ActionButton>
              </div>
            ))}
            <AddButton onClick={handleAddGorjeta}>
              <FaPlus /> Adicionar gorjeta
            </AddButton>
          </div>
          
          <TotalRow>Total: {formatCurrency(totalGorjetas)}</TotalRow>
        </FormSection>
        
        {/* Resumo */}
        <FormSection>
          <SectionTitle>
            <FaCalculator /> Resumo Financeiro
          </SectionTitle>
          
          <SummaryGrid>
            <SummaryCard>
              <SummaryLabel>Total Bruto</SummaryLabel>
              <SummaryValue>{formatCurrency(precoTotal)}</SummaryValue>
            </SummaryCard>
            <SummaryCard>
              <SummaryLabel>Total de Gastos</SummaryLabel>
              <SummaryValue>{formatCurrency(totalGastos)}</SummaryValue>
            </SummaryCard>
            <SummaryCard>
              <SummaryLabel>Comissão (10%)</SummaryLabel>
              <SummaryValue>{formatCurrency(comissao)}</SummaryValue>
            </SummaryCard>
            <SummaryCard>
              <SummaryLabel>Total Líquido</SummaryLabel>
              <SummaryValue>{formatCurrency(totalLiquido)}</SummaryValue>
            </SummaryCard>
          </SummaryGrid>
        </FormSection>
        
        <ButtonGroup>
          <Button outline onClick={() => navigate(`/viagem/${id}`)}>
            <FaTimes /> Cancelar
          </Button>
          <Button outline onClick={handleSaveDraft}>
            <FaSave /> Salvar Rascunho
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            <FaSave /> {saving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </ButtonGroup>
      </Content>
    </Container>
  );
};

export default EditarViagem;