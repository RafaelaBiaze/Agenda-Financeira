# Projeto de Sistema de Gestão Financeira Pessoal

Este projeto é uma plataforma web de controle financeiro desenvolvida como parte do curso de **Análise e Desenvolvimento de Sistemas**. O objetivo é permitir que o usuário gerencie suas contas a pagar e receber, visualize a saúde financeira através de dashboards inteligentes e mantenha um histórico organizado de comprovantes.

---

## Objetivo do Projeto

O sistema foi criado para resolver a dificuldade de organização financeira cotidiana. Ele permite:
* Monitorar gastos mensais e anuais.
* Evitar o esquecimento de contas através de uma agenda de vencimentos.
* Categorizar despesas para entender onde o dinheiro está sendo gasto.
* Anexar e visualizar comprovantes de pagamento de forma digital.

---

## Sumário

1. [Funcionalidades](#funcionalidades)
2. [Tecnologias e Ferramentas](#tecnologias-e-ferramentas)
3. [Instalação e Execução](#instalacao-e-execucao)
4. [Guia de Erros (Troubleshooting)](./docs/TROUBLESHOOTING.md)

---
## Funcionalidades <a name="funcionalidades"></a>

### Dashboard
* **Cards de Resumo:** Visualização rápida de Total Pago, Pendente e Contas em Atraso.
* **Gráfico de Fluxo de Caixa:** Evolução mensal dos gastos nos últimos 6 meses.
* **Gráfico de Categorias:** Distribuição percentual das despesas.
* **Agenda Rápida:** Tabela dinâmica com as próximas contas a vencer.

### Gestão de Contas
* **CRUD Completo:** Cadastro, edição, visualização e exclusão de contas.
* **Filtros Avançados:** Busca por descrição, mês, ano e status.
* **Ordenação e Paginação:** Controle total sobre grandes volumes de dados.
* **Anexos:** Upload de comprovantes em PDF para consulta rápida.
* **Exportação:** Permite exportar relatórios em PDFs e Planilhas de Excel.

---

## Principais Tecnologias e Ferramentas <a name="tecnologias-e-ferramentas"></a>

### Backend
* **Node.js** com **TypeScript**
* **Express** (Framework Web)
* **Knex.js** (Query Builder para Banco de Dados)
* **PostgreSQL** (Banco de Dados Relacional)
* **Date-fns** (Manipulação de datas)

### Frontend
* **React** com **Vite**
* **Bootstrap 5** (Estilização e Layout)
* **Chart.js** (Visualização de dados)
* **Axios** (Consumo de API)

### Infraestrutura/DevOps
* **Docker & Docker Compose** (Orquestração de containers)
* **Nginx** (Servidor Web e Proxy Reverso)

---

## Instalação e Execução <a name="instalacao-e-execucao"></a>

Siga os passos abaixo para rodar o projeto localmente, e rode os comandos num **terminal/prompt de comando (cmd)**:

### Pré-requisitos
* [Node.js](https://nodejs.org/) (v18 ou superior)
* [Docker](https://www.docker.com/) e Docker Compose instalados.
* [Visual Studio Code](https://code.visualstudio.com/) ou qualquer outra IDE. (opcional)

### 1. Clonar o Repositório
```bash
git clone https://github.com/RafaelaBiaze/Agenda-Financeira.git
```

### 2. Instalar as dependêcias do Backend e Frontend

#### Backend
>Para entrar no repositório
```bash
cd Agenda-Financeira
```
>Para entrar na pasta Backend
```bash
cd backend
```
>Para instalar as dependências
```bash
npm install
```

#### Frontend
>Partindo do ultimo comando de cima, você volta uma pasta
```bash
cd ..
```
>Para entrar na pasta Frontend
```bash
cd frontend
```
>Para instalar as dependências
```bash
npm install
```

### 3. Configurar o ambiente
>Volte para a pasta do Backend, para voltar uma pasta utilize `cd ..`
```bash
cd backend
```
>(**Windows**) Copie o template de exemplo e nomeie como `.env`
```bash
copy .env.example .env
```
>(**Linux**) Copie o template de exemplo e nomeie como `.env`
```bash
cp .env.example .env
```
* **O arquivo `.env` é onde fica as senhas e dados do nosso banco, jwt e do pgAdmin, configure-o de acordo com as suas preferências num Bloco de Notas ou IDE (Visual Studio Code).**

### 4. Inicialização do sistema

>Depois de configurar o `.env`, dê o comando para a inicialização do sistema
```bash
docker-compose up
```

### **Dificuldades na configuração?** Se algo não funcionou como esperado, confira nosso [Guia de Solução de Problemas](./docs/TROUBLESHOOTING.md).

---

## Acesse 
* **Aplicação**: http://localhost