import type { Request, Response } from 'express';
import UsuariosModel, { IUsuario } from '../../models/UsuariosModel.js';

class UsuariosControllerRemove {
  async remove(req: Request, res: Response) {
    try{
      // 1. Pegamos o ID do usuário que vem na URL (ex: /usuarios/5)
      const { id } = req.params;

      // 2. Remove o usuário do banco
      await UsuariosModel.excluir(Number(id));

      return res.status(204).send();
    }
    catch(error){
      return res.status(500).json({ erro: "Erro ao remover usuário" });
    }
  }
};

export default new UsuariosControllerRemove();