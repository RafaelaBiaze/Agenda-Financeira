import type { Request, Response } from 'express';
import ContasModel from '../../models/ContasModel.js';

class ContasControllerList {
  async list(req: Request, res: Response) {
    try{
        // 1. Verifica se o usuário está autenticado e pega seu ID
        const id_usuario_logado = req.user?.id; // O middleware de autenticação deve ter anexado o usuário à requisição

        if (!id_usuario_logado) {
            return res.status(401).json({ erro: "Usuário não autenticado" });
        }

        // 2. Busca as contas do usuário logado
        const contas = await ContasModel.listarTodas(id_usuario_logado);
        return res.json(contas);
    }
    catch(error){
        return res.status(500).json({ erro: "Erro ao listar contas" });
    }
  }
};

export default new ContasControllerList();