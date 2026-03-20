import type { Request, Response } from 'express';
import ResponsaveisModels, {IResponsavel} from '../../models/ResponsaveisModels.js';

class ResponsaveisControllerListID {
  async listID(req: Request, res: Response) {
    try{
      // 1. Pegamos o ID do responsável que vem na URL (ex: /responsaveis/5)
      const { id } = req.params;

      // 2. Busca o responsável
      const responsavel = await ResponsaveisModels.buscarPorID(Number(id));
      return res.json(responsavel);
    }
    catch(error){
      return res.status(500).json({ erro: "Erro ao listar responsável" });
    }
  }
};

export default new ResponsaveisControllerListID();