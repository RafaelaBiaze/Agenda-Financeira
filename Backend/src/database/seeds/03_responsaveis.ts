import type { Knex } from "knex";

export async function seed(knex: Knex) {

    await knex("responsaveis").del();

    // 1. Inserir Responsáveis (Funcionário ou Fornecedor)
    const responsaveis = await knex("responsaveis").insert([
        { 
        nome: "Ana Silva", 
        tipo: "F", 
        documento: "12345678901", 
        observacoes: "Voluntária da arrecadação" 
        },
        { 
        nome: "Supermercado Sol Ltda", 
        tipo: "J", 
        documento: "12345678000199", 
        observacoes: "Fornecedor de cestas básicas" 
        },
        { 
        nome: "Carlos Eduardo Santos", 
        tipo: "F", 
        documento: "98765432100", 
        observacoes: "Coordenador pedagógico" 
        },
        { 
        nome: "Limpeza Total Serviços", 
        tipo: "J", 
        documento: "55444333000122", 
        observacoes: "Empresa de limpeza terceirizada" 
        },
        { 
        nome: "Associação Comunitária", 
        tipo: "J", 
        documento: "11222333000144", 
        observacoes: "Parceiro doador" 
        },
        { 
        nome: "Mariana Oliveira", 
        tipo: "F", 
        documento: "44455566677", 
        observacoes: "Doadora mensal" 
        },
        { 
        nome: "Padaria e Confeitaria Silva", 
        tipo: "J", 
        documento: "99888777000155", 
        observacoes: "Fornecedor de lanches" 
        },
        { 
        nome: "Ricardo Pereira", 
        tipo: "F", 
        documento: "22233344455", 
        observacoes: "Motorista voluntário" 
        },
        { 
        nome: "Construções S.A.", 
        tipo: "J", 
        documento: "77666555000100", 
        observacoes: "Manutenção predial" 
        },
        { 
        nome: "Fernanda Costa Lima", 
        tipo: "F", 
        documento: "11122233344", 
        observacoes: "Psicóloga voluntária" 
        }
    ]).returning("*");
};
