import type { Knex } from "knex";

export async function up(knex: Knex) {
  return knex.schema
    // 1. Tabela de Categorias (Independente)
    .createTable("categorias", (table) => {
      table.increments("id_categoria").primary(); // PK
      table.string("nome_categoria", 100).notNullable();
    })
    
    // 2. Tabela de Responsáveis (Independente)
    .createTable("responsaveis", (table) => {
      table.increments("id_responsavel").primary(); // PK
      table.string("nome", 150).notNullable();
      table.string("tipo", 20).notNullable(); // funcionário ou fornecedor
      table.text("observacoes");
    })
    
    // 3. Tabela de Contas (Depende de Categorias e Responsáveis)
    .createTable("contas", (table) => {
      table.increments("id_conta").primary(); // PK
      table.string("descricao").notNullable();
      table.decimal("valor", 10, 2).notNullable();
      table.date("data_vencimento").notNullable();
      table.string("status", 20).defaultTo("pendente"); // pago, pendente, atrasado
      table.date("data_pagamento"); // Opcional
      
      // Chaves Estrangeiras (FKs) e Relacionamentos
      // Uma conta deve obrigatoriamente ter uma categoria
      table.integer("id_categoria")
        .unsigned()
        .references("id_categoria")
        .inTable("categorias")
        .onDelete("RESTRICT") 
        .notNullable();
        
      // Uma conta deve obrigatoriamente estar vinculada a um responsável
      table.integer("id_responsavel")
        .unsigned()
        .references("id_responsavel")
        .inTable("responsaveis")
        .onDelete("RESTRICT")
        .notNullable();
        
      table.timestamps(true, true); // created_at e updated_at
    })
    
    // 4. Tabela de Comprovantes (Depende de Contas)
    .createTable("comprovantes", (table) => {
      table.increments("id_comprovante").primary(); // PK
      table.string("caminho_arquivo").notNullable();
      table.timestamp("data_upload").defaultTo(knex.fn.now());
      
      // Um comprovante deve estar vinculado a uma conta
      table.integer("id_conta")
        .unsigned()
        .references("id_conta")
        .inTable("contas")
        .onDelete("CASCADE") // Se a conta sumir, o comprovante também some 
        .notNullable();
    });
}

export async function down(knex: Knex) {
  // A ordem de exclusão deve ser a inversa da criação para evitar erros de FK
  return knex.schema
    .dropTableIfExists("comprovantes")
    .dropTableIfExists("contas")
    .dropTableIfExists("responsaveis")
    .dropTableIfExists("categorias");
}