import { Request, Response } from "express";
import bcrypt from "bcrypt";
import UsuariosModel, { IUsuario } from "../models/UsuariosModel.js"; // Importe a Interface

export const UsuariosController = {
  async create(req: Request, res: Response) {
    try {
      // 1. Tipamos o que vem do corpo da requisição
      const { nome, email, senha, role }: IUsuario = req.body;

      if (!senha) return res.status(400).json({ erro: "Senha é obrigatória" });

      // 2. Criptografar a senha
      const salt = await bcrypt.genSalt(10);
      const senhaCriptografada = await bcrypt.hash(senha, salt);

      // 3. Salvar no banco
      const novoUsuario = await UsuariosModel.criar({
        nome,
        email,
        senha: senhaCriptografada,
        role: role || "user"
      });

      // 4. Retorno sem a senha
      return res.status(201).json({ 
        mensagem: "Usuário criado com sucesso!",
        usuario: { 
          id: novoUsuario.id_usuario, 
          nome: novoUsuario.nome, 
          email: novoUsuario.email,
          role: novoUsuario.role
        } 
      });

    } catch (error) {
      return res.status(500).json({ erro: "Erro ao criar usuário" });
    }
  }
};