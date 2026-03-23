import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import api from '../services/api';

// Ícones SVG simples (para não depender de react-icons)
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="10" cy="10" r="7" />
    <line x1="21" y1="21" x2="15" y2="15" />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

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
  color: #999;
  pointer-events: none;
  display: flex;
  align-items: center;
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
  padding: 10px 12px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid #f0f0f0;
  
  &:hover {
    background: #f5f5f5;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const CityName = styled.span`
  font-weight: 500;
  color: #333;
`;

const State = styled.span`
  margin-left: 8px;
  color: #666;
  font-size: 14px;
`;

const LoadingMessage = styled.div`
  padding: 12px;
  text-align: center;
  color: #666;
`;

const NoResults = styled.div`
  padding: 12px;
  text-align: center;
  color: #999;
`;

const CidadeSearch = ({ 
  onSelect, 
  placeholder = "Digite o nome da cidade ou UF...",
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim() && !selectedCity) {
        searchCities(searchTerm);
      } else if (!searchTerm.trim()) {
        setSuggestions([]);
      }
    }, 300);
    
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const searchCities = async (term) => {
    setLoading(true);
    try {
      const response = await api.get('/cidades', {
        params: { search: term, limit: 20 }
      });
      setSuggestions(response.data);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Erro ao buscar cidades:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

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
    setShowSuggestions(true);
    
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
          <SearchIcon />
        </SearchIconWrapper>
        <Input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => searchTerm.trim() && setShowSuggestions(true)}
          placeholder={placeholder}
          required={required}
          name={name}
          autoComplete="off"
        />
        {searchTerm && (
          <ClearButton onClick={handleClear} type="button">
            <CloseIcon />
          </ClearButton>
        )}
      </SearchInputWrapper>
      
      {showSuggestions && (
        <SuggestionsList>
          {loading && (
            <LoadingMessage>
              <span>🔍 Buscando cidades...</span>
            </LoadingMessage>
          )}
          
          {!loading && suggestions.length === 0 && searchTerm.trim() && (
            <NoResults>
              <span>😕 Nenhuma cidade encontrada</span>
            </NoResults>
          )}
          
          {!loading && suggestions.map((city) => (
            <SuggestionItem 
              key={city.id} 
              onClick={() => handleSelectCity(city)}
            >
              <CityName>{city.cidade}</CityName>
              <State>{city.estado_sigla}</State>
            </SuggestionItem>
          ))}
        </SuggestionsList>
      )}
    </SearchContainer>
  );
};

export default CidadeSearch;