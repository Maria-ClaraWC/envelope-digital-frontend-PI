// src/pages/NovaViagem/index.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { FaTrash, FaPlus, FaGasPump, FaWrench, FaRoad, FaGift, FaCalculator } from 'react-icons/fa';

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
  
  &:hover {
    background-color: ${props => props.theme.colors.primary}10;
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

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 2px solid ${props => props.theme.colors.gray};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => props.theme.fontSizes.medium};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

// Dados simulados de cidades
const cidadesMock = [
  { id: 1, cidade: 'São Paulo', estado: 'SP' },
  { id: 2, cidade: 'Rio de Janeiro', estado: 'RJ' },
  { id: 3, cidade: 'Belo Horizonte', estado: 'MG' },
  { id: 4, cidade: 'Curitiba', estado: 'PR' },
  { id: 5, cidade: 'Porto Alegre', estado: 'RS' },
  { id: 6, cidade: 'Brasília', estado: 'DF' },
  { id: 7, cidade: 'Salvador', estado: 'BA' },
  { id: 8, cidade: 'Fortaleza', estado: 'CE' },
  { id: 9, cidade: 'Recife', estado: 'PE' },
  { id: 10, cidade: 'Manaus', estado: 'AM' },
];

export const NovaViagem = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [cidades, setCidades] = useState(cidadesMock);
  
  // Dados básicos da viagem
  const [formData, setFormData] = useState({
    dataInicio: '',
    dataFim: '',
    kmSaida: '',
    kmChegada: '',
    cidadeSaida: '',
    cidadeChegada: '',
    pesoSaida: '',
    pesoChegada: '',
    precoTonelada: '',
  });
  
  // Abastecimentos
  const [abastecimentos, setAbastecimentos] = useState([
    { id: Date.now(), data: '', km: '', posto: '', litros: '', valorLitros: '', total: 0 }
  ]);
  
  // Oficinas
  const [oficinas, setOficinas] = useState([
    { id: Date.now(), data: '', km: '', tipo: '', preco: '' }
  ]);
  
  // Pedagios
  const [pedagios, setPedagios] = useState([
    { id: Date.now(), valor: '' }
  ]);
  
  // Outros gastos
  const [faltaMercadoria, setFaltaMercadoria] = useState('nao');
  const [kilosFalta, setKilosFalta] = useState('');
  const [precoFalta, setPrecoFalta] = useState('');
  const [gorjetas, setGorjetas] = useState([
    { id: Date.now(), valor: '' }
  ]);
  
  // Cálculos
  const precoTotal = (formData.pesoSaida * formData.precoTonelada) || 0;
  const adiantamento = precoTotal * 0.8;
  const ordemPagamento = precoTotal * 0.8;
  
  const totalAbastecimentos = abastecimentos.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
  const totalOficinas = oficinas.reduce((sum, item) => sum + (Number(item.preco) || 0), 0);
  const totalPedagios = pedagios.reduce((sum, item) => sum + (Number(item.valor) || 0), 0);
  const totalFaltaMercadoria = faltaMercadoria === 'sim' ? (kilosFalta * precoFalta) : 0;
  const totalGorjetas = gorjetas.reduce((sum, item) => sum + (Number(item.valor) || 0), 0);
  
  const totalGastos = totalAbastecimentos + totalOficinas + totalPedagios + totalFaltaMercadoria + totalGorjetas;
  const comissao = (precoTotal - totalGastos) * 0.1;
  const totalLiquido = precoTotal - totalGastos - comissao;
  
  // Handlers
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };
  
  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const viagemData = {
        ...formData,
        abastecimentos: abastecimentos.filter(a => a.data && a.litros),
        oficinas: oficinas.filter(o => o.data && o.preco),
        pedagios: pedagios.filter(p => p.valor),
        gorjetas: gorjetas.filter(g => g.valor),
        faltaMercadoria: faltaMercadoria === 'sim' ? { kilosFalta, precoFalta, total: totalFaltaMercadoria } : null,
        precoTotal,
        adiantamento,
        ordemPagamento,
        totalGastos,
        comissao,
        totalLiquido
      };
      
      // Salvar localmente para simular
      const viagensSalvas = JSON.parse(localStorage.getItem('@App:viagens') || '[]');
      const novaViagem = {
        id: Date.now(),
        ...viagemData,
        data_entrada: formData.dataInicio,
        data_chegada: formData.dataFim,
        km_entrada: formData.kmChegada,
        cidade_saida: cidades.find(c => c.id == formData.cidadeSaida)?.cidade || 'Cidade',
        cidade_chegada: cidades.find(c => c.id == formData.cidadeChegada)?.cidade || 'Cidade',
        estado_saida: cidades.find(c => c.id == formData.cidadeSaida)?.estado || 'UF',
        estado_chegada: cidades.find(c => c.id == formData.cidadeChegada)?.estado || 'UF'
      };
      viagensSalvas.push(novaViagem);
      localStorage.setItem('@App:viagens', JSON.stringify(viagensSalvas));
      
      alert('Viagem salva com sucesso!');
      navigate('/home');
    } catch (error) {
      console.error('Erro ao salvar viagem:', error);
      alert('Erro ao salvar viagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container>
      <Header />
      
      <Content>
        <PageTitle>Cadastro de Viagem</PageTitle>
        
        {/* Dados da Viagem */}
        <FormSection>
          <SectionTitle>
            <FaCalculator /> Dados da Viagem
          </SectionTitle>
          
          <HalfRow>
            <Input
              label="Data de Início"
              type="date"
              value={formData.dataInicio}
              onChange={(e) => handleInputChange('dataInicio', e.target.value)}
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
          
          <HalfRow>
            <div>
              <ValueLabel>Cidade de Início</ValueLabel>
              <Select
                value={formData.cidadeSaida}
                onChange={(e) => handleInputChange('cidadeSaida', e.target.value)}
              >
                <option value="">Selecione a cidade</option>
                {cidades.map(cidade => (
                  <option key={cidade.id} value={cidade.id}>
                    {cidade.cidade} - {cidade.estado}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <ValueLabel>Estado de Início</ValueLabel>
              <Input
                value={cidades.find(c => c.id == formData.cidadeSaida)?.estado || ''}
                disabled
                placeholder="UF"
              />
            </div>
          </HalfRow>
          
          <HalfRow>
            <div>
              <ValueLabel>Cidade de Fim</ValueLabel>
              <Select
                value={formData.cidadeChegada}
                onChange={(e) => handleInputChange('cidadeChegada', e.target.value)}
              >
                <option value="">Selecione a cidade</option>
                {cidades.map(cidade => (
                  <option key={cidade.id} value={cidade.id}>
                    {cidade.cidade} - {cidade.estado}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <ValueLabel>Estado de Fim</ValueLabel>
              <Input
                value={cidades.find(c => c.id == formData.cidadeChegada)?.estado || ''}
                disabled
                placeholder="UF"
              />
            </div>
          </HalfRow>
          
          <HalfRow>
            <Input
              label="Peso no Início (kg)"
              type="number"
              placeholder="0"
              value={formData.pesoSaida}
              onChange={(e) => handleInputChange('pesoSaida', e.target.value)}
            />
            <Input
              label="Peso no Fim (kg)"
              type="number"
              placeholder="0"
              value={formData.pesoChegada}
              onChange={(e) => handleInputChange('pesoChegada', e.target.value)}
            />
          </HalfRow>
          
          <FormRow>
            <Input
              label="Preço da Tonelada (R$)"
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
            <FaCalculator /> Resumo
          </SectionTitle>
          
          <SummaryGrid>
            <SummaryCard>
              <SummaryLabel>Total Bruto</SummaryLabel>
              <SummaryValue>{formatCurrency(precoTotal)}</SummaryValue>
            </SummaryCard>
            <SummaryCard>
              <SummaryLabel>Total Bruto de Gastos</SummaryLabel>
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
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Viagem'}
          </Button>
        </ButtonGroup>
      </Content>
    </Container>
  );
};