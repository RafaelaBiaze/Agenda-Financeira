import type { Request, Response } from 'express';
import CategoriasModel from '../../models/CategoriasModel.js';

class CategoriasControllerCreate {
  async create(req: Request, res: Response) {
    try{
        // 1. Extraímos apenas o valor do nome
        const { nome_categoria } = req.body;

        // 2. Validação simples
        if (!nome_categoria) {
            return res.status(400).json({ erro: "O nome da categoria é obrigatório." });
        }

        // 3. Passamos apenas a string para o Model
        const [novaCategoria] = await CategoriasModel.criar(nome_categoria);

        return res.status(201).json(novaCategoria);
    }
    catch(error){
        return res.status(500).json({ erro: "Erro ao criar categoria" });
    }
  }
};

export default new CategoriasControllerCreate();