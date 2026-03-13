import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const schema = z.object({
  identifier: z.string().min(1, 'Campo obrigatório'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });
  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log(data);
    // Handle login logic
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="card w-full max-w-md">
        <Link to="/" className="flex items-center text-primary mb-6">
          <ArrowLeft size={20} className="mr-2" />
          Voltar
        </Link>
        <h2 className="text-2xl font-serif font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
          Login
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
              Email ou CPF
            </label>
            <input
              {...register('identifier')}
              type="text"
              placeholder="Digite seu email ou CPF"
              className="input-field"
            />
            {errors.identifier && <p className="text-red-500 text-sm mt-1">{errors.identifier.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
              Senha
            </label>
            <input
              {...register('password')}
              type="password"
              placeholder="Digite sua senha"
              className="input-field"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>
          <button type="submit" className="btn-primary w-full">
            Entrar
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600 dark:text-gray-400">
          Não tem conta? <Link to="/register" className="text-primary hover:underline">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;