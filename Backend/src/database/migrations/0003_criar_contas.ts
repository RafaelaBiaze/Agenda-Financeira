import type { Knex } from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("contas", (table) => {
    // Campos da tabela de contas
    table.increments("id_conta").primary();
    table.string("descricao").notNullable();
    table.decimal("valor", 10, 2).notNullable();
    table.date("data_vencimento").notNullable();
    table.string("status", 20).defaultTo("pendente");
    table.date("data_pagamento");
    // Relacionamentos com categorias e responsáveis
    table.integer("id_categoria").unsigned().notNullable()
      .references("id_categoria").inTable("categorias").onDelete("RESTRICT");

    table.integer("id_responsavel").unsigned().notNullable()
      .references("id_responsavel").inTable("responsaveis").onDelete("RESTRICT");

    table.integer("id_usuario")
      .unsigned() // Garante que não existam IDs negativos
      .notNullable() // Toda conta PRECISA de um dono
      .references("id_usuario") // Aponta para a coluna id_usuario,
      .inTable("usuarios") // da tabela usuarios.
      .onDelete("RESTRICT"); // Se o usuário for deletado, as contas dele devem permancer.

    table.timestamp("criado_em").defaultTo(knex.fn.now()); // created_at
    table.timestamp("atualizado_em").defaultTo(knex.fn.now()); // updated_at
  });
}
export async function down(knex: Knex) {
  return knex.schema.dropTable("contas");
}