import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { calculators } from '../../utils/calculators';
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

const Section = styled.section`
  background-color: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.small};
`;

const SectionTitle = styled.h3`
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.fontSizes.large};
  border-bottom: 2px solid ${props => props.theme.colors.primary}40;
  padding-bottom: ${props => props.theme.spacing.sm};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.md};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Th = styled.th`
  text-align: left;
  padding: ${props => props.theme.spacing.sm};
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.darkGray};
  font-weight: 600;
`;

const Td = styled.td`
  padding: ${props => props.theme.spacing.sm};
  border-bottom: 1px solid ${props => props.theme.colors.gray};
`;

const AddButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  border: none;
  width: 30px;
  height: 30px;
  border-radius: ${props => props.theme.borderRadius.round};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: ${props => props.theme.spacing.md};

  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
`;

const DeleteButton = styled.button`
  background-color: ${props => props.theme.colors.error};
  color: ${props => props.theme.colors.white};
  border: none;
  width: 25px;
  height: 25px;
  border-radius: ${props => props.theme.borderRadius.round};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const TotalContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};
  margin-top: ${props => props.theme.spacing.md};
  padding-top: ${props => props.theme.spacing.md};
  border-top: 2px solid ${props => props.theme.colors.gray};
`;

const TotalLabel = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.darkGray};
`;

const TotalValue = styled.span`
  font-size: ${props => props.theme.fontSizes.large};
  color: ${props => props.theme.colors.primary};
  font-weight: 700;
`;

const ResumoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.xl};
`;

const ResumoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.sm} 0;
  border-bottom: 1px solid ${props => props.theme.colors.gray};
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

