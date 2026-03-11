import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UsuariosModel from "../models/UsuariosModel.js";

export const LoginController = {
  async login(req: Request, res: Response) {
    try {
      const { email, senha } = req.body;

      // 1. Verificar se o usuário existe
      const usuario = await UsuariosModel.buscarPorEmail(email);
      if (!usuario) {
        return res.status(401).json({ erro: "E-mail ou senha inválidos" });
      }

      // 2. Comparar a senha digitada com a criptografada no banco
      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
      if (!senhaCorreta) {
        return res.status(401).json({ erro: "E-mail ou senha inválidos" });
      }

      // 3. Gerar o Token JWT (O Crachá)
      const secret = process.env.SECRET_KEY || "chave_secreta"; // Usar váriavel de ambiente, porém colocar um valor padrão para evitar erros.
      const token = jwt.sign(
        { id: usuario.id_usuario, email: usuario.email }, // Dados que vão dentro do token
        secret, 
        { expiresIn: "30m" } // O token expira em 30 minutos por segurança
      );

      // 4. Retornar o token
      return res.json({
        mensagem: "Login realizado com sucesso!",
        token: token,
        usuario: { nome: usuario.nome, email: usuario.email }
      });

    } catch (error) {
      return res.status(500).json({ erro: "Erro ao realizar login" });
    }
  }
};