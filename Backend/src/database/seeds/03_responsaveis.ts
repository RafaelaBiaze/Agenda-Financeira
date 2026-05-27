import type { Knex } from "knex";

export async function seed(knex: Knex) {

    await knex("responsaveis").del();

    // 1. Inserir Responsáveis (Funcionário ou Fornecedor)
    await knex("responsaveis").insert([
        { nome: "Ana Silva", tipo: "F", documento: "12345678901", observacoes: "Voluntária da arrecadação" },
        { nome: "Supermercado Sol Ltda", tipo: "J", documento: "12345678000199", observacoes: "Fornecedor de cestas básicas" },
        { nome: "Carlos Eduardo Santos", tipo: "F", documento: "98765432100", observacoes: "Coordenador pedagógico" },
        { nome: "Limpeza Total Serviços", tipo: "J", documento: "55444333000122", observacoes: "Empresa de limpeza terceirizada" },
        { nome: "Associação Comunitária", tipo: "J", documento: "11222333000144", observacoes: "Parceiro doador" },
        { nome: "Mariana Oliveira", tipo: "F", documento: "44455566677", observacoes: "Doadora mensal" },
        { nome: "Padaria e Confeitaria Silva", tipo: "J", documento: "99888777000155", observacoes: "Fornecedor de lanches" },
        { nome: "Ricardo Pereira", tipo: "F", documento: "22233344455", observacoes: "Motorista voluntário" },
        { nome: "Construções S.A.", tipo: "J", documento: "77666555000100", observacoes: "Manutenção predial" },
        { nome: "Fernanda Costa Lima", tipo: "F", documento: "11122233344", observacoes: "Psicóloga voluntária" },
        { nome: "Sabesp", tipo: "J", documento: "43776517000180", observacoes: "Companhia de Saneamento" },
        { nome: "Enel Distribuição", tipo: "J", documento: "61695227000193", observacoes: "Companhia de Energia" },
        { nome: "Vivo Empresas", tipo: "J", documento: "02558157000162", observacoes: "Provedor de Internet/Telefonia" },
        { nome: "Kalunga S.A.", tipo: "J", documento: "43283811000150", observacoes: "Materiais de escritório" },
        { nome: "Posto Ipiranga", tipo: "J", documento: "33333333000199", observacoes: "Combustível para a van" },
        { nome: "Zoom Video Communications", tipo: "J", documento: "55555555000188", observacoes: "Licença de software" },
        { nome: "Gráfica Rápida Express", tipo: "J", documento: "88888888000177", observacoes: "Impressão de panfletos" },
        { nome: "Mercado Livre", tipo: "J", documento: "03007331000141", observacoes: "Compras diversas" },
        { nome: "João Pedro Batista", tipo: "F", documento: "33344455566", observacoes: "Assistente Administrativo" },
        { nome: "Clínica Saúde Total", tipo: "J", documento: "99999999000100", observacoes: "Exames admissionais" }
    ]).returning("*");
};
