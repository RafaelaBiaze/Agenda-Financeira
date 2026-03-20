import type { Request, Response } from 'express';
import CategoriasModel, {ICategoria} from '../../models/CategoriasModel.js';

class CategoriasControllerList {
  async list(req: Request, res: Response) {
    try{
        // 1. Busca as categorias
        const categorias = await CategoriasModel.listarTodas();
        return res.json(categorias);
    }
    catch(error){
        return res.status(500).json({ erro: "Erro ao listar categorias" });
    }
  }
};

export default new CategoriasControllerList();