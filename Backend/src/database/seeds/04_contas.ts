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

    // 3. Validação
    if (!usuario || categorias.length === 0 || responsaveis.length === 0) {
        throw new Error("Faltam dados básicos! Rode as seeds 01, 02 e 03 primeiro.");
    }

    // 4. Insere as contas usando os IDs que buscamos
    await knex("contas").insert([
        {
        descricao: "Pagamento Aluguel Sede",
        valor: 2500.00,
        data_vencimento: "2026-03-10",
        status: "pendente",
        id_usuario: usuario.id_usuario, // Pegamos o ID do objeto buscado
        id_categoria: categorias.find(c => c.nome_categoria === "Aluguel").id_categoria, // Busca pelo nome
        id_responsavel: responsaveis[0].id_responsavel // Ou pega pela posição na lista
        }
    ]);
};