export const NovaViagem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    dataInicio: new Date(),
    dataFim: new Date(),
    kmSaida: 0,
    kmChegada: 0,
    cidadeSaida: '',
    estadoSaida: '',
    cidadeChegada: '',
    estadoChegada: '',
    pesoSaida: 0,
    pesoChegada: 0,
    precoTonelada: 0
  });

  const [abastecimentos, setAbastecimentos] = useState([]);
  const [oficinas, setOficinas] = useState([]);
  const [pedagios, setPedagios] = useState([]);
  const [outros, setOutros] = useState({
    faltaMercadoria: false,
    kilosFalta: 0,
    precoFalta: 0,
    gorjetas: []
  });

  const [cidades, setCidades] = useState([]);

  useEffect(() => {
    carregarCidades();
  }, []);

  const carregarCidades = async () => {
    try {
      const response = await api.get('/cidades');
      setCidades(response.data);
    } catch (error) {
      console.error('Erro ao carregar cidades:', error);
    }
  };

  // Cálculos automáticos
  const precoTotal = calculators.calcularPrecoTotal(
    formData.pesoSaida, 
    formData.precoTonelada
  );
  
  const adiantamento = calculators.calcularAdiantamento(precoTotal);
  
  const totalAbastecimentos = calculators.somarValores(
    abastecimentos.map(a => a.total)
  );
  
  const totalOficinas = calculators.somarValores(
    oficinas.map(o => o.preco)
  );
  
  const totalPedagios = calculators.somarValores(pedagios);
  
  const totalGorjetas = calculators.somarValores(outros.gorjetas);
  
  const totalFaltaMercadoria = outros.faltaMercadoria 
    ? outros.kilosFalta * outros.precoFalta 
    : 0;
  
  const totalGastos = calculators.calcularTotalGastos({
    abastecimentos: totalAbastecimentos,
    oficinas: totalOficinas,
    pedagios: totalPedagios,
    faltaMercadoria: totalFaltaMercadoria,
    gorjetas: totalGorjetas
  });
  
  const totalLiquido = calculators.calcularTotalLiquido(
    precoTotal,
    totalGastos
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const adicionarAbastecimento = () => {
    setAbastecimentos([
      ...abastecimentos,
      {
        id: Date.now(),
        data: new Date(),
        km: 0,
        posto: '',
        litros: 0,
        valorLitros: 0,
        total: 0
      }
    ]);
  };

  const atualizarAbastecimento = (id, campo, valor) => {
    setAbastecimentos(prev => 
      prev.map(item => {
        if (item.id === id) {
          const updated = { ...item, [campo]: valor };
          if (campo === 'litros' || campo === 'valorLitros') {
            updated.total = updated.litros * updated.valorLitros;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const removerAbastecimento = (id) => {
    setAbastecimentos(prev => prev.filter(item => item.id !== id));
  };

  const adicionarOficina = () => {
    setOficinas([
      ...oficinas,
      {
        id: Date.now(),
        data: new Date(),
        km: 0,
        tipo: 'borracharia',
        preco: 0
      }
    ]);
  };

  const adicionarPedagio = () => {
    setPedagios([...pedagios, { id: Date.now(), valor: 0 }]);
  };

  const adicionarGorjeta = () => {
    setOutros(prev => ({
      ...prev,
      gorjetas: [...prev.gorjetas, { id: Date.now(), valor: 0 }]
    }));
  };

  const finalizarViagem = async () => {
    try {
      const viagemData = {
        ...formData,
        abastecimentos,
        oficinas,
        pedagios,
        outros,
        resumo: {
          totalBruto: precoTotal,
          totalGastos,
          totalLiquido
        }
      };

      await api.post('/viagens', viagemData);
      navigate('/home');
    } catch (error) {
      console.error('Erro ao salvar viagem:', error);
    }
  };

  return (
    <Container>
      <Header />
      
      <Content>
        {/* Seção 1: Informações Básicas */}
        <Section>
          <SectionTitle>Informações da Viagem</SectionTitle>
          <Grid>
            <div>
              <label>Data de Início</label>
              <DatePicker
                selected={formData.dataInicio}
                onChange={date => setFormData(prev => ({ ...prev, dataInicio: date }))}
                dateFormat="dd/MM/yyyy"
              />
            </div>
            
            <div>
              <label>Data de Fim</label>
              <DatePicker
                selected={formData.dataFim}
                onChange={date => setFormData(prev => ({ ...prev, dataFim: date }))}
                dateFormat="dd/MM/yyyy"
              />
            </div>

            <Input
              label="KM Saída"
              type="number"
              name="kmSaida"
              value={formData.kmSaida}
              onChange={handleInputChange}
            />

            <Input
              label="KM Chegada"
              type="number"
              name="kmChegada"
              value={formData.kmChegada}
              onChange={handleInputChange}
            />

            <div>
              <label>Cidade de Saída</label>
              <select
                name="cidadeSaida"
                value={formData.cidadeSaida}
                onChange={handleInputChange}
              >
                <option value="">Selecione</option>
                {cidades.map(cidade => (
                  <option key={cidade.id} value={cidade.id}>
                    {cidade.cidade} - {cidade.estado_sigla}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Estado Saída"
              name="estadoSaida"
              value={formData.estadoSaida}
              onChange={handleInputChange}
              maxLength={2}
            />

            <div>
              <label>Cidade de Chegada</label>
              <select
                name="cidadeChegada"
                value={formData.cidadeChegada}
                onChange={handleInputChange}
              >
                <option value="">Selecione</option>
                {cidades.map(cidade => (
                  <option key={cidade.id} value={cidade.id}>
                    {cidade.cidade} - {cidade.estado_sigla}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Estado Chegada"
              name="estadoChegada"
              value={formData.estadoChegada}
              onChange={handleInputChange}
              maxLength={2}
            />

            <Input
              label="Peso Saída (toneladas)"
              type="number"
              name="pesoSaida"
              value={formData.pesoSaida}
              onChange={handleInputChange}
            />

            <Input
              label="Peso Chegada (toneladas)"
              type="number"
              name="pesoChegada"
              value={formData.pesoChegada}
              onChange={handleInputChange}
            />

            <Input
              label="Preço por Tonelada (R$)"
              type="number"
              name="precoTonelada"
              value={formData.precoTonelada}
              onChange={handleInputChange}
            />
          </Grid>

          <TotalContainer>
            <TotalLabel>Preço Total:</TotalLabel>
            <TotalValue>R$ {precoTotal.toFixed(2)}</TotalValue>
          </TotalContainer>

          <TotalContainer>
            <TotalLabel>Adiantamento (80%):</TotalLabel>
            <TotalValue>R$ {adiantamento.toFixed(2)}</TotalValue>
          </TotalContainer>

          <TotalContainer>
            <TotalLabel>Ordem de Pagamento:</TotalLabel>
            <TotalValue>R$ {adiantamento.toFixed(2)}</TotalValue>
          </TotalContainer>
        </Section>

        {/* Seção 2: Abastecimento */}
        <Section>
          <SectionTitle>Abastecimentos</SectionTitle>
          
          <AddButton onClick={adicionarAbastecimento}>
            <FaPlus />
          </AddButton>

          <Table>
            <thead>
              <tr>
                <Th>Data</Th>
                <Th>KM</Th>
                <Th>Posto</Th>
                <Th>Litros</Th>
                <Th>R$/Litro</Th>
                <Th>Total</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {abastecimentos.map(item => (
                <tr key={item.id}>
                  <Td>
                    <DatePicker
                      selected={item.data}
                      onChange={date => atualizarAbastecimento(item.id, 'data', date)}
                      dateFormat="dd/MM/yyyy"
                    />
                  </Td>
                  <Td>
                    <input
                      type="number"
                      value={item.km}
                      onChange={e => atualizarAbastecimento(item.id, 'km', parseFloat(e.target.value))}
                    />
                  </Td>
                  <Td>
                    <input
                      type="text"
                      value={item.posto}
                      onChange={e => atualizarAbastecimento(item.id, 'posto', e.target.value)}
                    />
                  </Td>
                  <Td>
                    <input
                      type="number"
                      value={item.litros}
                      onChange={e => atualizarAbastecimento(item.id, 'litros', parseFloat(e.target.value))}
                    />
                  </Td>
                  <Td>
                    <input
                      type="number"
                      value={item.valorLitros}
                      onChange={e => atualizarAbastecimento(item.id, 'valorLitros', parseFloat(e.target.value))}
                    />
                  </Td>
                  <Td>R$ {item.total.toFixed(2)}</Td>
                  <Td>
                    <DeleteButton onClick={() => removerAbastecimento(item.id)}>
                      <FaTrash />
                    </DeleteButton>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>

          <TotalContainer>
            <TotalLabel>Total Abastecimentos:</TotalLabel>
            <TotalValue>R$ {totalAbastecimentos.toFixed(2)}</TotalValue>
          </TotalContainer>
        </Section>

        {/* Seção 3: Oficina */}
        <Section>
          <SectionTitle>Oficina</SectionTitle>
          
          <AddButton onClick={adicionarOficina}>
            <FaPlus />
          </AddButton>

          <Table>
            <thead>
              <tr>
                <Th>Data</Th>
                <Th>KM</Th>
                <Th>Tipo</Th>
                <Th>Valor</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {oficinas.map(item => (
                <tr key={item.id}>
                  <Td>
                    <DatePicker
                      selected={item.data}
                      onChange={date => {
                        const updated = oficinas.map(o => 
                          o.id === item.id ? { ...o, data: date } : o
                        );
                        setOficinas(updated);
                      }}
                      dateFormat="dd/MM/yyyy"
                    />
                  </Td>
                  <Td>
                    <input
                      type="number"
                      value={item.km}
                      onChange={e => {
                        const updated = oficinas.map(o => 
                          o.id === item.id ? { ...o, km: parseFloat(e.target.value) } : o
                        );
                        setOficinas(updated);
                      }}
                    />
                  </Td>
                  <Td>
                    <select
                      value={item.tipo}
                      onChange={e => {
                        const updated = oficinas.map(o => 
                          o.id === item.id ? { ...o, tipo: e.target.value } : o
                        );
                        setOficinas(updated);
                      }}
                    >
                      <option value="borracharia">Borracharia</option>
                      <option value="pecas">Peças</option>
                      <option value="mecanica">Mecânica</option>
                      <option value="eletrica">Elétrica</option>
                      <option value="funilaria">Funilaria</option>
                      <option value="revisao">Revisão</option>
                    </select>
                  </Td>
                  <Td>
                    <input
                      type="number"
                      value={item.preco}
                      onChange={e => {
                        const updated = oficinas.map(o => 
                          o.id === item.id ? { ...o, preco: parseFloat(e.target.value) } : o
                        );
                        setOficinas(updated);
                      }}
                    />
                  </Td>
                  <Td>
                    <DeleteButton onClick={() => {
                      setOficinas(oficinas.filter(o => o.id !== item.id));
                    }}>
                      <FaTrash />
                    </DeleteButton>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>

          <TotalContainer>
            <TotalLabel>Total Oficina:</TotalLabel>
            <TotalValue>R$ {totalOficinas.toFixed(2)}</TotalValue>
          </TotalContainer>
        </Section>

        {/* Seção 4: Pedágio */}
        <Section>
          <SectionTitle>Pedágios</SectionTitle>
          
          <AddButton onClick={adicionarPedagio}>
            <FaPlus />
          </AddButton>

          <Table>
            <thead>
              <tr>
                <Th>Valor do Pedágio (R$)</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {pedagios.map((item, index) => (
                <tr key={item.id}>
                  <Td>
                    <input
                      type="number"
                      value={item.valor}
                      onChange={e => {
                        const updated = [...pedagios];
                        updated[index].valor = parseFloat(e.target.value);
                        setPedagios(updated);
                      }}
                    />
                  </Td>
                  <Td>
                    <DeleteButton onClick={() => {
                      setPedagios(pedagios.filter(p => p.id !== item.id));
                    }}>
                      <FaTrash />
                    </DeleteButton>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>

          <TotalContainer>
            <TotalLabel>Total Pedágios:</TotalLabel>
            <TotalValue>R$ {totalPedagios.toFixed(2)}</TotalValue>
          </TotalContainer>
        </Section>

        {/* Seção 5: Outros */}
        <Section>
          <SectionTitle>Outros</SectionTitle>

          <div>
            <p>Houve falta de mercadoria?</p>
            <RadioGroup>
              <RadioLabel>
                <input
                  type="radio"
                  name="faltaMercadoria"
                  checked={outros.faltaMercadoria === true}
                  onChange={() => setOutros(prev => ({ ...prev, faltaMercadoria: true }))}
                />
                Sim
              </RadioLabel>
              <RadioLabel>
                <input
                  type="radio"
                  name="faltaMercadoria"
                  checked={outros.faltaMercadoria === false}
                  onChange={() => setOutros(prev => ({ ...prev, faltaMercadoria: false }))}
                />
                Não
              </RadioLabel>
            </RadioGroup>

            {outros.faltaMercadoria && (
              <Grid>
                <Input
                  label="Quantos quilos?"
                  type="number"
                  value={outros.kilosFalta}
                  onChange={e => setOutros(prev => ({ ...prev, kilosFalta: parseFloat(e.target.value) }))}
                />
                <Input
                  label="Quanto custou? (R$/kg)"
                  type="number"
                  value={outros.precoFalta}
                  onChange={e => setOutros(prev => ({ ...prev, precoFalta: parseFloat(e.target.value) }))}
                />
              </Grid>
            )}
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h4>Gorjetas</h4>
            <AddButton onClick={adicionarGorjeta}>
              <FaPlus />
            </AddButton>

            <Table>
              <thead>
                <tr>
                  <Th>Valor da Gorjeta (R$)</Th>
                  <Th></Th>
                </tr>
              </thead>
              <tbody>
                {outros.gorjetas.map((item, index) => (
                  <tr key={item.id}>
                    <Td>
                      <input
                        type="number"
                        value={item.valor}
                        onChange={e => {
                          const updated = [...outros.gorjetas];
                          updated[index].valor = parseFloat(e.target.value);
                          setOutros(prev => ({ ...prev, gorjetas: updated }));
                        }}
                      />
                    </Td>
                    <Td>
                      <DeleteButton onClick={() => {
                        setOutros(prev => ({
                          ...prev,
                          gorjetas: prev.gorjetas.filter(g => g.id !== item.id)
                        }));
                      }}>
                        <FaTrash />
                      </DeleteButton>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <TotalContainer>
              <TotalLabel>Total Gorjetas:</TotalLabel>
              <TotalValue>R$ {totalGorjetas.toFixed(2)}</TotalValue>
            </TotalContainer>
          </div>
        </Section>

        {/* Seção 6: Resumo */}
        <Section>
          <SectionTitle>Resumo da Viagem</SectionTitle>
          
          <ResumoGrid>
            <div>
              <ResumoItem>
                <span>Total Bruto:</span>
                <strong>R$ {precoTotal.toFixed(2)}</strong>
              </ResumoItem>
              <ResumoItem>
                <span>Total Gastos:</span>
                <strong>R$ {totalGastos.toFixed(2)}</strong>
              </ResumoItem>
              <ResumoItem>
                <span>Comissão (10%):</span>
                <strong>R$ {(precoTotal * 0.1).toFixed(2)}</strong>
              </ResumoItem>
              <ResumoItem>
                <span>Total Líquido:</span>
                <strong>R$ {(totalLiquido - precoTotal * 0.1).toFixed(2)}</strong>
              </ResumoItem>
            </div>
            
            <div>
              <ResumoItem>
                <span>Abastecimentos:</span>
                <span>R$ {totalAbastecimentos.toFixed(2)}</span>
              </ResumoItem>
              <ResumoItem>
                <span>Oficina:</span>
                <span>R$ {totalOficinas.toFixed(2)}</span>
              </ResumoItem>
              <ResumoItem>
                <span>Pedágios:</span>
                <span>R$ {totalPedagios.toFixed(2)}</span>
              </ResumoItem>
              <ResumoItem>
                <span>Falta Mercadoria:</span>
                <span>R$ {totalFaltaMercadoria.toFixed(2)}</span>
              </ResumoItem>
              <ResumoItem>
                <span>Gorjetas:</span>
                <span>R$ {totalGorjetas.toFixed(2)}</span>
              </ResumoItem>
            </div>
          </ResumoGrid>

          <Button 
            onClick={finalizarViagem}
            fullWidth
            style={{ marginTop: '2rem' }}
          >
            Finalizar Viagem
          </Button>
        </Section>
      </Content>
    </Container>
  );
};