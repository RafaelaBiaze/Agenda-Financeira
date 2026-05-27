import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    
    await knex("comprovantes").del();

    // 1. Busca apenas as contas que já foram pagas
    const contasPagas = await knex("contas")
        .select("id_conta", "descricao")
        .where("status", "pago");

    if (contasPagas.length === 0) {
        return; // Se não tem conta paga, não tem comprovante
    }

    // 2. Gera um comprovante para cada conta paga do banco
    const comprovantes = contasPagas.map((conta, index) => {
    
        // Pega a primeira palavra da descrição para o nome do arquivo
        const nomeSimples = conta.descricao.split(" ")[0].toLowerCase();

        return {
            caminho_arquivo: `uploads/comprovantes/16792345${index}.pdf`,
            nome_original: `comprovante_${nomeSimples}.pdf`,
            data_upload: knex.fn.now(),
            id_conta: conta.id_conta
        };
    });

    await knex("comprovantes").insert(comprovantes);
};
