import type { Knex } from "knex";

export async function up(knex: Knex) {
  return knex.schema
    // Tabela de Usuarios
    .createTable("usuarios", (table) => {
        table.increments("id_usuario").primary(); // PK
        table.string("nome", 150).notNullable();
        table.string("email", 255).notNullable().unique();
        table.string("senha", 255).notNullable();
        table.timestamp("criado_em").defaultTo(knex.fn.now()); // created_at
        table.timestamp("atualizado_em").defaultTo(knex.fn.now()); // updated_at
    })
   
}

export async function down(knex: Knex) {
  // A ordem de exclusão deve ser a inversa da criação para evitar erros de FK
  return knex.schema
    .dropTableIfExists("usuarios");
}