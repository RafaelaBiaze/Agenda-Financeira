FROM node:25-alpine

# Instalação do curl para o Healthcheck e do tsx (limpa o cache do apk e do npm juntos)
RUN apk add --no-cache curl && \
    npm install -g tsx && \
    npm cache clean --force

# Diretório de trabalho obrigatório
WORKDIR /app

# Otimização de camadas: Instalando pacotes e limpando cache na mesma linha
COPY package*.json ./
RUN npm install && npm cache clean --force

# Copia o restante da API
COPY . .

# Dá permissão de execução ao entrypoint
RUN chmod +x entrypoint.sh

# SEGURANÇA: Transfere a posse dos arquivos para o usuário 'node' (não-root)
RUN chown -R node:node /app

# SEGURANÇA: Define o usuário não-root nativo da imagem para rodar a aplicação
USER node

EXPOSE 3333

ENTRYPOINT ["./entrypoint.sh"]