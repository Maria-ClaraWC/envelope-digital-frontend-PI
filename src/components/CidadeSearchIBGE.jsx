import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import { FaSearch, FaTimes, FaCity, FaMapMarkerAlt } from 'react-icons/fa';

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
`;

const EstadoSelect = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 12px;
  background-color: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #9A6767;
    box-shadow: 0 0 0 2px rgba(154, 103, 103, 0.1);
  }
`;

const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: 12px;
  color: #999;
  pointer-events: none;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #666;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 35px 12px 40px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s;
  
  &:focus {
    outline: none;
    border-color: #9A6767;
    box-shadow: 0 0 0 2px rgba(154, 103, 103, 0.1);
  }
  
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
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
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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
    background: #f5f5f5;
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
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CityState = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 4px;
`;

const LoadingMessage = styled.div`
  padding: 12px;
  text-align: center;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const NoResults = styled.div`
  padding: 12px;
  text-align: center;
  color: #999;
`;

const SelectedCity = styled.div`
  background: #f5f5f5;
  padding: 10px 12px;
  border-radius: 8px;
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  span {
    font-size: 14px;
    color: #333;
  }
  
  button {
    background: none;
    border: none;
    color: #999;
    cursor: pointer;
    
    &:hover {
      color: #FF6B6B;
    }
  }
`;

const CidadeSearchIBGE = ({ 
  onSelect, 
  placeholder = "Digite o nome da cidade...",
  initialValue = "",
  required = false,
  name 
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [estados, setEstados] = useState([]);
  const [estadoSelecionado, setEstadoSelecionado] = useState('');
  const [todasCidades, setTodasCidades] = useState([]);
  const [carregandoCidades, setCarregandoCidades] = useState(false);
  const wrapperRef = useRef(null);

  // Carregar estados do IBGE
  useEffect(() => {
    const carregarEstados = async () => {
      try {
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
        const data = await response.json();
        setEstados(data);
      } catch (error) {
        console.error('Erro ao carregar estados:', error);
      }
    };
    carregarEstados();
  }, []);

  // Carregar cidades do estado selecionado
  useEffect(() => {
    const carregarCidades = async () => {
      if (!estadoSelecionado) {
        setTodasCidades([]);
        return;
      }
      
      setCarregandoCidades(true);
      try {
        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionado}/municipios?orderBy=nome`);
        const data = await response.json();
        setTodasCidades(data);
      } catch (error) {
        console.error('Erro ao carregar cidades:', error);
        setTodasCidades([]);
      } finally {
        setCarregandoCidades(false);
      }
    };
    carregarCidades();
  }, [estadoSelecionado]);

  // Filtro de cidades baseado no termo de busca
  useEffect(() => {
    if (searchTerm.trim() && todasCidades.length > 0 && !selectedCity) {
      const filtered = todasCidades.filter(cidade =>
        cidade.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 10)); // Limita a 10 resultados
      setShowSuggestions(true);
    } else if (!searchTerm.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, todasCidades, selectedCity]);

  // Fechar sugestões ao clicar fora
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
    setSearchTerm(`${city.nome} - ${estados.find(e => e.sigla === estadoSelecionado)?.sigla || ''}`);
    setShowSuggestions(false);
    if (onSelect) {
      onSelect({
        id: city.id,
        cidade: city.nome,
        estado_sigla: estadoSelecionado,
        estado_nome: estados.find(e => e.sigla === estadoSelecionado)?.nome
      });
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedCity(null);
    setShowSuggestions(true);
    
    if (onSelect && !value.trim()) {
      onSelect(null);
    }
  };

  const handleEstadoChange = (e) => {
    const uf = e.target.value;
    setEstadoSelecionado(uf);
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
      <EstadoSelect 
        value={estadoSelecionado} 
        onChange={handleEstadoChange}
      >
        <option value="">Selecione um estado</option>
        {estados.map(estado => (
          <option key={estado.id} value={estado.sigla}>
            {estado.nome} ({estado.sigla})
          </option>
        ))}
      </EstadoSelect>
      
      <SearchInputWrapper>
        <SearchIcon size={20} />
        <Input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => searchTerm.trim() && !selectedCity && setShowSuggestions(true)}
          placeholder={estadoSelecionado ? placeholder : "Primeiro selecione um estado"}
          disabled={!estadoSelecionado}
          required={required}
          name={name}
          autoComplete="off"
        />
        {searchTerm && (
          <ClearButton onClick={handleClear} type="button">
            <FaTimes size={18} />
          </ClearButton>
        )}
      </SearchInputWrapper>
      
      {showSuggestions && estadoSelecionado && (
        <SuggestionsList>
          {carregandoCidades && (
            <LoadingMessage>
              <FaCity /> Carregando cidades...
            </LoadingMessage>
          )}
          
          {!carregandoCidades && suggestions.length === 0 && searchTerm.trim() && (
            <NoResults>
              <FaMapMarkerAlt /> Nenhuma cidade encontrada neste estado
            </NoResults>
          )}
          
          {!carregandoCidades && suggestions.map((city) => (
            <SuggestionItem 
              key={city.id} 
              onClick={() => handleSelectCity(city)}
            >
              <FaCity size={18} color="#9A6767" />
              <CityInfo>
                <CityName>{city.nome}</CityName>
                <CityState>{estadoSelecionado}</CityState>
              </CityInfo>
            </SuggestionItem>
          ))}
        </SuggestionsList>
      )}
      
      {selectedCity && (
        <SelectedCity>
          <span>
            ✅ {selectedCity.nome} - {estadoSelecionado}
          </span>
          <button onClick={handleClear}>
            <FaTimes />
          </button>
        </SelectedCity>
      )}
    </SearchContainer>
  );
};

export default CidadeSearchIBGE;