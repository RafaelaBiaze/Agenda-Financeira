#!/bin/sh

echo "Aguardando o banco de dados..."

sleep 5 

echo "Rodando Migrations..."
npx knex migrate:latest

sleep 2

echo "Rodando Seeds..."
npx knex seed:run

sleep 2

echo "Iniciando o servidor..."
npm run dev