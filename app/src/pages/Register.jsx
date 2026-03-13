import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';

const schema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido'),
  placa: z.string().regex(/^[A-Z]{3}-\d{4}$/, 'Placa inválida'),
  cnh: z.string().regex(/^\d{11}$/, 'CNH inválida'),
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

const Register = () => {
  const [registered, setRegistered] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
    setRegistered(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  const formatCPF = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const formatPlaca = (value) => {
    return value
      .replace(/[^A-Z0-9]/g, '')
      .replace(/([A-Z]{3})(\d)/, '$1-$2')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <Link to="/" className="flex items-center text-secondary mb-6">
          <ArrowLeft size={20} className="mr-2" />
          Voltar
        </Link>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <User size={24} className="text-primary" />
            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100">
              Cadastro de Motorista
            </h2>
          </div>
          {registered && (
            <div className="bg-emerald-100 text-emerald-900 dark:bg-emerald-800 dark:text-emerald-100 px-4 py-2 rounded-full text-sm">
              Cadastro concluído! Redirecionando...
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register('nome')}
              type="text"
              placeholder="Nome"
              className="input-field"
            />
            {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>}
          </div>
          <div>
            <input
              {...register('cpf')}
              type="text"
              placeholder="CPF"
              className="input-field"
              onChange={(e) => e.target.value = formatCPF(e.target.value)}
            />
            {errors.cpf && <p className="text-red-500 text-sm mt-1">{errors.cpf.message}</p>}
          </div>
          <div>
            <input
              {...register('placa')}
              type="text"
              placeholder="Placa"
              className="input-field"
              onChange={(e) => e.target.value = formatPlaca(e.target.value)}
            />
            {errors.placa && <p className="text-red-500 text-sm mt-1">{errors.placa.message}</p>}
          </div>
          <div>
            <input
              {...register('cnh')}
              type="text"
              placeholder="CNH"
              className="input-field"
              maxLength={11}
            />
            {errors.cnh && <p className="text-red-500 text-sm mt-1">{errors.cnh.message}</p>}
          </div>
          <div>
            <input
              {...register('email')}
              type="email"
              placeholder="E-mail"
              className="input-field"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <input
              {...register('senha')}
              type="password"
              placeholder="Senha"
              className="input-field"
            />
            {errors.senha && <p className="text-red-500 text-sm mt-1">{errors.senha.message}</p>}
          </div>
          <button type="submit" className="btn-primary w-full">
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;