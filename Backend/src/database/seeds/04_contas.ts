import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {

    await knex("contas").del();

    // 1. Inserir algumas Contas para teste
    // Buscamos o usuário admin que criamos na seed 01(usuarios)
    const usuario = await knex("usuarios").first();
    
    // Buscamos as categorias que criamos na seed 02(categorias)
    const categorias = await knex("categorias").select("*");
    
    // Buscamos os responsáveis que criamos na seed 03(responsaveis)
    const responsaveis = await knex("responsaveis").select("*");

    // 2. Validação
    if (!usuario || categorias.length === 0 || responsaveis.length === 0) {
        throw new Error("Faltam dados básicos! Rode as seeds 01, 02 e 03 primeiro.");
    }

    // Função auxiliar para encontrar ID de categoria pelo nome
    // Se não encontrar, retorna o ID da primeira categoria (para evitar erros de FK)
    const getCatId = (nome: string) => 
        categorias.find(c => c.nome_categoria === nome)?.id_categoria || categorias[0].id_categoria;

    // 3. Inserindo as contas com relacionamentos corretos
    await knex("contas").insert([
        {
            descricao: "Aluguel da Sede - Março",
            valor: 2500.00,
            data_vencimento: "2026-03-10",
            status: "pago",
            data_pagamento: "2026-03-09",
            id_usuario: usuario.id_usuario,
            id_categoria: getCatId("Aluguel e Encargos"),
            id_responsavel: responsaveis.find(r => r.nome === "Construções S.A.")?.id_responsavel || responsaveis[0].id_responsavel
        },
        {
            descricao: "Conta de Luz - Fevereiro",
            valor: 450.75,
            data_vencimento: "2026-03-15",
            status: "pago",
            data_pagamento: "2026-03-14",
            id_usuario: usuario.id_usuario,
            id_categoria: getCatId("Energia Elétrica e Gás"),
            id_responsavel: responsaveis[0].id_responsavel
        },
        {
            descricao: "Internet Fibra Óptica",
            valor: 199.90,
            data_vencimento: "2026-03-20",
            status: "pendente",
            id_usuario: usuario.id_usuario,
            id_categoria: getCatId("Internet e Comunicação"),
            id_responsavel: responsaveis.find(r => r.nome === "Associação Comunitária")?.id_responsavel || responsaveis[1].id_responsavel
        },
        {
            descricao: "Compra de Cestas Básicas",
            valor: 1200.00,
            data_vencimento: "2026-03-05",
            status: "pago",
            data_pagamento: "2026-03-05",
            id_usuario: usuario.id_usuario,
            id_categoria: getCatId("Materiais de Escritório"),
            id_responsavel: responsaveis.find(r => r.nome === "Supermercado Sol Ltda")?.id_responsavel
        },
        {
            descricao: "Salário Coordenador Pedagógico",
            valor: 3500.00,
            data_vencimento: "2026-03-01",
            status: "pago",
            data_pagamento: "2026-03-01",
            id_usuario: usuario.id_usuario,
            id_categoria: getCatId("Salários e Benefícios"),
            id_responsavel: responsaveis.find(r => r.nome === "Carlos Eduardo Santos")?.id_responsavel
        },
        {
            descricao: "Reparo no Telhado",
            valor: 850.00,
            data_vencimento: "2026-03-25",
            status: "pendente",
            id_usuario: usuario.id_usuario,
            id_categoria: getCatId("Manutenção e Reparos"),
            id_responsavel: responsaveis.find(r => r.nome === "Ricardo Pereira")?.id_responsavel
        },
        {
            descricao: "Doação Recebida - Campanha Verão",
            valor: 5000.00,
            data_vencimento: "2026-03-18",
            status: "pago",
            data_pagamento: "2026-03-18",
            id_usuario: usuario.id_usuario,
            id_categoria: getCatId("Receita de Vendas"),
            id_responsavel: responsaveis.find(r => r.nome === "Mariana Oliveira")?.id_responsavel
        },
        {
            descricao: "Taxa Bancária Mensal",
            valor: 45.00,
            data_vencimento: "2026-03-30",
            status: "pendente",
            id_usuario: usuario.id_usuario,
            id_categoria: getCatId("Impostos e Taxas"),
            id_responsavel: responsaveis[0].id_responsavel
        },
        {
            descricao: "Material de Limpeza",
            valor: 320.40,
            data_vencimento: "2026-03-12",
            status: "atrasado",
            id_usuario: usuario.id_usuario,
            id_categoria: getCatId("Manutenção e Reparos"),
            id_responsavel: responsaveis.find(r => r.nome === "Limpeza Total Serviços")?.id_responsavel
        },
        {
            descricao: "Serviço de Psicologia Voluntária (Reembolso)",
            valor: 150.00,
            data_vencimento: "2026-03-28",
            status: "pendente",
            id_usuario: usuario.id_usuario,
            id_categoria: getCatId("Prestação de Serviços"),
            id_responsavel: responsaveis.find(r => r.nome === "Fernanda Costa Lima")?.id_responsavel
        }
    ]);
};
