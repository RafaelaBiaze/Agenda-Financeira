import type { Knex } from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("categorias", (table) => {
    // Campos da tabela de categorias
    table.increments("id_categoria").primary();
    table.string("nome_categoria", 100).notNullable();
    table.timestamp("criado_em").defaultTo(knex.fn.now()); // created_at
    table.timestamp("atualizado_em").defaultTo(knex.fn.now()); // updated_at
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("categorias");
}