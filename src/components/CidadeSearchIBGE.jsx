// src/components/CidadeSearchIBGE.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { FaSearch, FaTimes, FaCity, FaSpinner, FaMapMarkerAlt } from 'react-icons/fa';

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.primary};
  pointer-events: none;
  display: flex;
  align-items: center;
  z-index: 1;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  
  &:hover {
    color: ${props => props.theme.colors.error};
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 35px 10px 38px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
  background-color: ${props => props.disabled ? '#f5f5f5' : 'white'};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(154, 103, 103, 0.1);
  }
`;

const SuggestionsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-top: 4px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  list-style: none;
  padding: 0;
`;

const SuggestionItem = styled.li`
  padding: 12px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 12px;
  
  &:hover {
    background: ${props => props.theme.colors.background}40;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const CityInfo = styled.div`
  flex: 1;
`;

const CityName = styled.div`
  font-weight: 500;
  color: #333;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const CityState = styled.div`
  font-size: 11px;
  color: #666;
  margin-top: 2px;
`;

const LoadingMessage = styled.div`
  padding: 12px;
  text-align: center;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
`;

const NoResults = styled.div`
  padding: 12px;
  text-align: center;
  color: #999;
  font-size: 13px;
`;

const StateBadge = styled.span`
  background: ${props => props.theme.colors.primary}15;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #333;
`;

const SelectedCityBadge = styled.div`
  background: ${props => props.theme.colors.primary}10;
  padding: 6px 12px;
  border-radius: 8px;
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  
  span {
    color: ${props => props.theme.colors.primary};
    font-weight: 500;
  }
  
  button {
    background: none;
    border: none;
    color: #999;
    cursor: pointer;
    
    &:hover {
      color: ${props => props.theme.colors.error};
    }
  }
