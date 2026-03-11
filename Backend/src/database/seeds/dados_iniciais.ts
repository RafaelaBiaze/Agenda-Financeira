import type { Knex } from "knex";

export async function seed(knex: Knex) {
  // 1. Limpar as tabelas antes de inserir para não duplicar dados
  await knex("comprovantes").del();
  await knex("contas").del();
  await knex("responsaveis").del();
  await knex("categorias").del();

  // 2. Inserir Categorias (conforme sugestões do cliente)
  const categorias = await knex("categorias").insert([
    { nome_categoria: "Aluguel" },
    { nome_categoria: "Salário" },
    { nome_categoria: "Materiais" },
    { nome_categoria: "Serviços" }
  ]).returning("*");

  // 3. Inserir Responsáveis (Funcionário ou Fornecedor)
  const responsaveis = await knex("responsaveis").insert([
    { nome: "José Eduardo", tipo: "funcionário", observacoes: "Gestor Financeiro" },
    { nome: "Fornecedor de Energia", tipo: "fornecedor", observacoes: "Conta de Luz" },
    { nome: "Papelaria do Sol", tipo: "fornecedor", observacoes: "Materiais de escritório" }
  ]).returning("*");

  // 4. Inserir algumas Contas para teste
  await knex("contas").insert([
    {
      descricao: "Pagamento Aluguel Sede",
      valor: 2500.00,
      data_vencimento: "2025-12-10",
      status: "pendente",
      id_categoria: categorias[0].id_categoria, // Aluguel
      id_responsavel: responsaveis[1].id_responsavel 
    },
    {
      descricao: "Salário Auxiliar Administrativo",
      valor: 1800.00,
      data_vencimento: "2025-12-05",
      status: "pago",
      data_pagamento: "2025-12-05",
      id_categoria: categorias[1].id_categoria, // Salário
      id_responsavel: responsaveis[0].id_responsavel // José Eduardo
    }
  ]);
}