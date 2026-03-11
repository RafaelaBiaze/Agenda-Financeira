import knex from 'knex';
import config from '../../knexfile.js'; // Ajuste o caminho se necessário

// Verificamos se a configuração existe, senão lançamos um erro claro
if (!config.development) {
    throw new Error("Configuração de desenvolvimento não encontrada no knexfile.");
}

// Usamos a configuração de desenvolvimento que limpamos
const connection = knex(config.development);

export default connection;