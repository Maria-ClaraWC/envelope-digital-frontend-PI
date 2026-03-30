import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import api from '../../services/api';
import { FaMapMarkerAlt, FaCalendarAlt, FaGasPump, FaWrench, FaRoad, FaArrowLeft } from 'react-icons/fa';

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
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  
  svg {
    cursor: pointer;
    
    &:hover {
      opacity: 0.7;
    }
  }
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

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.md};
`;

const InfoItem = styled.div`
  padding: ${props => props.theme.spacing.sm};
  
  label {
    font-size: ${props => props.theme.fontSizes.small};
    color: ${props => props.theme.colors.darkGray};
    display: block;
    margin-bottom: ${props => props.theme.spacing.xs};
  }
  
  div {
    font-size: ${props => props.theme.fontSizes.medium};
    font-weight: 600;
    color: ${props => props.theme.colors.black};
  }
`;

const ValueHighlight = styled.div`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.medium};
  text-align: center;
  
  label {
    font-size: ${props => props.theme.fontSizes.small};
    opacity: 0.9;
    display: block;
    margin-bottom: ${props => props.theme.spacing.xs};
  }
  
  div {
    font-size: ${props => props.theme.fontSizes.xxlarge};
    font-weight: 700;
  }
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
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xxl};
  font-size: ${props => props.theme.fontSizes.large};
  color: ${props => props.theme.colors.primary};
`;

const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
};

const formatarData = (data) => {
  if (!data) return 'Não informada';
  return new Date(data).toLocaleDateString('pt-BR');
};

const DetalhesViagem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [viagem, setViagem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDetalhes();
  }, [id]);

  const carregarDetalhes = async () => {
    setLoading(true);
    try {
      // Tentar buscar da API
      const response = await api.get(`/viagens/${id}`);
      setViagem(response.data);
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
      // Fallback para dados simulados
      const viagensSalvas = JSON.parse(localStorage.getItem('@App:viagens') || '[]');
      const viagemEncontrada = viagensSalvas.find(v => v.id === parseInt(id) || v.id_viagem === parseInt(id));
      
      if (viagemEncontrada) {
        setViagem(viagemEncontrada);
      } else {
        // Dados de exemplo para demonstração
        setViagem({
          id_viagem: id,
          data_entrada: new Date().toISOString().split('T')[0],
          km_saida: 12500,
          km_entrada: 13250,
          cidade_saida: 'São Paulo',
          cidade_chegada: 'Rio de Janeiro',
          peso_saida: 15.5,
          preco_tonelada: 850,
          total_liquido: 12500,
          total_gastos: 3250,
          comissao: 1250,
          abastecimentos: [
            { data: new Date().toISOString().split('T')[0], litros: 200, valor_litro: 5.89, total: 1178 }
          ],
          oficinas: [
            { data: new Date().toISOString().split('T')[0], tipo: 'Troca de Óleo', preco: 350 }
          ],
          pedagios: [
            { valor: 45.50 }
          ]
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Header />
        <Content>
          <LoadingContainer>🔄 Carregando detalhes da viagem...</LoadingContainer>
        </Content>
      </Container>
    );
  }

  if (!viagem) {
    return (
      <Container>
        <Header />
        <Content>
          <PageTitle>
            <FaArrowLeft onClick={() => navigate('/pesquisar-viagens')} />
            Viagem não encontrada
          </PageTitle>
          <Button onClick={() => navigate('/pesquisar-viagens')}>
            Voltar para pesquisar
          </Button>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Header />
      
      <Content>
        <PageTitle>
          <FaArrowLeft onClick={() => navigate(-1)} />
          Detalhes da Viagem
        </PageTitle>

        {/* Resumo Financeiro */}
        <FormSection>
          <SectionTitle>
            <FaMapMarkerAlt /> Resumo Financeiro
          </SectionTitle>
          <InfoGrid>
            <ValueHighlight>
              <label>Total Líquido</label>
              <div>{formatarMoeda(viagem.total_liquido)}</div>
            </ValueHighlight>
            <InfoItem>
              <label>Total Bruto</label>
              <div>{formatarMoeda((viagem.peso_saida || 0) * (viagem.preco_tonelada || 0))}</div>
            </InfoItem>
            <InfoItem>
              <label>Total de Gastos</label>
              <div>{formatarMoeda(viagem.total_gastos)}</div>
            </InfoItem>
            <InfoItem>
              <label>Comissão (10%)</label>
              <div>{formatarMoeda(viagem.comissao)}</div>
            </InfoItem>
          </InfoGrid>
        </FormSection>

        {/* Dados da Viagem */}
        <FormSection>
          <SectionTitle>
            <FaCalendarAlt /> Dados da Viagem
          </SectionTitle>
          <InfoGrid>
            <InfoItem>
              <label>Data</label>
              <div>{formatarData(viagem.data_entrada)}</div>
            </InfoItem>
            <InfoItem>
              <label>KM Inicial</label>
              <div>{viagem.km_saida || 'Não informado'} km</div>
            </InfoItem>
            <InfoItem>
              <label>KM Final</label>
              <div>{viagem.km_entrada || 'Não informado'} km</div>
            </InfoItem>
            <InfoItem>
              <label>Rota</label>
              <div>{viagem.cidade_saida} → {viagem.cidade_chegada}</div>
            </InfoItem>
            <InfoItem>
              <label>Peso</label>
              <div>{viagem.peso_saida || 0} toneladas</div>
            </InfoItem>
            <InfoItem>
              <label>Preço por Tonelada</label>
              <div>{formatarMoeda(viagem.preco_tonelada || 0)}</div>
            </InfoItem>
          </InfoGrid>
        </FormSection>

        {/* Abastecimentos */}
        {viagem.abastecimentos && viagem.abastecimentos.length > 0 && (
          <FormSection>
            <SectionTitle>
              <FaGasPump /> Abastecimentos
            </SectionTitle>
            <Table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Litros</th>
                  <th>Valor/Litro</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {viagem.abastecimentos.map((item, index) => (
                  <tr key={index}>
                    <td>{formatarData(item.data)}</td>
                    <td>{item.litros} L</td>
                    <td>{formatarMoeda(item.valor_litro)}</td>
                    <td>{formatarMoeda(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </FormSection>
        )}

        {/* Oficinas */}
        {viagem.oficinas && viagem.oficinas.length > 0 && (
          <FormSection>
            <SectionTitle>
              <FaWrench /> Manutenções
            </SectionTitle>
            <Table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {viagem.oficinas.map((item, index) => (
                  <tr key={index}>
                    <td>{formatarData(item.data)}</td>
                    <td>{item.tipo}</td>
                    <td>{formatarMoeda(item.preco)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </FormSection>
        )}

        {/* Pedágios */}
        {viagem.pedagios && viagem.pedagios.length > 0 && (
          <FormSection>
            <SectionTitle>
              <FaRoad /> Pedágios
            </SectionTitle>
            <Table>
              <thead>
                <tr>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {viagem.pedagios.map((item, index) => (
                  <tr key={index}>
                    <td>{formatarMoeda(item.valor)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </FormSection>
        )}

        <Button onClick={() => navigate('/pesquisar-viagens')}>
          Voltar para Pesquisar
        </Button>
      </Content>
    </Container>
  );
};

export default DetalhesViagem;