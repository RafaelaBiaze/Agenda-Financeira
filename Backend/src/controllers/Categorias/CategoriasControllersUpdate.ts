import type { Request, Response } from 'express';
import CategoriasModel from '../../models/CategoriasModel.js';

class CategoriasControllerUpdate {
  async update(req: Request, res: Response) {
    try{
        // 1. Pegamos o ID da categoria que vem na URL (ex: /categorias/5)
        const { id } = req.params;

        // 2. Verificamos se a categoria existe
        const categoriaExistente = await CategoriasModel.buscarPorID(Number(id));

        if (!categoriaExistente) {
        return res.status(404).json({ erro: "Categoria não encontrada" });
        }

        const { nome_categoria } = req.body;

        if (!nome_categoria) {
        return res.status(400).json({ erro: "O novo nome da categoria é obrigatório." });
      }

        // 3. Atualiza a categoria
        const [categoriaAtualizada] = await CategoriasModel.atualizar(Number(id), nome_categoria);

        return res.json(categoriaAtualizada);
    }
    catch(error){
        return res.status(500).json({ erro: "Erro ao atualizar categoria" });
    }
  }
};

export default new CategoriasControllerUpdate();