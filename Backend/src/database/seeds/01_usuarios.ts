import type { Knex } from "knex";
import bcrypt from "bcrypt";

export async function seed(knex: Knex) {
  // 1. Limpar a tabela de usuários antes de inserir para não duplicar dados
    await knex("usuarios").del();

  // 2. Prepara a senha criptografada para os usuários que serão inseridos
    const salt = await bcrypt.genSalt(10);
    const senhaAdmin = await bcrypt.hash("admin123", salt);
    const senhaUser = await bcrypt.hash("123456", salt); // Senha para testes

  // 3. Inserir um usuário inicial para teste
    await knex("usuarios").insert([
      {
        nome: "Admin",
        email: "admin@example.com",
        senha: senhaAdmin,
        role: "admin" // Definindo o papel do usuário como admin
      },
      {
        nome: "Jose",
        email: "jose@example.com",
        senha: senhaUser,
        role: "user" // Definindo o papel do usuário como user
      }
    ]);
};