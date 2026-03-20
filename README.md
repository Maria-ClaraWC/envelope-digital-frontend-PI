# Envelope Digital - Sistema de Controle de Viagens para Motoristas

Um sistema frontend completo para controle de viagens de caminhoneiros, desenvolvido com React, TypeScript e Tailwind CSS.

## 🎯 Funcionalidades

### 📱 Telas do Sistema
- **Tela Inicial**: Interface com ícone de caminhão e botões para login/cadastro
- **Cadastro de Motorista**: Formulário completo com validação de CPF, CNH, placa, etc.
- **Login**: Autenticação por email/CPF e senha
- **Dashboard**: Perfil do usuário, botão para nova viagem e histórico de viagens
- **Formulário de Viagem**: Cadastro detalhado com múltiplas seções

### 🚛 Formulário de Viagem
- **Datas e KM**: Início e fim da viagem com quilometragem
- **Locais**: Seleção de cidades e estados via API IBGE
- **Pesos**: Controle de peso inicial e final em toneladas
- **Preço**: Valor por tonelada com cálculos automáticos
- **Abastecimento**: Tabela dinâmica com posto, litros, preço e total
- **Oficina**: Gastos com borracharia/peças
- **Pedágio**: Controle de pedágios pagos
- **Gorjetas**: Registro de gorjetas recebidas
- **Outros**: Seção condicional para falta de mercadoria
- **Resumo**: Cálculos finais com bruto, gastos, comissão e líquido

## 🛠️ Tecnologias Utilizadas

- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **React Hook Form** + **Zod** para validações
- **React Router DOM** para navegação
- **Lucide React** para ícones
- **API IBGE** para cidades e estados brasileiros

## 🎨 Design

- **Cores**: Fundo `#E0D2BF`, botões/detalhes `#9A6767`
- **Fonte**: Serif para títulos
- **Responsivo**: Mobile-first design
- **Dark Mode**: Suporte completo ao modo escuro

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação

1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd envelope-digital-frontend-PI/app
```

2. Instale as dependências
```bash
npm install
```

3. Execute o servidor de desenvolvimento
```bash
npm run dev
```

4. Abra [http://localhost:5173](http://localhost:5173) no navegador

### Build para Produção

```bash
npm run build
```

## 📁 Estrutura do Projeto

```
app/
├── src/
│   ├── components/
│   │   └── CityStatePicker.tsx    # Componente para seleção de cidades/estados
│   ├── pages/
│   │   ├── Home.tsx              # Tela inicial
│   │   ├── Register.tsx          # Cadastro de motorista
│   │   ├── Login.tsx             # Login
│   │   ├── Dashboard.tsx         # Dashboard principal
│   │   └── TripForm.tsx          # Formulário de viagem
│   ├── App.tsx                   # Roteamento e configuração
│   ├── main.tsx                  # Ponto de entrada
│   └── index.css                 # Estilos globais
├── public/
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🔧 Funcionalidades Técnicas

### Validações
- CPF brasileiro
- CNH válida
- Placa de veículo
- Campos obrigatórios
- Tipos de dados corretos

### Cálculos Automáticos
- Valor total = peso × preço por tonelada
- Adiantamento = 80% do valor total
- Comissão = 10% do valor total
- Valor líquido = bruto - gastos - comissão

### Tabelas Dinâmicas
- Adição/remoção de linhas
- Cálculos em tempo real
- Validação individual por linha

### Integração IBGE
- Busca de estados brasileiros
- Seleção de cidades por estado
- Interface intuitiva

## 📱 Responsividade

O sistema é totalmente responsivo e otimizado para:
- 📱 Dispositivos móveis
- 📟 Tablets
- 💻 Desktops

## 🌙 Tema Dark/Light

Suporte completo a temas com alternância automática baseada nas preferências do sistema.

## 📋 Próximos Passos

- [ ] Integração com backend/API
- [ ] Persistência de dados
- [ ] Autenticação JWT
- [ ] Upload de imagens/documentos
- [ ] Relatórios e exportação
- [ ] Notificações push
- [ ] Geolocalização GPS

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## Estrutura do Projeto

```
app/
├── src/
│   ├── components/
│   │   └── CityStatePicker.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   └── TripForm.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

## Funcionalidades Específicas

### CityStatePicker
- Consome API oficial do IBGE
- Estados e cidades brasileiros
- Interface intuitiva com selects

### Formulário de Viagem
- Seleção de origem/destino via IBGE
- Cálculos automáticos: Valor Total = Preço Tonelada × Peso
- Adiantamento e Ordem de Pagamento = 80% do Total
- Despesas dinâmicas com useFieldArray
- Resumo em tempo real

### Validações
- React Hook Form com Zod
- Máscaras de input para CPF, Placa, CNH
- Campos obrigatórios e formatos específicos

## API IBGE

O componente CityStatePicker utiliza as seguintes endpoints:
- Estados: `https://servicodados.ibge.gov.br/api/v1/localidades/estados`
- Cidades: `https://servicodados.ibge.gov.br/api/v1/localidades/estados/{UF}/municipios`