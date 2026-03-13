# Envelope Digital – Frontend

Interface web do sistema **Envelope Digital**, desenvolvida em **React**, como parte do **Projeto Integrador do curso Programador Web – Senac**.

A aplicação permite registrar e acompanhar despesas de viagem de caminhoneiros de forma digital.

---

# Objetivo do sistema

O projeto foi inspirado em um **modelo real de envelope de controle de viagem**, utilizado por caminhoneiros para registrar gastos durante suas rotas.

O objetivo é transformar esse processo manual em uma **aplicação web simples, organizada e acessível**.

---

# Tecnologias utilizadas

* React
* JavaScript
* HTML
* CSS
* Axios
* React Router
* Git / GitHub

---

# Funcionalidades da aplicação

## Cadastro

* Motoristas
* Veículos

## Registro de viagem

* km de saída
* km de chegada
* associação com motorista e veículo

## Registro de despesas

Baseado no modelo do envelope:

* abastecimento
* pedágio
* peças
* troca de óleo
* outros gastos

## Visualização

* lista de despesas
* total de gastos
* resumo da viagem

---

# Estrutura do projeto

```
src
 ├── components
 ├── pages
 │   ├── Home
 │   ├── Motoristas
 │   ├── Veiculos
 │   ├── Viagens
 │   └── Despesas
 ├── services
 │   └── api.js
 ├── routes
 └── App.jsx
```

---

# Comunicação com a API

O front-end consome a API desenvolvida no projeto backend utilizando **Axios**.

Exemplo:

```
GET /motoristas
POST /viagens
POST /despesas
```

---

# Como executar o projeto

1 Clonar o repositório

```
git clone https://github.com/seu-repositorio/envelope-digital-frontend
```

2 Entrar na pasta

```
cd envelope-digital-frontend
```

3 Instalar dependências

```
npm install
```

4 Executar aplicação

```
npm start
```

---

# Projeto Integrador

Projeto desenvolvido no **Curso Programador Web – Senac**, integrando conhecimentos de:

* desenvolvimento de interfaces web
* consumo de APIs
* organização de aplicações React
* integração front-end e back-end

---

# Licença

Projeto educacional desenvolvido para fins de aprendizagem.
