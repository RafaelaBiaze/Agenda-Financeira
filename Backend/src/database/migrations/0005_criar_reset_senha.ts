import type { Knex } from "knex";

export async function up(knex: Knex) {

    return knex.schema.createTable("reset_senha", (table) => {
        table.increments("id").primary();
        
        // FK ligando ao usuário
        table
            .integer("id_usuario")
            .unsigned()
            .notNullable()
            .references("id_usuario")
            .inTable("usuarios")
            .onDelete("CASCADE");

        // O token gerado pelo crypto
        table.string("token").notNullable().unique();
        table.timestamp("expiracao").notNullable();
        table.timestamp("criado_em").defaultTo(knex.fn.now());
    });

}

export async function down(knex: Knex) {
    return knex.schema.dropTable("reset_senha");
}