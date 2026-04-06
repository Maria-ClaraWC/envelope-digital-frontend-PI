// src/components/CidadeSearch/index.js
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaSearch, FaTimes, FaCity, FaMapMarkerAlt } from 'react-icons/fa';

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
  color: #999;
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

const CidadeSearch = ({ 
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
  const wrapperRef = useRef(null);
  const debounceTimer = useRef(null);

  // Buscar cidades da API do IBGE
  const searchCities = async (term) => {
    if (!term || term.length < 3) {
      setSuggestions([]);
      return;
    }
    
    setLoading(true);
    try {
      // Buscar diretamente da API do IBGE
      const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome&nome=${encodeURIComponent(term)}`);
      const data = await response.json();
      
      if (data && Array.isArray(data)) {
        const formattedCities = data.slice(0, 15).map(city => ({
          id: city.id,
          cidade: city.nome,
          estado_sigla: city.microrregiao?.mesorregiao?.UF?.sigla || '',
          estado_nome: city.microrregiao?.mesorregiao?.UF?.nome || ''
        }));
        setSuggestions(formattedCities);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Erro ao buscar cidades:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce para não fazer muitas requisições
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    if (searchTerm.trim() && !selectedCity && searchTerm.length > 2) {
      debounceTimer.current = setTimeout(() => {
        searchCities(searchTerm);
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
  }, [searchTerm]);

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
      <SearchInputWrapper>
        <SearchIconWrapper>
          <FaSearch size={18} />
        </SearchIconWrapper>
        <Input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => searchTerm.trim() && !selectedCity && setShowSuggestions(true)}
          placeholder={placeholder}
          required={required}
          name={name}
          autoComplete="off"
        />
        {searchTerm && (
          <ClearButton onClick={handleClear} type="button">
            <FaTimes size={16} />
          </ClearButton>
        )}
      </SearchInputWrapper>
      
      {showSuggestions && (
        <SuggestionsList>
          {loading && (
            <LoadingMessage>
              <FaCity /> Buscando cidades...
            </LoadingMessage>
          )}
          
          {!loading && suggestions.length === 0 && searchTerm.trim() && searchTerm.length > 2 && (
            <NoResults>
              <FaMapMarkerAlt /> Nenhuma cidade encontrada
            </NoResults>
          )}
          
          {!loading && suggestions.map((city) => (
            <SuggestionItem 
              key={city.id} 
              onClick={() => handleSelectCity(city)}
            >
              <FaCity size={18} color="#9A6767" />
              <CityInfo>
                <CityName>{city.cidade}</CityName>
                <CityState>{city.estado_sigla}</CityState>
              </CityInfo>
            </SuggestionItem>
          ))}
        </SuggestionsList>
      )}
      
      {selectedCity && (
        <SelectedCity>
          <span>
            ✅ {selectedCity.cidade} - {selectedCity.estado_sigla}
          </span>
          <button onClick={handleClear}>
            <FaTimes />
          </button>
        </SelectedCity>
      )}
    </SearchContainer>
  );
};

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

export default CidadeSearch;