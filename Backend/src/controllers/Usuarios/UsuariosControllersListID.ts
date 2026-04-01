import type { Request, Response } from 'express';
import UsuariosModel, {IUsuario} from '../../models/UsuariosModel.js';

class UsuariosControllerListID {
  async listID(req: Request, res: Response) {
    try{
      // 1. Pegamos o ID do usuário que vem na URL (ex: /usuarios/5)
      const { id } = req.params;

      // 2. Busca o usuário
      const usuario = await UsuariosModel.buscarPorID(Number(id));
      return res.json(usuario);
    }
    catch(error){
      return res.status(500).json({ erro: "Erro ao listar usuário" });
    }
  }
};

export default new UsuariosControllerListID();