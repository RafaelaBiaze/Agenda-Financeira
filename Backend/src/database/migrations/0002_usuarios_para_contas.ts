import type { Knex } from "knex";

export async function up(knex: Knex) {
  return knex.schema.alterTable("contas", (table) => {

    table.integer("id_usuario")
      .unsigned() // Garante que não existam IDs negativos
      .notNullable() // Toda conta PRECISA de um dono
      .references("id_usuario") // Aponta para a coluna id_usuario ->
      .inTable("usuarios") // -> da tabela usuarios.
      .onDelete("CASCADE"); // Se o usuário for deletado, as contas dele somem junto
  });

}

export async function down(knex: Knex) {
  // A ordem de exclusão deve ser a inversa da criação para evitar erros de FK
  return knex.schema.alterTable("contas", (table) => {
    table.dropColumn("id_usuario");
  });
}