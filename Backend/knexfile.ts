// Update with your config settings.
import type { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg", // Conforme requisito técnico, estamos usando PostgreSQL.
    connection: {
      host: process.env.PG_HOST || "db",
      port: Number(process.env.PG_PORT) || 5432,
      user: process.env.PG_USER || "admin",
      password: process.env.PG_PASSWORD || "123456",
      database: process.env.PG_DB || "agenda_financeira",
    },
    // Pool de conexões para otimizar o uso do banco. O mínimo de conexões é 2 e o máximo é 10.
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./src/database/migrations",
      extension: "ts",
    },
    seeds: {
      directory: "./src/database/seeds",
      extension: "ts",
    },
  },
};

export default config;
  // staging: É como um "ensaio geral". É um servidor que imita o real para testes finais antes de entregar para o cliente.
  // staging: {
    //   client: 'postgresql',
    //   connection: {
      //     database: 'my_db',
      //     user:     'username',
      //     password: 'password'
      //   },
      //   pool: {
        //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
    //     tableName: 'knex_migrations'
    //   }
  // },
  
  // production: É a versão "ao vivo" do sistema, onde os dados reais da ONG seriam guardados quando o site estivesse publicado na nuvem.
  // production: {
    //   client: 'postgresql',
    //   connection: {
  //     database: 'my_db',
  //     user:     'username',
  //     password: 'password'
  //   },
  //   pool: {
    //     min: 2,
    //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations'
  //   }
  // }