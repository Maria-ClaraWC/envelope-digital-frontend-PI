import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Plus, Calendar, MapPin, Search, LogOut } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  // Mock user data
  const userName = "João Silva";

  // Mock trips data
  const trips = [
    {
      id: 1,
      startDate: '2024-03-10',
      endDate: '2024-03-12',
      origin: 'São Paulo - SP',
      destination: 'Rio de Janeiro - RJ',
    },
    {
      id: 2,
      startDate: '2024-03-05',
      endDate: '2024-03-07',
      origin: 'Rio de Janeiro - RJ',
      destination: 'Belo Horizonte - MG',
    },
  ];

  const filteredTrips = useMemo(() => {
    if (!search.trim()) return trips;
    const term = search.toLowerCase();
    return trips.filter(trip =>
      trip.origin.toLowerCase().includes(term) ||
      trip.destination.toLowerCase().includes(term)
    );
  }, [search, trips]);

  const handleLogout = () => {
    // Clear any saved auth state here
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="relative w-full md:w-2/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar viagens..."
            className="input-field w-full pl-10"
          />
        </div>

        <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-lg">
          <User size={24} className="text-primary" />
          <span className="text-gray-900 dark:text-gray-100 font-medium">{userName}</span>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center space-x-2 text-sm text-red-600 dark:text-red-300 hover:underline"
          >
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Add new trip card */}
        <div className="text-center mb-8">
          <Link to="/trip" className="card inline-block cursor-pointer hover:shadow-xl transition-shadow">
            <div className="flex flex-col items-center">
              <Plus size={60} className="text-primary mb-4" />
              <p className="text-xl font-medium text-gray-900 dark:text-gray-100">
                Adicionar nova viagem
              </p>
            </div>
          </Link>
        </div>

        <hr className="border-gray-300 dark:border-gray-600 mb-8" />

        {/* Past trips */}
        <div className="space-y-4">
          <h2 className="text-2xl font-serif font-bold text-center text-primary mb-6">
            Viagens Anteriores
          </h2>
          {filteredTrips.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400">Nenhuma viagem encontrada.</p>
          ) : (
            filteredTrips.map(trip => (
              <div key={trip.id} className="card cursor-pointer hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar size={20} className="text-primary" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {new Date(trip.startDate).toLocaleDateString('pt-BR')} - {new Date(trip.endDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin size={20} className="text-primary" />
                  <span className="text-gray-900 dark:text-gray-100">
                    {trip.origin} → {trip.destination}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Clique para ver o relatório da viagem
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;