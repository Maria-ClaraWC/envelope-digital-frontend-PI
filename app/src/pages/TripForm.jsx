import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, User } from 'lucide-react';
import CityStatePicker from '../components/CityStatePicker';

const schema = z.object({
  startDate: z.string().min(1, 'Data de início é obrigatória'),
  endDate: z.string().min(1, 'Data de fim é obrigatória'),
  startKm: z.number().min(0, 'KM inicial deve ser maior ou igual a 0'),
  endKm: z.number().min(0, 'KM final deve ser maior ou igual a 0'),
  originCity: z.string().min(1, 'Cidade de origem é obrigatória'),
  originState: z.string().min(1, 'Estado de origem é obrigatório'),
  destinationCity: z.string().min(1, 'Cidade de destino é obrigatória'),
  destinationState: z.string().min(1, 'Estado de destino é obrigatório'),
  startWeight: z.number().min(0, 'Peso inicial deve ser maior ou igual a 0'),
  endWeight: z.number().min(0, 'Peso final deve ser maior ou igual a 0'),
  pricePerTon: z.number().min(0.01, 'Preço por tonelada deve ser maior que 0'),
  fuel: z.array(z.object({
    date: z.string().min(1, 'Data é obrigatória'),
    km: z.number().min(0, 'KM deve ser maior ou igual a 0'),
    station: z.string().min(1, 'Posto é obrigatório'),
    liters: z.number().min(0.01, 'Litros deve ser maior que 0'),
    pricePerLiter: z.number().min(0.01, 'Preço por litro deve ser maior que 0'),
  })),
  workshop: z.array(z.object({
    date: z.string().min(1, 'Data é obrigatória'),
    km: z.number().min(0, 'KM deve ser maior ou igual a 0'),
    type: z.string().min(1, 'Tipo é obrigatório'),
    amount: z.number().min(0.01, 'Valor deve ser maior que 0'),
  })),

  toll: z.array(z.object({
    date: z.string().min(1, 'Data é obrigatória'),
    km: z.number().min(0, 'KM deve ser maior ou igual a 0'),
    amount: z.number().min(0.01, 'Valor deve ser maior que 0'),
  })),
  tips: z.array(z.object({
    date: z.string().min(1, 'Data é obrigatória'),
    km: z.number().min(0, 'KM deve ser maior ou igual a 0'),
    amount: z.number().min(0.01, 'Valor deve ser maior que 0'),
  })),
  missingGoods: z.boolean(),
  missingKilos: z.number().optional(),
  missingCost: z.number().optional(),
});

