import type { Request, Response } from 'express';
import ContasModel from '../models/ContasModel.js';

class ContasController {
  async index(req: Request, res: Response) {
    try{
        const contas = await ContasModel.listarTodas();
        return res.json(contas);

    }
    catch(error){
        return res.status(500).json({ erro: "Erro ao listar contas" });
    }
  }
};

export default new ContasController();