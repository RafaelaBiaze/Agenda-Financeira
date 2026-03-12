import type { Knex } from "knex";

export async function seed(knex: Knex) {

    await knex("responsaveis").del();

    // 1. Inserir Responsáveis (Funcionário ou Fornecedor)
    const responsaveis = await knex("responsaveis").insert([
        { nome: "José Eduardo", tipo: "funcionário", observacoes: "Gestor Financeiro" },
        { nome: "Fornecedor de Energia", tipo: "fornecedor", observacoes: "Conta de Luz" },
        { nome: "Papelaria do Sol", tipo: "fornecedor", observacoes: "Materiais de escritório" }
    ]).returning("*");
};
