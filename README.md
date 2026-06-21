# Agenda Financeira — Sol Encantado

Este é um sistema de gestão e controle financeiro desenvolvido sob medida para a **ONG Sol Encantado**, concebido como projeto prático no curso de **Análise e Desenvolvimento de Sistemas**. A solução visa mitigar as dificuldades de rastreamento operacional diário, centralizar a prestação de contas da organização, automatizar relatórios para auditoria e proteger dados sensíveis por meio de uma arquitetura de nuvem altamente segura.

---

## Sumário

1. [Objetivos](#-objetivos)
2. [Funcionalidades Principais por Nível de Acesso](#-funcionalidades-principais-por-nível-de-acesso)
3. [Stack Tecnológica](#-stack-tecnológica)
4. [Arquitetura de Infraestrutura em Produção](#-arquitetura-de-infraestrutura-em-produção)
5. [Detalhes da Aplicação e Guia de Deploy](#-detalhes-da-aplicação-e-guia-de-deploy)
   - [Procedimento de Cleanup, Manutenção e Descarte](#-procedimento-de-cleanup,-manutenção-e-descarte)
6. [Diferenciais](#-diferenciais)

---

## Objetivos

O sistema foi criado para resolver a dificuldade de organização financeira cotidiana. Ele permite:

* Monitorar gastos mensais e anuais.
* Evitar o esquecimento de contas através de uma agenda de vencimentos.
* Categorizar despesas para entender onde o dinheiro está sendo gasto.
* Anexar e visualizar comprovantes de pagamento de forma digital.
* Transparência Coletiva: Separação rígida de papéis operacionais (usuários comuns que lançam contas vs. administradores que auditam e cadastram dados estruturais).
* Segurança Institucional: Isolamento total dos dados financeiros de doadores e assistidos contra ataques externos vindos da internet pública.

---

## Funcionalidades Principais por Nível de Acesso

O sistema implementa um controle de acesso baseado em funções (RBAC), separando rigorosamente as tarefas cotidianas da gestão estratégica da ONG.

### Nível 1: Usuário Comum / Operacional
Destinado aos colaboradores responsáveis pelos lançamentos diários e rotinas administrativas de conferência.

* **CRUD de Contas:** Cadastro, visualização, edição e exclusão de contas a pagar e receber da organização.
* **Anexação de Comprovantes (.pdf):** Upload nativo e obrigatório de arquivos de comprovação técnica e fiscal estritamente no formato PDF.
* **Tabela de Auxílio Operacional:** Listagem dinâmica exibindo de forma clara todas as contas com status **Pendente** e **Em Atraso**, ajudando o operador a focar nos vencimentos imediatos.
* **Módulo de Relatórios e Filtros:** Geração de relatórios detalhados com opções avançadas de filtragem (por período, status, responsável ou categoria).
* **Exportação Multiformato:** Capacidade de exportar localmente os dados filtrados para arquivos **PDF parametrizados** ou planilhas consolidadas do **Excel (.xlsx)** para prestação de contas rápidas.

### Nível 2: Administrador (Admin)
Destinado à diretoria e conselho fiscal da ONG. Possui acesso total ao sistema, incluindo ferramentas de inteligência gerencial e controle estrutural.

* **Acesso Integral:** Inclui 100% das permissões do Usuário Operacional (CRUD de contas, relatórios e exportações).
* **Dashboard Gerencial Exclusivo:** Painel analítico centralizado que consolida a saúde financeira da ONG através de:
  * *Cards Indicadores de Saúde:* Resumos numéricos e visuais de Contas a Pagar, Contas Pagas e Contas em Atraso.
  * *Gráfico de Fluxo Mensal:* Histórico de evolução financeira consolidando até os últimos 6 meses de entradas e saídas.
  * *Gráfico de Barras por Categoria:* Exibição detalhada e comparativa das despesas divididas por categoria de centro de custo.
  * *Tabela de Controle Estratégico:* Listagem integrada na base do dashboard com as contas pendentes e atrasadas para tomada de decisão imediata.
* **Gestão Estrutural e Cadastros Base (CRUDs Restritos):** Apenas usuários administradores conseguem gerenciar os pilares do sistema:
  * *Cadastro de Usuários:* Controle, auditoria e criação de novas contas de operadores.
  * *Cadastro de Responsáveis:* Registro dos membros e colaboradores responsáveis por responder tecnicamente pelas contas.
  * *Cadastro de Categorias:* Definição dos centros de custo e destinação de verbas da ONG (ex: Projetos Sociais, Administrativo, Manutenção).

---

## Stack Tecnológica

O ecossistema do projeto foi construído utilizando tecnologias modernas de mercado, garantindo tipagem estática no desenvolvimento e alta performance em produção:

| Camada | Tecnologia / Biblioteca | Função Principal |
| :--- | :--- | :--- |
| **Frontend** | React.js (com Vite) | Construção da interface SPA (Single Page Application) responsiva e modular. |
| | TypeScript | Garantia de segurança em tempo de compilação e contratos de dados estritos. |
| | Bootstrap 5 | Framework de estilização com foco em responsividade (Mobile e Desktop). |
| | Chart.js / React-Chartjs-2 | Renderização de gráficos analíticos de fluxo de caixa e barras por categoria. |
| | jsPDF & XLSX (File-Saver) | Motores locais para compilação e download de balanços em PDF e Excel. |
| | Axios | Cliente HTTP responsável pelo consumo seguro da API REST. |
| **Backend** | Node.js / Express.js | Ambiente de execução escalável e framework para a arquitetura da API. |
| | Knex.js | Query Builder e motor de gerenciamento de banco de dados (Migrations e Seeds). |
| | Bcrypt | Algoritmo de hashing criptográfico para proteção irreversível de senhas. |
| | JSON Web Token (JWT) | Emissão de tokens de sessão com autenticação baseada em funções (*RBAC*). |
| | Express-Fileupload | Middleware focado no processamento eficiente do upload de comprovantes. |
| | Resend SDK | Integração externa para envio automatizado de e-mails de redefinição de senha. |
| | Date-fns | Biblioteca especializada no cálculo estrito de fusos horários e atrasos. |
| **Banco de Dados**| PostgreSQL 16 | Banco relacional robusto para armazenamento estruturado com integridade referencial. |

---

## Arquitetura de Infraestrutura em Produção

A topografia de rede na nuvem (**DigitalOcean**) foi desenhada sob os critérios rígidos de **Defesa em Profundidade**, eliminando completamente o acesso direto da internet ao banco de dados e utilizando servidores "Bare Metal/VPS Linux" nativos (sem a camada de virtualização do Docker no produto final) para extrair o máximo desempenho do sistema operacional.

```text
                           🌐 INTERNET PÚBLICA
                                    │
Tráfego Seguro (HTTPS: 443/HTTP: 80)│  ▲ Saída Segura via NAT (Updates)
       Acesso SSH Autenticado       │  │
────────────────────────────────────┼──┼───────────────────────────────────
 ☁️ DIGITALOCEAN CLOUD FIREWALL (Filtro Perimetral Externo)
────────────────────────────────────┼──┼───────────────────────────────────
                                    ▼  │
  ┌──────────────────────────────────────────────────────────────────────┐
  │ 💻 DROPLET 1: SERVIDOR DA APLICAÇÃO (A Fronteira / Gateway NAT)      │
  │ ├─ IP Público: Exposto (Vinculado ao DuckDNS)                        │
  │ ├─ Serviços Ativos:                                                  │
  │ │    ├── Nginx (Servidor Web de Arquivos Estáticos do Vite)          │
  │ │    ├── Nginx (Proxy Reverso apontando para a API local)            │
  │ │    └── Node.js Express API (Rodando nativo em segundo plano)       │
  │ └─ Regras do Kernel Linux (iptables):                                │
  │      ├── net.ipv4.ip_forward=1 (Encaminhamento Ativo)                │
  │      └── POSTROUTING Masquerade (Tradução de Rede / NAT para o Banco)│
  └─────────────────────────────────┬──▲─────────────────────────────────┘
                                    │  │
        Conexão SQL Interna (5432)  │  │ Requisições de Saída Mascaradas
                                    ▼  │
  ┌────────────────────────────────────────────────────────────────────────┐
  │ 🗄️ DROPLET 2: SERVIDOR DO BANCO DE DADOS (100% Isolado)                │
  │ ├─ IP Público: DESATIVADO / REMOVIDO                                   │
  │ ├─ Serviço Ativo: PostgreSQL 16 (Escutando apenas na interface VPC)    │
  │ └─ Rota Padrão (Linux Route): `default via IP_Privado_APP`(Gateway APP)│
  └────────────────────────────────────────────────────────────────────────┘
```

### Componentes de Segurança e Rede Utilizados:
1. **Firewalls:** Atuam em uma dupla camada de proteção. Externamente, formam uma barreira perimetral na nuvem que age antes mesmo do tráfego tocar as máquinas virtuais, liberando no servidor da Aplicação apenas as portas essenciais: **80 (HTTP), 443 (HTTPS) e 22 (SSH restrito)**. Internamente, o firewall nativo do Linux reforça o isolamento, garantindo que o servidor do Banco de Dados bloqueie 100% das conexões externas e aceite tráfego na porta 5432 exclusivamente vindo do IP privado da Aplicação.
2. **Isolamento via VPC (Virtual Private Cloud):** Uma rede local virtualizada e criptografada fornecida pela DigitalOcean. A comunicação entre a API (Node.js) e o Banco de Dados (PostgreSQL) ocorre estritamente por essa rede (`10.0.0.0/24`), trafegando de forma invisível para o resto da internet.
3. **Gateway NAT Customizado (IP Forwarding & Masquerading):** Como o servidor PostgreSQL não possui IP público por questões de segurança, ele seria incapaz de realizar tarefas vitais como atualizações de pacotes do sistema operativo (`apt update`). Para sanar isso, o **Droplet 1 (Aplicação)** atua como um roteador de saída. Através da ativação do encaminhamento de pacotes no kernel do Linux (`ip_forward`) e de regras de `POSTROUTING MASQUERADE` via `iptables`, o Banco envia requisições para a Aplicação, que mascara o pedido com seu IP público, busca na internet, e devolve ao Banco sem nunca expor a máquina interna.
4. **Nginx como Servidor Web e Proxy Reverso:** Na linha de frente, o Nginx atua entregando os arquivos compilados do React direto para o navegador dos usuários e atua como Proxy Reverso interceptando caminhos `/api` e redirecionando para a porta nativa do Node.js.
5. **DuckDNS & Certbot (Let's Encrypt):** Gerenciamento dinâmico de domínio e renovação automática de certificados SSL/TLS, garantindo criptografia ponta a ponta via protocolo HTTPS.

---

## Detalhes da Aplicação e Guia de Deploy

Este projeto foi arquitetado sob o modelo de **Infraestrutura Imutável** e **Orquestração de Contêineres**. Ele garante resiliência máxima através de healthchecks inteligentes e redes customizadas. O ecossistema é composto por:
- **Frontend:** React com Vite, compilado em Multi-stage build e servido via proxy reverso **Nginx** (Porta 80).
- **Backend:** API Node.js operando sob usuário *não-root* (segurança reforçada) com rota dedicada para monitoramento de saúde.
- **Banco de Dados:** PostgreSQL isolado na rede privada (`backend_network`) com persistência de dados garantida por volumes nomeados.

---

### Pré-requisitos
* [Docker](https://www.docker.com/) e Docker Compose instalados.
* [Git](https://git-scm.com/) instalado.
* [VS Code](https://code.visualstudio.com/) instalado. (**Opcional**)
* (Deploy em Nuvem) Instância EC2/Droplet com a porta 80 liberada no Security Group/Firewall.

---

### 1. Clonar o Repositório e Configurar Variáveis

> Para baixar o código do projeto para o seu computador/servidor, digite os comandos no terminal(cmd):
```bash
# Clonar o projeto
git clone [https://github.com/RafaelaBiaze/Agenda-Financeira.git](https://github.com/RafaelaBiaze/Agenda-Financeira.git)

# Entrar na pasta do projeto
cd Agenda-Financeira

```

* **Atenção à configuração de ambiente:** O arquivo de configuração principal reside na **raiz do projeto**, pois o orquestrador precisa ter visão global de todas as pastas. Copie o template para gerar o seu arquivo:

> (**Windows**) Copie o template de exemplo e nomeie como `.env`

```bash
copy .env.example .env

```

> (**Linux/Mac**) Copie o template de exemplo e nomeie como `.env` 
> 
> 

```bash
cp .env.example .env

```

* Abra o arquivo `.env` gerado e configure suas chaves do JWT, credenciais do sistema e credenciais do Resend. Faça isso de acordo com as suas preferências num **Bloco de Notas ou IDE**.

---

### 2. Inicialização e Deploy

Graças à configuração avançada de `depends_on: condition: service_healthy`, o sistema respeita uma ordem estrita de inicialização: o Banco liga primeiro, a API aguarda a prontidão do banco para rodar as *Migrations* e as *Seeds*, e só então o Nginx libera o acesso à interface.

> Dê o comando para a construir as imagens e inicializar o sistema em segundo plano:

```bash
docker compose up -d --build

```

---

### 3. Validação de Healthchecks e Conectividade

Para fins de avaliação técnica e auditoria, execute os comandos abaixo no terminal para comprovar a resiliência e o isolamento das redes.

> **1. Verificar Status "Healthy" dos Contêineres:**

```bash
docker compose ps

```

*(Todos os serviços devem exibir a flag `Up (healthy)`, atestando que os testes internos do Nginx, Node.js e PostgreSQL estão operacionais).*

> **2. Teste de Conectividade e Resolução de DNS Interna:**
> Para provar que o contêiner do Nginx (Frontend) consegue encontrar o contêiner do Node.js (Backend) utilizando apenas o nome do serviço, entre no shell do frontend e dispare uma requisição:

```bash
docker exec -it agenda_nginx sh
curl http://backend:3333/
exit

```

*(O retorno esperado é a confirmação de que a API está Online e Saudável com status HTTP 200).*

---

### 4. Procedimento de Cleanup, Manutenção e Descarte

Para garantir a gestão rigorosa de custos na nuvem e a saúde do ambiente de desenvolvimento local, os procedimentos de limpeza estão divididos em três frentes: Descarte Definitivo, Manutenção de Cache e Fluxo de Reinicialização.

#### 4.1. Descarte do Ambiente (Gestão de Custos)

Utilize estes passos após o uso para derrubar a infraestrutura e evitar cobranças inesperadas.

> **1. Limpeza da Orquestração Docker:**
> O comando abaixo encerra todos os contêineres, deleta as redes isoladas e remove permanentemente os volumes nomeados (apagando todos os dados do banco de dados).

```bash
docker compose down -v

```

> **2. Descarte na Nuvem (Ex: AWS / DigitalOcean):**
> Acesse o painel da sua provedora de nuvem e certifique-se de executar as seguintes limpezas:
> * Deletar (*Terminate/Destroy*) a máquina virtual (EC2/Droplet).
> * Remover IPs Elásticos fixados.
> * Excluir NAT Gateways (se aplicável na VPC).
> * Desregistrar imagens e excluir Snapshots/Volumes residuais.

---

#### 4.2. Troubleshooting e Limpeza Profunda do Docker

Estes comandos são ferramentas de diagnóstico essenciais caso o Docker apresente erros de "camadas corrompidas" ou para liberar espaço significativo no disco da máquina local. *(Digite `y` para confirmar a execução quando o terminal solicitar).*

> **Limpar o Cache de Construção (Build Cache):**
> Resolve falhas de build apagando todo o histórico e forçando o Docker a ler os Dockerfiles linha por linha na próxima execução.

```bash
docker builder prune -a

```

> **A "Faxina Completa" do Sistema:**
> Comando poderoso que varre o sistema e apaga **tudo que não estiver rodando no momento**: contêineres parados, redes não utilizadas e imagens "órfãs" de projetos antigos.

```bash
docker system prune -a

```

> **A Faxina Extrema (Sistema + Volumes Soltos):**
> ⚠️ *Cuidado: Este comando é agressivo e apagará dados persistidos de quaisquer contêineres e projetos que não estejam rodando no momento.*

```bash
docker system prune -a --volumes

```

---

#### 4.3. Resumo para o Dia a Dia: Reinicialização Limpa

Se for necessário aplicar alterações estruturais e reiniciar o projeto do absoluto zero (sem nenhum resquício de código em cache ou banco de dados antigo), a sequência perfeita de comandos é:

1. Derruba a orquestração atual e seus dados:

```bash
docker compose down -v

```

2. Limpa o cache de compilação antigo:

```bash
docker builder prune -a

```

3. Reconstrói e sobe toda a infraestrutura limpa:

```bash
docker compose up -d --build

```
---

## Diferenciais

* **Separação Rígida de Responsabilidades (SoC):** Se a interface sofrer uma sobrecarga massiva de acessos, apenas o Droplet de Aplicação sofrerá estresse de CPU. O banco de dados permanece operando de forma estável, isolado do tráfego web direto.
* **Firewall em Camada de Provedor:** A infraestrutura rejeita requisições maliciosas na borda da DigitalOcean. Pacotes de varredura ou ataques de força bruta sequer consomem banda ou memória RAM do sistema operacional das VPSs.
* **Mitigação Completa de Ataques de Vetor Direto:** Como a máquina PostgreSQL não possui um endereço IP público roteável, torna-se virtualmente impossível realizar um ataque direto por varredura de portas (port scanning) ou injeção de conexões externas na porta 5432.