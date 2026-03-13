import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const CityStatePicker = ({ onSelect }) => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => response.json())
      .then(data => setStates(data));
  }, []);

  useEffect(() => {
    if (selectedState) {
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios`)
        .then(response => response.json())
        .then(data => setCities(data));
    } else {
      setCities([]);
    }
  }, [selectedState]);

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setSelectedCity('');
    onSelect(state, '');
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    onSelect(selectedState, city);
  };

  return (
    <div className="flex space-x-4">
      <div className="flex-1">
        <label className="block text-sm font-medium mb-2">Estado</label>
        <div className="relative">
          <select
            value={selectedState}
            onChange={handleStateChange}
            className="input-field appearance-none pr-10"
          >
            <option value="">Selecione um estado</option>
            {states.map(state => (
              <option key={state.id} value={state.sigla}>{state.nome}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
        </div>
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium mb-2">Cidade</label>
        <div className="relative">
          <select
            value={selectedCity}
            onChange={handleCityChange}
            disabled={!selectedState}
            className="input-field appearance-none pr-10 disabled:opacity-50"
          >
            <option value="">Selecione uma cidade</option>
            {cities.map(city => (
              <option key={city.id} value={city.nome}>{city.nome}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
        </div>
      </div>
    </div>
  );
};

export default CityStatePicker;