const TripForm = () => {
  const [missingGoods, setMissingGoods] = useState(false);

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fuel: [{ date: '', km: 0, station: '', liters: 0, pricePerLiter: 0 }],
      workshop: [{ date: '', km: 0, type: '', amount: 0 }],
      toll: [{ date: '', km: 0, amount: 0 }],
      tips: [{ date: '', km: 0, amount: 0 }],
      missingGoods: false,
    },
  });

  const { fields: fuelFields, append: appendFuel, remove: removeFuel } = useFieldArray({
    control,
    name: 'fuel',
  });

  const { fields: workshopFields, append: appendWorkshop, remove: removeWorkshop } = useFieldArray({
    control,
    name: 'workshop',
  });

  const { fields: tollFields, append: appendToll, remove: removeToll } = useFieldArray({
    control,
    name: 'toll',
  });

  const { fields: tipsFields, append: appendTips, remove: removeTips } = useFieldArray({
    control,
    name: 'tips',
  });

  const watchedValues = watch();

  const totalValue = (watchedValues.startWeight || 0) * (watchedValues.pricePerTon || 0);
  const advance = totalValue * 0.8;
  const paymentOrder = advance;

  const totalFuel = watchedValues.fuel?.reduce((sum, item) => sum + ((item.liters || 0) * (item.pricePerLiter || 0)), 0) || 0;
  const totalWorkshop = watchedValues.workshop?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
  const totalToll = watchedValues.toll?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
  const totalTips = watchedValues.tips?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
  const totalMissing = missingGoods ? (watchedValues.missingKilos || 0) * (watchedValues.missingCost || 0) : 0;

  const totalExpenses = totalFuel + totalWorkshop + totalToll + totalTips + totalMissing;
  const commission = totalValue * 0.1;
  const netValue = totalValue - totalExpenses - commission;

  const onSubmit = (data) => {
    console.log(data);
    // Handle trip submission
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/dashboard" className="flex items-center text-primary mb-6">
          <ArrowLeft size={20} className="mr-2" />
          Voltar ao Dashboard
        </Link>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <User size={24} className="text-primary" />
            <h1 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100">
              Cadastro de Viagem
            </h1>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-medium text-center mb-6 text-gray-900 dark:text-gray-100">
            Preencha os dados abaixo para salvar a viagem
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Dates and KM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Data de Início</label>
                <input
                  {...register('startDate')}
                  type="date"
                  className="input-field"
                />
                {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Data do Fim</label>
                <input
                  {...register('endDate')}
                  type="date"
                  className="input-field"
                />
                {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">KM ao Sair</label>
                <input
                  {...register('startKm', { valueAsNumber: true })}
                  type="number"
                  className="input-field"
                />
                {errors.startKm && <p className="text-red-500 text-sm mt-1">{errors.startKm.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">KM ao Chegar</label>
                <input
                  {...register('endKm', { valueAsNumber: true })}
                  type="number"
                  className="input-field"
                />
                {errors.endKm && <p className="text-red-500 text-sm mt-1">{errors.endKm.message}</p>}
              </div>
            </div>

            {/* Origin */}
            <div>
              <label className="block text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">Local de Início</label>
              <CityStatePicker onSelect={(state, city) => {
                setValue('originState', state);
                setValue('originCity', city);
              }} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Estado (sigla)</label>
                  <input
                    value={watch('originState') || ''}
                    readOnly
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Cidade</label>
                  <input
                    value={watch('originCity') || ''}
                    readOnly
                    className="input-field"
                  />
                </div>
              </div>
              {errors.originCity && <p className="text-red-500 text-sm mt-1">{errors.originCity.message}</p>}
              {errors.originState && <p className="text-red-500 text-sm mt-1">{errors.originState.message}</p>}
            </div>

            {/* Destination */}
            <div>
              <label className="block text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">Local do Fim</label>
              <CityStatePicker onSelect={(state, city) => {
                setValue('destinationState', state);
                setValue('destinationCity', city);
              }} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Estado (sigla)</label>
                  <input
                    value={watch('destinationState') || ''}
                    readOnly
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Cidade</label>
                  <input
                    value={watch('destinationCity') || ''}
                    readOnly
                    className="input-field"
                  />
                </div>
              </div>
              {errors.destinationCity && <p className="text-red-500 text-sm mt-1">{errors.destinationCity.message}</p>}
              {errors.destinationState && <p className="text-red-500 text-sm mt-1">{errors.destinationState.message}</p>}
            </div>

            {/* Weights and Price */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Peso Início (toneladas)</label>
                <input
                  {...register('startWeight', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className="input-field"
                />
                {errors.startWeight && <p className="text-red-500 text-sm mt-1">{errors.startWeight.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Peso Fim (toneladas)</label>
                <input
                  {...register('endWeight', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className="input-field"
                />
                {errors.endWeight && <p className="text-red-500 text-sm mt-1">{errors.endWeight.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Preço Tonelada (R$)</label>
                <input
                  {...register('pricePerTon', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className="input-field"
                />
                {errors.pricePerTon && <p className="text-red-500 text-sm mt-1">{errors.pricePerTon.message}</p>}
              </div>
            </div>

            {/* Calculations */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Valor Total:</span> R$ {totalValue.toFixed(2)}
                </div>
                <div>
                  <span className="font-medium">Adiantamento (80%):</span> R$ {advance.toFixed(2)}
                </div>
                <div>
                  <span className="font-medium">Ordem de Pagamento:</span> R$ {paymentOrder.toFixed(2)}
                </div>
              </div>
            </div>

            <hr className="border-gray-300 dark:border-gray-600" />

            {/* Fuel */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Abastecimento</h3>
              <div className="overflow-x-auto mb-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2 text-gray-600 dark:text-gray-400">Data</th>
                      <th className="text-left py-2 text-gray-600 dark:text-gray-400">KM</th>
                      <th className="text-left py-2 text-gray-600 dark:text-gray-400">Posto</th>
                      <th className="text-left py-2 text-gray-600 dark:text-gray-400">Litros</th>
                      <th className="text-left py-2 text-gray-600 dark:text-gray-400">Valor/Litro</th>
                      <th className="text-left py-2 text-gray-600 dark:text-gray-400">Total</th>
                      <th className="text-left py-2 text-gray-600 dark:text-gray-400">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fuelFields.map((field, index) => (
                      <tr key={field.id} className="border-b border-gray-100 dark:border-gray-600">
                        <td className="py-2">
                          <input
                            {...register(`fuel.${index}.date`)}
                            type="date"
                            className="input-field w-full"
                          />
                        </td>
                        <td className="py-2">
                          <input
                            {...register(`fuel.${index}.km`, { valueAsNumber: true })}
                            type="number"
                            className="input-field w-full"
                          />
                        </td>
                        <td className="py-2">
                          <input
                            {...register(`fuel.${index}.station`)}
                            type="text"
                            className="input-field w-full"
                          />
                        </td>
                        <td className="py-2">
                          <input
                            {...register(`fuel.${index}.liters`, { valueAsNumber: true })}
                            type="number"
                            step="0.01"
                            className="input-field w-full"
                          />
                        </td>
                        <td className="py-2">
                          <input
                            {...register(`fuel.${index}.pricePerLiter`, { valueAsNumber: true })}
                            type="number"
                            step="0.01"
                            className="input-field w-full"
                          />
                        </td>
                        <td className="py-2 text-gray-900 dark:text-gray-100">
                          R$ {((watchedValues.fuel?.[index]?.liters || 0) * (watchedValues.fuel?.[index]?.pricePerLiter || 0)).toFixed(2)}
                        </td>
                        <td className="py-2">
                          <button
                            type="button"
                            onClick={() => removeFuel(index)}
                            className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                type="button"
                onClick={() => appendFuel({ date: '', km: 0, station: '', liters: 0, pricePerLiter: 0 })}
                className="flex items-center text-primary mb-2"
              >
                <Plus size={16} className="mr-1" />
                Adicionar
              </button>
              <div className="text-right font-medium">
                Total: R$ {totalFuel.toFixed(2)}
              </div>
            </div>

            <hr className="border-gray-300 dark:border-gray-600" />

            {/* Workshop */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Oficina</h3>
              <datalist id="workshop-types">
                <option value="Borracharia" />
                <option value="Peças" />
                <option value="Outro" />
              </datalist>
              <div className="overflow-x-auto mb-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2 text-gray-600 dark:text-gray-400">Data</th>
                      <th className="text-left py-2 text-gray-600 dark:text-gray-400">KM</th>
                      <th className="text-left py-2 text-gray-600 dark:text-gray-400">Tipo</th>
                      <th className="text-left py-2 text-gray-600 dark:text-gray-400">Valor</th>
                      <th className="text-left py-2 text-gray-600 dark:text-gray-400">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workshopFields.map((field, index) => (
                      <tr key={field.id} className="border-b border-gray-100 dark:border-gray-600">
                        <td className="py-2">
                          <input
                            {...register(`workshop.${index}.date`)}
                            type="date"
                            className="input-field w-full"
                          />
                        </td>
                        <td className="py-2">
                          <input
                            {...register(`workshop.${index}.km`, { valueAsNumber: true })}
                            type="number"
                            className="input-field w-full"
                          />
                        </td>
                        <td className="py-2">
                          <input
                            {...register(`workshop.${index}.type`)}
                            list="workshop-types"
                            placeholder="Digite ou escolha um tipo"
                            className="input-field w-full"
                          />
                        </td>
                        <td className="py-2">
                          <input
                            {...register(`workshop.${index}.amount`, { valueAsNumber: true })}
                            type="number"
                            step="0.01"
                            className="input-field w-full"
                          />
                        </td>
                        <td className="py-2">
                          <button
                            type="button"
                            onClick={() => removeWorkshop(index)}
                            className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                type="button"
              onClick={() => appendWorkshop({ date: '', km: 0, type: '', amount: 0 })}
                className="flex items-center text-primary mb-2"
              >
                <Plus size={16} className="mr-1" />
                Adicionar
              </button>
              <div className="text-right font-medium">
                Total Pago: R$ {totalWorkshop.toFixed(2)}
              </div>
            </div>

            <hr className="border-gray-300 dark:border-gray-600" />

            {/* Toll */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Pedágio</h3>
              <div className="overflow-x-auto mb-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2 text-gray-600 dark:text-gray-400">Data</th>
                      <th className="text-left py-2 text-gray-600 dark:text-gray-400">KM</th>
                      <th className="text-left py-2 text-gray-600 dark:text-gray-400">Valor</th>
                      <th className="text-left py-2 text-gray-600 dark:text-gray-400">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tollFields.map((field, index) => (
                      <tr key={field.id} className="border-b border-gray-100 dark:border-gray-600">
                        <td className="py-2">
                          <input
                            {...register(`toll.${index}.date`)}
                            type="date"
                            className="input-field w-full"
                          />
                        </td>
                        <td className="py-2">
                          <input
                            {...register(`toll.${index}.km`, { valueAsNumber: true })}
                            type="number"
                            className="input-field w-full"
                          />
                        </td>
                        <td className="py-2">
                          <input
                            {...register(`toll.${index}.amount`, { valueAsNumber: true })}
                            type="number"
                            step="0.01"
                            className="input-field w-full"
                          />
                        </td>
                        <td className="py-2">
                          <button
                            type="button"
                            onClick={() => removeToll(index)}
                            className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                type="button"
                onClick={() => appendToll({ date: '', km: 0, amount: 0 })}
                className="flex items-center text-primary mb-2"
              >
                <Plus size={16} className="mr-1" />
                Adicionar
              </button>
              <div className="text-right font-medium">
                Total Pago: R$ {totalToll.toFixed(2)}
              </div>
            </div>

            <hr className="border-gray-300 dark:border-gray-600" />

            {/* Other */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Outros</h3>
              <div className="mb-4">
                <p className="mb-2">Houve falta de mercadoria?</p>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="true"
                      checked={missingGoods}
                      onChange={() => {
                        setMissingGoods(true);
                        setValue('missingGoods', true);
                      }}
                      className="mr-2"
                    />
                    Sim
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="false"
                      checked={!missingGoods}
                      onChange={() => {
                        setMissingGoods(false);
                        setValue('missingGoods', false);
                      }}
                      className="mr-2"
                    />
                    Não
                  </label>
                </div>
              </div>
              <input type="hidden" {...register('missingGoods')} value={missingGoods} />
              {missingGoods && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Quantos kilos?</label>
                    <input
                      {...register('missingKilos', { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Quanto custou?</label>
                    <input
                      {...register('missingCost', { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      className="input-field"
                    />
                  </div>
                </div>
              )}
            </div>

            <hr className="border-gray-300 dark:border-gray-600" />

            {/* Tips */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Gorjetas</h3>
              <div className="overflow-x-auto mb-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2 text-gray-600 dark:text-gray-400">Data</th>
                      <th className="text-left py-2 text-gray-600 dark:text-gray-400">KM</th>
                      <th className="text-left py-2 text-gray-600 dark:text-gray-400">Valor</th>
                      <th className="text-left py-2 text-gray-600 dark:text-gray-400">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tipsFields.map((field, index) => (
                      <tr key={field.id} className="border-b border-gray-100 dark:border-gray-600">
                        <td className="py-2">
                          <input
                            {...register(`tips.${index}.date`)}
                            type="date"
                            className="input-field w-full"
                          />
                        </td>
                        <td className="py-2">
                          <input
                            {...register(`tips.${index}.km`, { valueAsNumber: true })}
                            type="number"
                            className="input-field w-full"
                          />
                        </td>
                        <td className="py-2">
                          <input
                            {...register(`tips.${index}.amount`, { valueAsNumber: true })}
                            type="number"
                            step="0.01"
                            className="input-field w-full"
                          />
                        </td>
                        <td className="py-2">
                          <button
                            type="button"
                            onClick={() => removeTips(index)}
                            className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                type="button"
                onClick={() => appendTips({ date: '', km: 0, amount: 0 })}
                className="flex items-center text-primary mb-2"
              >
                <Plus size={16} className="mr-1" />
                Adicionar
              </button>
              <div className="text-right font-medium">
                Total: R$ {totalTips.toFixed(2)}
              </div>
            </div>

            <hr className="border-gray-300 dark:border-gray-600" />

            {/* Summary */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Resumo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Bruto:</span>
                    <span>R$ {totalValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Falta de Mercadorias:</span>
                    <span>R$ {totalMissing.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total de Gastos:</span>
                    <span>R$ {totalExpenses.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Comissão:</span>
                    <span>R$ {commission.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total Líquido:</span>
                    <span>R$ {netValue.toFixed(2)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {/* Empty column as per requirements */}
                </div>
              </div>
            </div>

            <div className="text-center">
              <button type="submit" className="btn-primary">
                Finalizar Viagem
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TripForm;