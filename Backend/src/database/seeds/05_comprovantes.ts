import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    
    await knex("comprovantes").del();

    // 1. Busca várias contas para vincular os arquivos
    const contas = await knex("contas").select("id_conta", "descricao");

    if (contas.length === 0) {
        throw new Error("Nenhuma conta encontrada! Rode a seed de contas primeiro.");
    }

    // Função auxiliar para achar ID por descrição ou retornar o primeiro
    const findId = (termo: string) => 
        contas.find(c => c.descricao.includes(termo))?.id_conta || contas[0].id_conta;

    // 2. Inserindo 10 comprovantes variados (PDFs e Imagens)
    await knex("comprovantes").insert([
        {
            caminho_arquivo: "uploads/comprovantes/1679234561-aluguel.pdf",
            nome_original: "recibo_aluguel_março.pdf",
            data_upload: knex.fn.now(),
            id_conta: findId("Aluguel")
        },
        {
            caminho_arquivo: "uploads/comprovantes/1679234562-energia.pdf",
            nome_original: "conta_luz_enel.pdf",
            data_upload: knex.fn.now(),
            id_conta: findId("Luz")
        },
        {
            caminho_arquivo: "uploads/comprovantes/1679234563-internet.pdf",
            nome_original: "fatura_vivo_fibra.pdf",
            data_upload: knex.fn.now(),
            id_conta: findId("Internet")
        },
        {
            caminho_arquivo: "uploads/comprovantes/1679234564-cestas.png",
            nome_original: "cupom_fiscal_supermercado.png",
            data_upload: knex.fn.now(),
            id_conta: findId("Cestas")
        },
        {
            caminho_arquivo: "uploads/comprovantes/1679234565-salario.pdf",
            nome_original: "holerite_coordenador.pdf",
            data_upload: knex.fn.now(),
            id_conta: findId("Salário")
        },
        {
            caminho_arquivo: "uploads/comprovantes/1679234566-reparo.jpg",
            nome_original: "recibo_pedreiro.jpg",
            data_upload: knex.fn.now(),
            id_conta: findId("Reparo")
        },
        {
            caminho_arquivo: "uploads/comprovantes/1679234567-doacao.pdf",
            nome_original: "termo_doacao_campanha.pdf",
            data_upload: knex.fn.now(),
            id_conta: findId("Doação")
        },
        {
            caminho_arquivo: "uploads/comprovantes/1679234568-taxa.pdf",
            nome_original: "extrato_tarifas_bancarias.pdf",
            data_upload: knex.fn.now(),
            id_conta: findId("Taxa")
        },
        {
            caminho_arquivo: "uploads/comprovantes/1679234569-limpeza.pdf",
            nome_original: "nf_servicos_limpeza.pdf",
            data_upload: knex.fn.now(),
            id_conta: findId("Limpeza")
        },
        {
            caminho_arquivo: "uploads/comprovantes/1679234570-psico.pdf",
            nome_original: "reembolso_deslocamento.pdf",
            data_upload: knex.fn.now(),
            id_conta: findId("Psicologia")
        }
    ]);
};
