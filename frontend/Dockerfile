# Build (Compilação do React/Vite)
FROM node:25-alpine AS builder

# Diretório de trabalho obrigatório
WORKDIR /app

# Copia os pacotes e instala dependências limpando o cache na mesma camada
COPY package*.json ./
RUN npm install && npm cache clean --force

# Copia o resto do código e gera a pasta /dist
COPY . .
RUN npm run build

# Servidor Web (Nginx) para entregar a aplicação
FROM nginx:alpine

# Limpa a pasta padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia apenas os arquivos estáticos compilados do estágio anterior (builder)
COPY --from=builder /app/dist /usr/share/nginx/html

# Expõe a porta 80 do Nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]