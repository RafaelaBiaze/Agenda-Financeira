import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    
    await knex("comprovantes").del();

    // 1. Busca no banco uma conta que tenha "Aluguel" na descrição
    const contaAluguel = await knex("contas")
        .where("descricao", "like", "%Aluguel%")
        .first();

    if (!contaAluguel) {
        console.log("Nenhuma conta de Aluguel encontrada.");
        return;
    }

    // 2. Salva o comprovante vinculando-o ao ID da conta encontrada
    await knex("comprovantes").insert([
        {
        caminho_arquivo: "uploads/comprovantes/aluguel_01.pdf",
        data_upload: new Date(),
        id_conta: contaAluguel.id_conta // Chave estrangeira (vínculo)
        }
    ]);
};
