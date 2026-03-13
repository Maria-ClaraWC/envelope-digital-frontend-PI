import { Link } from 'react-router-dom';
import { Truck } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <Truck size={120} className="mx-auto text-primary mb-4" />
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-2">
            Envelope Digital
          </h1>
          <p className="text-lg md:text-xl text-gray-700">
            Sistema para Caminhoneiros
          </p>
        </div>
        <div className="space-y-4">
          <Link to="/login" className="btn-primary block w-full max-w-xs mx-auto">
            Login
          </Link>
          <Link to="/register" className="btn-secondary block w-full max-w-xs mx-auto">
            Iniciar Cadastro
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;