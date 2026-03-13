import type { Request, Response } from 'express';
import ContasModel from '../../models/ContasModel.js';

class ContasControllerListID {
  async listID(req: Request, res: Response) {
    try{
        // 1. Verifica se o usuário está autenticado e pega seu ID
        const id_usuario_logado = req.user?.id; // O middleware de autenticação deve ter anexado o usuário à requisição

        if (!id_usuario_logado) {
            return res.status(401).json({ erro: "Usuário não autenticado" });
        }

        // 2. Pegamos o ID da conta que vem na URL (ex: /contas/5)
        const { id } = req.params;

        // 2. Busca as contas do usuário logado
        const conta = await ContasModel.buscarPorId(Number(id), id_usuario_logado);
        return res.json(conta);
    }
    catch(error){
        return res.status(500).json({ erro: "Erro ao listar conta" });
    }
  }
};

export default new ContasControllerListID();