import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UsuariosModel from "../models/UsuariosModel.js";

// Tipar o que vem do corpo da requisição
interface ILoginRequest {
  email: string;
  senha: string;
}

export const LoginController = {
  async login(req: Request, res: Response) {
    try {

      // 1. Pegamos apenas email e senha do corpo da requisição
      const { email, senha }: ILoginRequest = req.body;

      // 2. Buscar o usuário
      const usuario = await UsuariosModel.buscarPorEmail(email);
      
      if (!usuario) {
        return res.status(401).json({ erro: "E-mail ou senha inválidos" });
      }

      // 3. Comparar a senha
      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
      
      if (!senhaCorreta) {
        return res.status(401).json({ erro: "E-mail ou senha inválidos" });
      }

      // 4. Gerar o Token JWT
      const secret = process.env.SECRET_KEY || "chave_secreta";
      const token = jwt.sign(
        { 
          id: usuario.id_usuario, // Use o ID que vem do banco
          email: usuario.email, 
          role: usuario.role      // Use o ROLE que vem do banco
        }, 
        secret, 
        { expiresIn: "30m" }
      );

      // 5. Retornar os dados
      return res.json({
        mensagem: "Login realizado com sucesso!",
        token: token,
        usuario: { 
          nome: usuario.nome, 
          email: usuario.email, 
          role: usuario.role 
        }
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: "Erro ao realizar login" });
    }
  }
};