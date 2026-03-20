import type { Request, Response } from 'express';
import ResponsaveisModels, {IResponsavel} from '../../models/ResponsaveisModels.js';

class ResponsaveisControllerRemove {
  async remove(req: Request, res: Response) {
    try{
      // 1. Pegamos o ID do responsável que vem na URL (ex: /responsaveis/5)
      const { id } = req.params;

      // 2. Remove o responsável do banco
      await ResponsaveisModels.excluir(Number(id));

      return res.status(204).send();
    }
    catch(error){
      return res.status(500).json({ erro: "Erro ao remover responsável" });
    }
  }
};

export default new ResponsaveisControllerRemove();