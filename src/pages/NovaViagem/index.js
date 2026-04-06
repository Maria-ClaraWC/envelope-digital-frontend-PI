// src/pages/NovaViagem/index.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
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

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
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

const ValueLabel = styled.div`
  font-size: ${props => props.theme.fontSizes.small};
  color: ${props => props.theme.colors.darkGray};
  margin-bottom: ${props => props.theme.spacing.xs};
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

export const NovaViagem = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    dataInicio: new Date().toISOString().split('T')[0],
    dataFim: '',
    kmSaida: '',
    kmChegada: '',
    cidadeSaida: null,
    cidadeChegada: null,
    pesoSaida: '',
    pesoChegada: '',
    precoTonelada: '',
  });
  
  const [abastecimentos, setAbastecimentos] = useState([
    { id: Date.now(), data: '', km: '', posto: '', litros: '', valorLitros: '', total: 0 }
  ]);
  
  const [oficinas, setOficinas] = useState([
    { id: Date.now(), data: '', km: '', tipo: '', preco: '' }
  ]);
  
  const [pedagios, setPedagios] = useState([
    { id: Date.now(), valor: '' }
  ]);
  
  const [faltaMercadoria, setFaltaMercadoria] = useState('nao');
  const [kilosFalta, setKilosFalta] = useState('');
  const [precoFalta, setPrecoFalta] = useState('');
  const [gorjetas, setGorjetas] = useState([
    { id: Date.now(), valor: '' }
  ]);
  
  const precoTotal = (formData.pesoSaida * formData.precoTonelada) || 0;
  const adiantamento = precoTotal * 0.8;
  const ordemPagamento = precoTotal * 0.8;
  
  const totalAbastecimentos = abastecimentos.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
  const totalOficinas = oficinas.reduce((sum, item) => sum + (Number(item.preco) || 0), 0);
  const totalPedagios = pedagios.reduce((sum, item) => sum + (Number(item.valor) || 0), 0);
  const totalFaltaMercadoria = faltaMercadoria === 'sim' ? (Number(kilosFalta) || 0) * (Number(precoFalta) || 0) : 0;
  const totalGorjetas = gorjetas.reduce((sum, item) => sum + (Number(item.valor) || 0), 0);
  
  const totalGastos = totalAbastecimentos + totalOficinas + totalPedagios + totalFaltaMercadoria + totalGorjetas;
  const comissao = precoTotal * 0.1;
  const totalLiquido = precoTotal - totalGastos - comissao;
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleCidadeSaidaSelect = (city) => {
    setFormData(prev => ({ ...prev, cidadeSaida: city }));
  };
  
  const handleCidadeChegadaSelect = (city) => {
    setFormData(prev => ({ ...prev, cidadeChegada: city }));
  };
  
  const handleAddAbastecimento = () => {
    setAbastecimentos(prev => [...prev, { id: Date.now(), data: '', km: '', posto: '', litros: '', valorLitros: '', total: 0 }]);
  };
  
  const handleAbastecimentoChange = (id, field, value) => {
    setAbastecimentos(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'litros' || field === 'valorLitros') {
          updated.total = (Number(updated.litros) || 0) * (Number(updated.valorLitros) || 0);
        }
        return updated;
      }
      return item;
    }));
  };
  
  const handleRemoveAbastecimento = (id) => {
    if (abastecimentos.length > 1) {
      setAbastecimentos(prev => prev.filter(item => item.id !== id));
    }
  };
  
  const handleAddOficina = () => {
    setOficinas(prev => [...prev, { id: Date.now(), data: '', km: '', tipo: '', preco: '' }]);
  };
  
  const handleOficinaChange = (id, field, value) => {
    setOficinas(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };
  
  const handleRemoveOficina = (id) => {
    if (oficinas.length > 1) {
      setOficinas(prev => prev.filter(item => item.id !== id));
    }
  };
  
  const handleAddPedagio = () => {
    setPedagios(prev => [...prev, { id: Date.now(), valor: '' }]);
  };
  
  const handlePedagioChange = (id, value) => {
    setPedagios(prev => prev.map(item => item.id === id ? { ...item, valor: value } : item));
  };
  
  const handleRemovePedagio = (id) => {
    if (pedagios.length > 1) {
      setPedagios(prev => prev.filter(item => item.id !== id));
    }
  };
  
  const handleAddGorjeta = () => {
    setGorjetas(prev => [...prev, { id: Date.now(), valor: '' }]);
  };
  
  const handleGorjetaChange = (id, value) => {
    setGorjetas(prev => prev.map(item => item.id === id ? { ...item, valor: value } : item));
  };
  
  const handleRemoveGorjeta = (id) => {
    if (gorjetas.length > 1) {
      setGorjetas(prev => prev.filter(item => item.id !== id));
    }
  };
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
  };
  
  const validateForm = () => {
    if (!formData.cidadeSaida) {
      setError('Por favor, selecione a cidade de origem');
      return false;
    }
    if (!formData.cidadeChegada) {
      setError('Por favor, selecione a cidade de destino');
      return false;
    }
    if (!formData.dataInicio) {
      setError('Por favor, informe a data de início da viagem');
      return false;
    }
    if (!formData.pesoSaida || formData.pesoSaida <= 0) {
      setError('Por favor, informe o peso da carga');
      return false;
    }
    if (!formData.precoTonelada || formData.precoTonelada <= 0) {
      setError('Por favor, informe o preço por tonelada');
      return false;
    }
    return true;
  };
  
  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    
    if (!validateForm()) {
      setTimeout(() => setError(''), 5000);
      return;
    }
    
    setLoading(true);
    
    try {
      // Preparar dados no formato esperado pelo back-end
      const viagemData = {
        dataInicio: formData.dataInicio,
        dataFim: formData.dataFim || formData.dataInicio,
        kmSaida: parseFloat(formData.kmSaida) || 0,
        kmChegada: parseFloat(formData.kmChegada) || 0,
        // Enviar o objeto completo da cidade (o back-end vai processar)
        cidadeSaida: formData.cidadeSaida,
        cidadeChegada: formData.cidadeChegada,
        pesoSaida: parseFloat(formData.pesoSaida) || 0,
        pesoChegada: parseFloat(formData.pesoChegada) || 0,
        precoTonelada: parseFloat(formData.precoTonelada) || 0,
        abastecimentos: abastecimentos
          .filter(a => a.data && a.litros && a.valorLitros)
          .map(a => ({
            data: a.data,
            km: parseFloat(a.km) || 0,
            posto: a.posto,
            litros: parseFloat(a.litros) || 0,
            valorLitros: parseFloat(a.valorLitros) || 0,
            total: parseFloat(a.total) || 0
          })),
        oficinas: oficinas
          .filter(o => o.data && o.preco)
          .map(o => ({
            data: o.data,
            km: parseFloat(o.km) || 0,
            tipo: o.tipo,
            preco: parseFloat(o.preco) || 0
          })),
        pedagios: pedagios
          .filter(p => p.valor)
          .map(p => ({
            valor: parseFloat(p.valor) || 0
          })),
        gorjetas: gorjetas
          .filter(g => g.valor)
          .map(g => ({
            valor: parseFloat(g.valor) || 0
          }))
      };
      
      // Adicionar falta de mercadoria se houver
      if (faltaMercadoria === 'sim' && kilosFalta && precoFalta) {
        viagemData.faltaMercadoria = {
          kilosFalta: parseFloat(kilosFalta) || 0,
          precoFalta: parseFloat(precoFalta) || 0,
          total: (parseFloat(kilosFalta) || 0) * (parseFloat(precoFalta) || 0)
        };
      }
      
      console.log('📤 Enviando para API:', viagemData);
      
      // Enviar para API
      const response = await api.post('/viagens', viagemData);
      
      console.log('📥 Resposta da API:', response.data);
      
      // Verificar se a resposta indica sucesso
      if (response.status === 201 || response.status === 200) {
        // Exibir mensagem de sucesso
        const successMessage = response.data.message || '✅ Viagem salva com sucesso!';
        setSuccess(successMessage);
        
        // Limpar o formulário (opcional)
        // Redirecionar após 2 segundos para o usuário ver a mensagem
        setTimeout(() => {
          navigate('/home');
        }, 2000);
      } else {
        throw new Error('Resposta inesperada do servidor');
      }
      
    } catch (error) {
      console.error('❌ Erro detalhado:', error);
      console.error('❌ Response:', error.response);
      console.error('❌ Mensagem:', error.response?.data?.error);
      
      if (error.response?.status === 401) {
        setError('Sessão expirada. Faça login novamente.');
        setTimeout(() => navigate('/login'), 2000);
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.code === 'ERR_NETWORK') {
        setError('Não foi possível conectar ao servidor. Verifique se o back-end está rodando na porta 3001.');
      } else {
        setError('Erro ao salvar viagem: ' + (error.message || 'Tente novamente.'));
      }
      
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container>
      <Header />
      
      <Content>
        <PageTitle>Cadastro de Viagem</PageTitle>
        
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
              placeholder="Digite o nome da cidade de origem..."
            />
          </CityField>
          
          <CityField>
            <label>Cidade de Destino *</label>
            <CidadeSearchIBGE 
              onSelect={handleCidadeChegadaSelect}
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
                {abastecimentos.map(item => (
                  <tr key={item.id}>
                    <td>
                      <input
                        type="date"
                        value={item.data}
                        onChange={(e) => handleAbastecimentoChange(item.id, 'data', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        placeholder="0"
                        value={item.km}
                        onChange={(e) => handleAbastecimentoChange(item.id, 'km', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="Posto"
                        value={item.posto}
                        onChange={(e) => handleAbastecimentoChange(item.id, 'posto', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0"
                        value={item.litros}
                        onChange={(e) => handleAbastecimentoChange(item.id, 'litros', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0"
                        value={item.valorLitros}
                        onChange={(e) => handleAbastecimentoChange(item.id, 'valorLitros', e.target.value)}
                      />
                    </td>
                    <td>{formatCurrency(item.total)}</td>
                    <td>
                      <ActionButton onClick={() => handleRemoveAbastecimento(item.id)}>
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
                {oficinas.map(item => (
                  <tr key={item.id}>
                    <td>
                      <input
                        type="date"
                        value={item.data}
                        onChange={(e) => handleOficinaChange(item.id, 'data', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        placeholder="0"
                        value={item.km}
                        onChange={(e) => handleOficinaChange(item.id, 'km', e.target.value)}
                      />
                    </td>
                    <td>
                      <select value={item.tipo} onChange={(e) => handleOficinaChange(item.id, 'tipo', e.target.value)}>
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
                        onChange={(e) => handleOficinaChange(item.id, 'preco', e.target.value)}
                      />
                    </td>
                    <td>
                      <ActionButton onClick={() => handleRemoveOficina(item.id)}>
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
          
          {pedagios.map(item => (
            <div key={item.id} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
              <Input
                label="Valor do pedágio"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={item.valor}
                onChange={(e) => handlePedagioChange(item.id, e.target.value)}
                style={{ flex: 1 }}
              />
              <ActionButton onClick={() => handleRemovePedagio(item.id)} style={{ marginTop: '24px' }}>
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
            {gorjetas.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Valor da gorjeta"
                  value={item.valor}
                  onChange={(e) => handleGorjetaChange(item.id, e.target.value)}
                  style={{ flex: 1 }}
                />
                <ActionButton onClick={() => handleRemoveGorjeta(item.id)}>
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
          <Button outline onClick={() => navigate('/home')}>
            <FaTimes /> Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            <FaSave /> {loading ? 'Salvando...' : 'Salvar Viagem'}
          </Button>
        </ButtonGroup>
      </Content>
    </Container>
  );
};