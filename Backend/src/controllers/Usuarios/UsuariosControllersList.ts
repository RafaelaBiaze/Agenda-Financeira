import type { Request, Response } from 'express';
import UsuariosModel, {IUsuario} from '../../models/UsuariosModel.js';

class UsuariosControllerList {
  async list(req: Request, res: Response) {
    try{
      // 1. Busca todos os usuários
      const usuarios = await UsuariosModel.listarTodos();
      return res.json(usuarios);
    }
    catch(error){
      return res.status(500).json({ erro: "Erro ao listar usuários" });
    }
  }
};

export default new UsuariosControllerList();