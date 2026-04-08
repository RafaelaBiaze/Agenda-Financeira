## Solução de Problemas (Troubleshooting)

Se você encontrar dificuldades ao iniciar o sistema, verifique os erros comuns listados abaixo:

### 1. Erro de Conexão com o Banco de Dados
**Sintoma:** O backend encerra com erro `ECONNREFUSED` ou "database does not exist".
* **Causa:** O container do PostgreSQL não subiu ou as credenciais no `.env` estão incorretas.
* **Solução:** 1. Certifique-se de que o Docker está rodando e execute `docker ps` para ver se o container `nome-do-banco` está ativo. **(O nome do banco é decidido na hora de edição do `.env`)**
    2. Verifique se você copiou o arquivo de exemplo: `copy .env.example .env` se for no **Windows**, se for no **Linux** use `cp .env.example .env`.
    3. Confira se as variáveis `PG_USER`, `PG_PASSWORD` e `PG_DB` no `.env` coincidem com as configuradas no `docker-compose.yml`.

### 2. Tabelas Não Encontradas (Erro 500 na API)
**Sintoma:** O servidor inicia, mas ao acessar o Dashboard, a API retorna erro de "relation 'contas' does not exist".
* **Causa:** As migrations do Knex não foram executadas.
* **Solução:** Na pasta `backend`, execute o comando:
    ```sh
    npx knex migrate:latest
    ```

### 3. Dashboard ou Gráficos Vazios
**Sintoma:** O sistema abre, mas não exibe dados.
* **Causa:** O banco de dados está vazio (sem registros).
* **Solução:** Execute as seeds para popular o sistema com dados de teste na pasta `backend`:
    ```sh
    npx knex seed:run
    ```

### 4. Erro de Porta em Uso
**Sintoma:** Erro `EADDRINUSE: address already in use :::8080` ou `:::5432`.
* **Causa:** Outra instância do Node, PostgreSQL ou outro serviço já está usando as portas do projeto.
* **Solução:** * Finalize processos antigos do Node.
    * Se você já tem um PostgreSQL instalado localmente na máquina (fora do Docker), ele pode estar ocupando a porta `5432`. Pare o serviço local ou altere a porta no `docker-compose.yml` e no `.env`.

### 5. Frontend Não Carrega Dados (CORS/Network Error)
**Sintoma:** O frontend abre, mas os cards e tabelas ficam carregando infinitamente ou dão erro de rede.
* **Causa:** O backend não está rodando ou a URL da API no frontend está incorreta.
* **Solução:** 1. Verifique se o terminal do backend exibe "Server running on port 8080".
    2. No frontend, verifique o arquivo `src/services/api.ts` e certifique-se de que a `baseURL` aponta para `http://localhost:8080`.

### 6. Problemas com Node Modules
**Sintoma:** Erro de "command not found" ou "cannot find module".
* **Causa:** Dependências não instaladas ou versão do Node incompatível.
* **Solução:** Delete a pasta `node_modules` e o arquivo `package-lock.json` e execute `npm install` novamente tanto na pasta `backend` quanto na `frontend`. Recomenda-se o uso do **Node LTS (v18 ou superior)**.