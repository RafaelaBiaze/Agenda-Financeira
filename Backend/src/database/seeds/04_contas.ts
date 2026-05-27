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

    // 3. Função para buscar o ID da categoria e responsável dinamicamente
    const getCatId = (nome: string) => categorias.find(c => c.nome_categoria === nome)?.id_categoria || categorias[0].id_categoria;
    const getRespId = (nome: string) => responsaveis.find(r => r.nome === nome)?.id_responsavel || responsaveis[0].id_responsavel;

    const listaDeContas = [
        // ================= TESTE DE 7 MESES ATRÁS (OUTUBRO 2025 - DEVE SER ESCONDIDO) =================
        { id_usuario: 2, desc: "Impressora Quebrada (7 meses)", val: 450.00, venc: "2025-10-15", status: "pendente", pag: null, cat: "Manutenção e Reparos", resp: "Limpeza Total Serviços" },
        { id_usuario: 2, desc: "Materiais Antigos (6 meses)", val: 120.00, venc: "2025-11-28", status: "pendente", pag: null, cat: "Materiais de Escritório", resp: "Kalunga S.A." },

        // ================= TESTE DE 5 e 4 MESES ATRÁS (DEZ 2025 / JAN 2026 - DEVE APARECER EM ATRASADO) =================
        { id_usuario: 2, desc: "Conta de Água Esquecida (5 meses)", val: 85.00, venc: "2025-12-10", status: "pendente", pag: null, cat: "Água e Saneamento", resp: "Sabesp" },
        { id_usuario: 2, desc: "Internet Não Paga (4 meses)", val: 199.90, venc: "2026-01-20", status: "pendente", pag: null, cat: "Internet e Comunicação", resp: "Vivo Empresas" },

        // ================= MARÇO 2026 =================
        { id_usuario: 1,desc: "Aluguel da Sede (Março) - Boleto", val: 2500.00, venc: "2026-03-10", status: "pago", pag: "2026-03-09", cat: "Aluguel e Encargos", resp: "Construções S.A." },
        { id_usuario: 1,desc: "Conta de Luz - Débito", val: 450.75, venc: "2026-03-15", status: "pago", pag: "2026-03-14", cat: "Energia Elétrica e Gás", resp: "Enel Distribuição" },
        { id_usuario: 1,desc: "Conta de Água - PIX", val: 180.50, venc: "2026-03-12", status: "pago", pag: "2026-03-11", cat: "Água e Saneamento", resp: "Sabesp" },
        { id_usuario: 1,desc: "Internet Fibra Óptica - Cartão", val: 199.90, venc: "2026-03-20", status: "pago", pag: "2026-03-20", cat: "Internet e Comunicação", resp: "Vivo Empresas" },
        { id_usuario: 1,desc: "Cestas Básicas (Lote 1) - PIX", val: 1200.00, venc: "2026-03-05", status: "pago", pag: "2026-03-05", cat: "Alimentação e Nutrição", resp: "Supermercado Sol Ltda" },
        { id_usuario: 1,desc: "Salário Coordenador - PIX", val: 3500.00, venc: "2026-03-05", status: "pago", pag: "2026-03-05", cat: "Salários e Benefícios", resp: "Carlos Eduardo Santos" },
        { id_usuario: 1,desc: "Reparo no Telhado - Dinheiro", val: 850.00, venc: "2026-03-25", status: "pago", pag: "2026-03-24", cat: "Manutenção e Reparos", resp: "Ricardo Pereira" },
        { id_usuario: 1,desc: "Doação Campanha Verão - PIX", val: 5000.00, venc: "2026-03-18", status: "pago", pag: "2026-03-18", cat: "Receita de Vendas", resp: "Mariana Oliveira" },
        { id_usuario: 2,desc: "Material de Limpeza - Boleto", val: 320.40, venc: "2026-03-12", status: "pago", pag: "2026-03-11", cat: "Manutenção e Reparos", resp: "Limpeza Total Serviços" },
        { id_usuario: 2,desc: "Licença Zoom Pro - Cartão", val: 85.00, venc: "2026-03-15", status: "pago", pag: "2026-03-15", cat: "Software e Licenças", resp: "Zoom Video Communications" },

        // ================= ABRIL 2026 =================
        { id_usuario: 1,desc: "Aluguel da Sede (Abril) - Boleto", val: 2500.00, venc: "2026-04-10", status: "pago", pag: "2026-04-09", cat: "Aluguel e Encargos", resp: "Construções S.A." },
        { id_usuario: 1,desc: "Conta de Luz - Débito", val: 410.00, venc: "2026-04-15", status: "pago", pag: "2026-04-15", cat: "Energia Elétrica e Gás", resp: "Enel Distribuição" },
        { id_usuario: 1,desc: "Conta de Água - PIX", val: 190.00, venc: "2026-04-12", status: "pago", pag: "2026-04-12", cat: "Água e Saneamento", resp: "Sabesp" },
        { id_usuario: 1,desc: "Internet Fibra Óptica - Cartão", val: 199.90, venc: "2026-04-20", status: "pago", pag: "2026-04-20", cat: "Internet e Comunicação", resp: "Vivo Empresas" },
        { id_usuario: 1,desc: "Salário Coordenador - PIX", val: 3500.00, venc: "2026-04-05", status: "pago", pag: "2026-04-05", cat: "Salários e Benefícios", resp: "Carlos Eduardo Santos" },
        { id_usuario: 1,desc: "Cestas Básicas (Páscoa) - Boleto", val: 1500.00, venc: "2026-04-05", status: "pago", pag: "2026-04-04", cat: "Alimentação e Nutrição", resp: "Supermercado Sol Ltda" },
        { id_usuario: 2,desc: "Ovos de Páscoa Crianças - Boleto", val: 800.00, venc: "2026-04-08", status: "pago", pag: "2026-04-07", cat: "Eventos e Arrecadação", resp: "Mercado Livre" },
        { id_usuario: 2,desc: "Combustível Van - Cartão", val: 400.00, venc: "2026-04-28", status: "pago", pag: "2026-04-28", cat: "Transporte e Logística", resp: "Posto Ipiranga" },
        { id_usuario: 2,desc: "Limpeza Mensal - PIX", val: 600.00, venc: "2026-04-10", status: "pago", pag: "2026-04-10", cat: "Manutenção e Reparos", resp: "Limpeza Total Serviços" },
        { id_usuario: 2,desc: "Licença Zoom Pro - Cartão", val: 85.00, venc: "2026-04-15", status: "pago", pag: "2026-04-15", cat: "Software e Licenças", resp: "Zoom Video Communications" },
        { id_usuario: 2,desc: "Materiais de Arte - PIX", val: 220.00, venc: "2026-04-12", status: "pago", pag: "2026-04-11", cat: "Materiais de Escritório", resp: "Kalunga S.A." },
        { id_usuario: 2,desc: "Doação Padrinho - Transferência", val: 500.00, venc: "2026-04-20", status: "pago", pag: "2026-04-20", cat: "Receita de Vendas", resp: "Mariana Oliveira" },
        { id_usuario: 2,desc: "Seguro da Van - Boleto", val: 320.00, venc: "2026-04-25", status: "pago", pag: "2026-04-24", cat: "Transporte e Logística", resp: "João Pedro Batista" },
        { id_usuario: 2,desc: "Manutenção Ar Condicionado - PIX", val: 350.00, venc: "2026-04-18", status: "pago", pag: "2026-04-18", cat: "Manutenção e Reparos", resp: "Construções S.A." },
        { id_usuario: 2,desc: "Imposto INSS - Guia DAS", val: 450.00, venc: "2026-04-20", status: "pago", pag: "2026-04-20", cat: "Impostos e Taxas", resp: "Ana Silva" },

        // ================= MAIO 2026 =================
        { id_usuario: 1,desc: "Aluguel da Sede (Maio) - Boleto", val: 2500.00, venc: "2026-05-10", status: "pago", pag: "2026-05-09", cat: "Aluguel e Encargos", resp: "Construções S.A." },
        { id_usuario: 1,desc: "Conta de Luz - Débito", val: 430.00, venc: "2026-05-15", status: "pago", pag: "2026-05-15", cat: "Energia Elétrica e Gás", resp: "Enel Distribuição" },
        { id_usuario: 1,desc: "Conta de Água - PIX", val: 185.00, venc: "2026-05-12", status: "pago", pag: "2026-05-11", cat: "Água e Saneamento", resp: "Sabesp" },
        { id_usuario: 2,desc: "Salário Coordenador - PIX", val: 3500.00, venc: "2026-05-05", status: "pago", pag: "2026-05-05", cat: "Salários e Benefícios", resp: "Carlos Eduardo Santos" },
        { id_usuario: 2,desc: "Limpeza Mensal - PIX", val: 600.00, venc: "2026-05-10", status: "pago", pag: "2026-05-10", cat: "Manutenção e Reparos", resp: "Limpeza Total Serviços" },
        
        // --- AS DUAS CONTAS ATRASADAS PROPOSITALMENTE (Para mostrar o alerta vermelho) ---
        { id_usuario: 2,desc: "Internet Fibra Óptica - Boleto", val: 199.90, venc: "2026-05-20", status: "pendente", pag: null, cat: "Internet e Comunicação", resp: "Vivo Empresas" }, // Atrasou alguns dias!
        { id_usuario: 2,desc: "Impressão de Panfletos - PIX", val: 150.00, venc: "2026-05-25", status: "pendente", pag: null, cat: "Materiais de Escritório", resp: "Gráfica Rápida Express" }, // Atrasou ontem!
        
        // --- CONTAS PENDENTES PARA O FINAL DE MAIO ---
        { id_usuario: 2,desc: "Cestas Básicas (Maio) - Boleto", val: 1250.00, venc: "2026-05-30", status: "pendente", pag: null, cat: "Alimentação e Nutrição", resp: "Supermercado Sol Ltda" },
        { id_usuario: 2,desc: "Combustível Van - Cartão", val: 400.00, venc: "2026-05-28", status: "pendente", pag: null, cat: "Transporte e Logística", resp: "Posto Ipiranga" },
        { id_usuario: 2,desc: "Compra de Brinquedos - Cartão", val: 600.00, venc: "2026-05-31", status: "pendente", pag: null, cat: "Eventos e Arrecadação", resp: "Mercado Livre" },

        // ================= JUNHO E JULHO 2026 (Futuro - Tudo Pendente) =================
        { id_usuario: 2,desc: "Aluguel da Sede (Junho) - Boleto", val: 2500.00, venc: "2026-06-10", status: "pendente", pag: null, cat: "Aluguel e Encargos", resp: "Construções S.A." },
        { id_usuario: 2,desc: "Conta de Luz - Débito", val: 420.00, venc: "2026-06-15", status: "pendente", pag: null, cat: "Energia Elétrica e Gás", resp: "Enel Distribuição" },
        { id_usuario: 2,desc: "Conta de Água - PIX", val: 190.00, venc: "2026-06-12", status: "pendente", pag: null, cat: "Água e Saneamento", resp: "Sabesp" },
        { id_usuario: 2,desc: "Internet Fibra Óptica - Cartão", val: 199.90, venc: "2026-06-20", status: "pendente", pag: null, cat: "Internet e Comunicação", resp: "Vivo Empresas" },
        { id_usuario: 2,desc: "Salário Coordenador - PIX", val: 3500.00, venc: "2026-06-05", status: "pendente", pag: null, cat: "Salários e Benefícios", resp: "Carlos Eduardo Santos" },
        { id_usuario: 2,desc: "Limpeza Mensal - PIX", val: 600.00, venc: "2026-06-10", status: "pendente", pag: null, cat: "Manutenção e Reparos", resp: "Limpeza Total Serviços" },
        { id_usuario: 2,desc: "Licença Zoom Pro - Cartão", val: 85.00, venc: "2026-06-15", status: "pendente", pag: null, cat: "Software e Licenças", resp: "Zoom Video Communications" },
        { id_usuario: 2,desc: "Imposto INSS - Guia DAS", val: 450.00, venc: "2026-06-20", status: "pendente", pag: null, cat: "Impostos e Taxas", resp: "Ana Silva" },
        
        { id_usuario: 2,desc: "Aluguel da Sede (Julho) - Boleto", val: 2500.00, venc: "2026-07-10", status: "pendente", pag: null, cat: "Aluguel e Encargos", resp: "Construções S.A." },
        { id_usuario: 2,desc: "Salário Coordenador - PIX", val: 3500.00, venc: "2026-07-05", status: "pendente", pag: null, cat: "Salários e Benefícios", resp: "Carlos Eduardo Santos" },
        { id_usuario: 2,desc: "Cestas Básicas (Julho) - Boleto", val: 1250.00, venc: "2026-07-08", status: "pendente", pag: null, cat: "Alimentação e Nutrição", resp: "Supermercado Sol Ltda" },
        { id_usuario: 2,desc: "Combustível Van - Cartão", val: 400.00, venc: "2026-07-28", status: "pendente", pag: null, cat: "Transporte e Logística", resp: "Posto Ipiranga" },
        { id_usuario: 2,desc: "Manutenção Preventiva Van - PIX", val: 850.00, venc: "2026-07-15", status: "pendente", pag: null, cat: "Transporte e Logística", resp: "Ricardo Pereira" },
        { id_usuario: 2,desc: "Doação Padrinho - Transferência", val: 500.00, venc: "2026-07-20", status: "pendente", pag: null, cat: "Receita de Vendas", resp: "Mariana Oliveira" },
        { id_usuario: 2,desc: "Compra Fardamento - PIX", val: 1400.00, venc: "2026-07-25", status: "pendente", pag: null, cat: "Materiais de Escritório", resp: "Associação Comunitária" }
    ];

    // 4. Mapeia o array formatando para o banco de dados
    const contasFormatadas = listaDeContas.map(conta => ({
        id_usuario: conta.id_usuario,
        descricao: conta.desc,
        valor: conta.val,
        data_vencimento: conta.venc,
        status: conta.status,
        data_pagamento: conta.pag,
        id_categoria: getCatId(conta.cat),
        id_responsavel: getRespId(conta.resp)
    }));

    // 5. Insere todas as 50 contas
    await knex("contas").insert(contasFormatadas);
};
