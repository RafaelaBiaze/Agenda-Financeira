import { Request, Response } from "express";
import bcrypt from "bcrypt";
import UsuariosModel from "../models/UsuariosModel.js";

export const UsuariosController = {
  async create(req: Request, res: Response) {
    try {
      const { nome, email, senha } = req.body;

      // 1. Criptografar a senha (Segurança em primeiro lugar!)
      const salt = await bcrypt.genSalt(10);
      const senhaCriptografada = await bcrypt.hash(senha, salt);

      // 2. Salvar no banco
      const [novoUsuario] = await UsuariosModel.criar({
        nome,
        email,
        senha: senhaCriptografada
      });

      return res.status(201).json({ 
        mensagem: "Usuário criado com sucesso!",
        usuario: { id: novoUsuario.id_usuario, 
            nome, 
            email 
        } 
      });
    } catch (error) {
      return res.status(500).json({ erro: "Erro ao criar usuário" });
    }
  }
};