import type { Knex } from "knex";
import bcrypt from "bcrypt";
import "dotenv/config";

export async function seed(knex: Knex) {
  // 1. Limpar a tabela de usuários antes de inserir para não duplicar dados
    await knex("usuarios").del();

  // 2. Pegar dados do .env ou usar um padrão de segurança
  const adminNome = process.env.ADMIN_NAME || "Admin";
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminSenhaPura = process.env.ADMIN_PASSWORD || "admin123";

  // 2. Prepara a senha criptografada para os usuários que serão inseridos
    const salt = await bcrypt.genSalt(10);
    const adminHash = await bcrypt.hash(adminSenhaPura, salt);
    const senhaUser = await bcrypt.hash("784512", salt); // Senha para testes

  // 3. Inserir um usuário inicial para teste
    await knex("usuarios").insert([
      {
        nome: adminNome,
        email: adminEmail,
        senha: adminHash,
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