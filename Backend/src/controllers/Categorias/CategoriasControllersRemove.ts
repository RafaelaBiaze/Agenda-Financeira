import type { Request, Response } from 'express';
import CategoriasModel from '../../models/CategoriasModel.js';

class CategoriasControllerRemove {
  async remove(req: Request, res: Response) {
    try{
        // 1. Pegamos o ID da categoria que vem na URL (ex: /categorias/5)
        const { id } = req.params;

        // 2. Remove a categoria do banco
        await CategoriasModel.excluir(Number(id));

        return res.json({ mensagem: "Categoria removida com sucesso" });
    }
    catch(error){
        return res.status(500).json({ erro: "Erro ao remover categoria" });
    }
  }
};

export default new CategoriasControllerRemove();