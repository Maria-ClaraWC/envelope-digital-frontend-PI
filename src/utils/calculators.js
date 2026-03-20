export const calculators = {
  calcularPrecoTotal: (peso, precoTonelada) => {
    return peso * precoTonelada;
  },

  calcularAdiantamento: (precoTotal) => {
    return precoTotal * 0.8; // 80% de adiantamento
  },

  somarValores: (valores) => {
    return valores.reduce((acc, curr) => acc + (curr || 0), 0);
  },

  calcularTotalGastos: (gastos) => {
    const { abastecimentos, oficinas, pedagios, faltaMercadoria, gorjetas } = gastos;
    return abastecimentos + oficinas + pedagios + faltaMercadoria + gorjetas;
  },

  calcularTotalLiquido: (totalBruto, totalGastos) => {
    return totalBruto - totalGastos;
  },

  calcularComissao: (totalLiquido, percentual = 0.1) => {
    return totalLiquido * percentual;
  },

  calcularMediaPorKM: (valor, km) => {
    if (km === 0) return 0;
    return valor / km;
  },

  calcularConsumoMedio: (litros, km) => {
    if (km === 0) return 0;
    return litros / km;
  }
};