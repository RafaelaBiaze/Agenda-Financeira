import type { Knex } from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("comprovantes", (table) => {
    table.increments("id_comprovante").primary();
    table.string("caminho_arquivo").notNullable(); // O nome unico gerado pelo sistema
    table.string("nome_original").notNullable();   // O nome do arquivo enviado pelo usuário
    table.timestamp("data_upload").defaultTo(knex.fn.now());
    table.timestamp("atualizado_em").defaultTo(knex.fn.now()); // updated_at

    table.integer("id_conta").unsigned().notNullable()
      .references("id_conta").inTable("contas").onDelete("CASCADE");
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("comprovantes");
}