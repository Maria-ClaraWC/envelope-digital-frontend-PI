// services/demoService.js
export const demoService = {
  // Salvar viagem no localStorage
  salvarViagem: (viagem) => {
    try {
      const viagens = JSON.parse(localStorage.getItem('@App:viagens') || '[]');
      const novaViagem = {
        ...viagem,
        id: Date.now(),
        id_viagem: Date.now(),
        data_criacao: new Date().toISOString()
      };
      viagens.push(novaViagem);
      localStorage.setItem('@App:viagens', JSON.stringify(viagens));
      return { success: true, data: novaViagem };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Listar viagens
  listarViagens: (filtros = {}) => {
    try {
      let viagens = JSON.parse(localStorage.getItem('@App:viagens') || '[]');
      
      // Aplicar filtros
      if (filtros.id_saida) {
        viagens = viagens.filter(v => v.cidade_saida_id === filtros.id_saida);
      }
      if (filtros.id_chegada) {
        viagens = viagens.filter(v => v.cidade_chegada_id === filtros.id_chegada);
      }
      if (filtros.data_inicio) {
        viagens = viagens.filter(v => v.data_entrada >= filtros.data_inicio);
      }
      if (filtros.data_fim) {
        viagens = viagens.filter(v => v.data_entrada <= filtros.data_fim);
      }
      
      return { success: true, data: viagens };
    } catch (error) {
      return { success: false, error: error.message, data: [] };
    }
  },
  
  // Buscar viagem por ID
  buscarViagem: (id) => {
    try {
      const viagens = JSON.parse(localStorage.getItem('@App:viagens') || '[]');
      const viagem = viagens.find(v => v.id === parseInt(id) || v.id_viagem === parseInt(id));
      return { success: true, data: viagem || null };
    } catch (error) {
      return { success: false, error: error.message, data: null };
    }
  },
  
  // Limpar todos os dados (para teste)
  limparDados: () => {
    localStorage.removeItem('@App:viagens');
    return { success: true };
  }
};

export default demoService;