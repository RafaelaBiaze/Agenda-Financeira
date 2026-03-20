import type { Request, Response } from 'express';
import CategoriasModel, {ICategoria} from '../../models/CategoriasModel.js';

class CategoriasControllerListID {
  async listID(req: Request, res: Response) {
    try{
        // 1. Pegamos o ID da categoria que vem na URL (ex: /categorias/5)
        const { id } = req.params;

        // 2. Busca a categoria
        const categoria = await CategoriasModel.buscarPorID(Number(id));
        return res.json(categoria);
    }
    catch(error){
        return res.status(500).json({ erro: "Erro ao listar categoria" });
    }
  }
};

export default new CategoriasControllerListID();