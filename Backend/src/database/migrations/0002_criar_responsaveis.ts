import type { Knex } from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("responsaveis", (table) => {
    // Campos da tabela de responsáveis
    table.increments("id_responsavel").primary();
    table.string("nome", 150).notNullable();
    table.enum("tipo", ["F", "J"]).notNullable().defaultTo("F"); // F para pessoa física, J para pessoa jurídica
    table.string("documento", 18).notNullable(); // CPF ou CNPJ
    table.text("observacoes");
  });
}
export async function down(knex: Knex) {
  return knex.schema.dropTable("responsaveis");
}