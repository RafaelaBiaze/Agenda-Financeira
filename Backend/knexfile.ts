// Update with your config settings.
import type { Knex } from "knex";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg", // Conforme requisito técnico, estamos usando PostgreSQL.
    connection: {
      host: "localhost",
      port: 5432,
      user: "admin",
      password: "123456",
      database: "ong_sol_encantado",
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