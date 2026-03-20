import type { Request, Response } from 'express';
import ResponsaveisModels, {IResponsavel} from '../../models/ResponsaveisModels.js';

class ResponsaveisControllerList {
  async list(req: Request, res: Response) {
    try{
      // 1. Busca todos os responsáveis
      const responsaveis = await ResponsaveisModels.listarTodos();
      return res.json(responsaveis);
    }
    catch(error){
      return res.status(500).json({ erro: "Erro ao listar responsáveis" });
    }
  }
};

export default new ResponsaveisControllerList();