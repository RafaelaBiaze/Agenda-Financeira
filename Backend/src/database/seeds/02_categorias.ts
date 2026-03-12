import type { Knex } from "knex";

export async function seed(knex: Knex) {

    await knex("categorias").del();

    // 1. Inserir Categorias (conforme sugestões do cliente)
    const categorias = await knex("categorias").insert([
        { nome_categoria: "Aluguel" },
        { nome_categoria: "Salário" },
        { nome_categoria: "Materiais" },
        { nome_categoria: "Serviços" }
    ]).returning("*");

};
