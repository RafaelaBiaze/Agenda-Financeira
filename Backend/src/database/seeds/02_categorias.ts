import type { Knex } from "knex";

export async function seed(knex: Knex) {

    await knex("categorias").del();

    // 1. Inserir Categorias
    const categorias = await knex("categorias").insert([
        { nome_categoria: "Receita de Vendas" },
        { nome_categoria: "Prestação de Serviços" },
        { nome_categoria: "Aluguel e Encargos" },
        { nome_categoria: "Energia Elétrica e Gás" },
        { nome_categoria: "Água e Saneamento" },
        { nome_categoria: "Internet e Comunicação" },
        { nome_categoria: "Salários e Benefícios" },
        { nome_categoria: "Impostos e Taxas" },
        { nome_categoria: "Materiais de Escritório" },
        { nome_categoria: "Manutenção e Reparos" }
    ]).returning("*");

};
