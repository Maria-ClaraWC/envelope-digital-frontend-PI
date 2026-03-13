import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TripForm from './pages/TripForm';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <Router>
      <div className="min-h-screen bg-background dark:bg-gray-950">
        <button
          onClick={toggleDarkMode}
          className="fixed top-4 right-4 z-50 bg-primary text-white rounded-full p-2 shadow-lg"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trip" element={<TripForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;