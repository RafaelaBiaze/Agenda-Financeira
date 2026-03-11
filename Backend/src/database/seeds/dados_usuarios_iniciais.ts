import type { Knex } from "knex";
import bcrypt from "bcrypt";

export async function seed(knex: Knex) {
  // 1. Limpar a tabela de usuários antes de inserir para não duplicar dados
    await knex("usuarios").del();

  // 2. Prepara a senha criptografada (o nosso "sal" de novo!)
    const salt = await bcrypt.genSalt(10);
    const senhaAdmin = await bcrypt.hash("admin123", salt); // Senha para testes

  // 3. Inserir um usuário inicial para teste
  await knex("usuarios").insert([
    {
      nome: "Admin",
      email: "admin@example.com",
      senha: senhaAdmin
    }
  ]);
};