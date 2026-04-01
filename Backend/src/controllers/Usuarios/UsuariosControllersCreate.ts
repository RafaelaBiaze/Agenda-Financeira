import { Request, Response } from "express";
import bcrypt from "bcrypt";
import UsuariosModel, { IUsuario } from "../../models/UsuariosModel.js"; // Importe a Interface

class UsuariosControllerCreate {
  async create(req: Request, res: Response) {
    try{
      // 1. Tipamos o que vem do corpo da requisição
      const { nome, email, senha, role } = req.body;

      if (!senha) return res.status(400).json({ erro: "Senha é obrigatória" });

      // 2. Criptografar a senha
      const salt = await bcrypt.genSalt(10);
      const senhaCriptografada = await bcrypt.hash(senha, salt);

      // 3. Criamos o objeto seguindo a Interface IUsuario
      const dadosNovoUsuario: IUsuario = {
        nome,
        email,
        senha: senhaCriptografada,
        role: role || "user"
      };

      // 4. Chamamos a Model
      const novoUsuario = await UsuariosModel.criar(dadosNovoUsuario);
      
      return res.status(201).json(novoUsuario);

    } catch (error) {
      return res.status(500).json({ erro: "Erro ao criar usuário" });
    }
  }
};

export default new UsuariosControllerCreate();