`;

// Lista completa de estados brasileiros
const ESTADOS_BRASIL = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' }
];

const CidadeSearchIBGE = ({ 
  onSelect, 
  placeholder = "Digite o nome da cidade...",
  label,
  initialValue = null,
  required = false,
  name
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [cidadesCache, setCidadesCache] = useState({});
  const wrapperRef = useRef(null);
  const debounceTimer = useRef(null);

  useEffect(() => {
    if (initialValue && initialValue.cidade) {
      setSelectedCity(initialValue);
      setSearchTerm(`${initialValue.cidade} - ${initialValue.estado_sigla}`);
      setSelectedEstado(initialValue.estado_sigla);
    }
  }, [initialValue]);

  const buscarCidadesPorEstado = useCallback(async (estado) => {
    if (cidadesCache[estado]) {
      return cidadesCache[estado];
    }
    
    try {
      const response = await fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios?orderBy=nome`
      );
      const data = await response.json();
      
      const cidadesFormatadas = data.map(cidade => ({
        id: cidade.id,
        cidade: cidade.nome,
        estado_sigla: estado,
        estado_nome: ESTADOS_BRASIL.find(e => e.sigla === estado)?.nome || estado
      }));
      
      setCidadesCache(prev => ({ ...prev, [estado]: cidadesFormatadas }));
      return cidadesFormatadas;
    } catch (error) {
      console.error(`Erro ao buscar cidades do estado ${estado}:`, error);
      return [];
    }
  }, [cidadesCache]);

  const buscarCidadesBrasil = useCallback(async (term) => {
    try {
      const response = await fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome&nome=${encodeURIComponent(term)}`
      );
      let data = await response.json();
      
      if (!data || data.length === 0) {
        const responseAll = await fetch(
          'https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome'
        );
        const allCities = await responseAll.json();
        data = allCities.filter(city => 
          city.nome.toLowerCase().includes(term.toLowerCase())
        );
      }
      
      const cidadesFormatadas = data.slice(0, 50).map(cidade => ({
        id: cidade.id,
        cidade: cidade.nome,
        estado_sigla: cidade.microrregiao?.mesorregiao?.UF?.sigla || '',
        estado_nome: cidade.microrregiao?.mesorregiao?.UF?.nome || ''
      }));
      
      return cidadesFormatadas;
    } catch (error) {
      console.error('Erro ao buscar cidades do Brasil:', error);
      return [];
    }
  }, []);

  const buscarCidades = useCallback(async (term, estado) => {
    if (!term || term.length < 2) {
      setSuggestions([]);
      return;
    }
    
    setLoading(true);
    try {
      let resultados = [];
      
      if (estado) {
        const cidadesEstado = await buscarCidadesPorEstado(estado);
        resultados = cidadesEstado.filter(cidade =>
          cidade.cidade.toLowerCase().includes(term.toLowerCase())
        );
      } else {
        resultados = await buscarCidadesBrasil(term);
      }
      
      setSuggestions(resultados.slice(0, 30));
      setShowSuggestions(true);
    } catch (error) {
      console.error('Erro na busca:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [buscarCidadesPorEstado, buscarCidadesBrasil]);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    if (searchTerm.trim() && !selectedCity && searchTerm.length > 1) {
      debounceTimer.current = setTimeout(() => {
        buscarCidades(searchTerm, selectedEstado);
      }, 500);
    } else if (!searchTerm.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchTerm, selectedEstado, selectedCity, buscarCidades]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCity = (city) => {
    setSelectedCity(city);
    setSearchTerm(`${city.cidade} - ${city.estado_sigla}`);
    setShowSuggestions(false);
    if (onSelect) {
      onSelect(city);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedCity(null);
    
    if (onSelect && !value.trim()) {
      onSelect(null);
    }
  };

  const handleEstadoChange = (e) => {
    const estado = e.target.value;
    setSelectedEstado(estado);
    setSearchTerm('');
    setSelectedCity(null);
    setSuggestions([]);
    
    if (onSelect) {
      onSelect(null);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setSelectedCity(null);
    setSuggestions([]);
    setShowSuggestions(false);
    if (onSelect) {
      onSelect(null);
    }
  };

  return (
    <SearchContainer ref={wrapperRef}>
      {label && <Label>{label}</Label>}
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <select 
          value={selectedEstado}
          onChange={handleEstadoChange}
          style={{
            flex: 1,
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '13px',
            backgroundColor: 'white',
            cursor: 'pointer'
          }}
        >
          <option value="">🌎 Todos os Estados</option>
          {ESTADOS_BRASIL.map(estado => (
            <option key={estado.sigla} value={estado.sigla}>
              {estado.nome} ({estado.sigla})
            </option>
          ))}
        </select>
      </div>
      
      <SearchInputWrapper>
        <SearchIconWrapper>
          <FaSearch size={14} />
        </SearchIconWrapper>
        <Input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => searchTerm.trim() && !selectedCity && suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          required={required}
          name={name}
          autoComplete="off"
        />
        {searchTerm && (
          <ClearButton onClick={handleClear} type="button">
            <FaTimes size={14} />
          </ClearButton>
        )}
      </SearchInputWrapper>
      
      {showSuggestions && (
        <SuggestionsList>
          {loading && (
            <LoadingMessage>
              <FaSpinner className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
              Buscando cidades...
            </LoadingMessage>
          )}
          
          {!loading && suggestions.length === 0 && searchTerm.trim() && searchTerm.length > 1 && (
            <NoResults>
              <FaMapMarkerAlt size={14} />
              Nenhuma cidade encontrada
            </NoResults>
          )}
          
          {!loading && suggestions.map((city) => (
            <SuggestionItem 
              key={city.id} 
              onClick={() => handleSelectCity(city)}
            >
              <FaCity size={16} color="#9A6767" />
              <CityInfo>
                <CityName>
                  {city.cidade}
                  <StateBadge>{city.estado_sigla}</StateBadge>
                </CityName>
                <CityState>{city.estado_nome}</CityState>
              </CityInfo>
            </SuggestionItem>
          ))}
        </SuggestionsList>
      )}
      
      {selectedCity && (
        <SelectedCityBadge>
          <span>✅ {selectedCity.cidade} - {selectedCity.estado_sigla}</span>
          <button onClick={handleClear}>
            <FaTimes size={12} />
          </button>
        </SelectedCityBadge>
      )}
      
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </SearchContainer>
  );
};

export default CidadeSearchIBGE;