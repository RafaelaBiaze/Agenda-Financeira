import type { Request, Response } from 'express';
import ContasModel from '../../models/ContasModel.js';

class ContasControllerCreate {
  async create(req: Request, res: Response) {
    try{
        // 1. Verifica se o usuário está autenticado e pega seu ID
        const id_usuario_logado = req.user?.id; // O middleware de autenticação deve ter anexado o usuário à requisição

        if (!id_usuario_logado) {
            return res.status(401).json({ erro: "Usuário não autenticado" });
        }
        
        // 2. Mesclamos o ID do usuário com os dados vindos do corpo da requisição
        const dadosDaConta = {
            ...req.body,
            id_usuario: id_usuario_logado
        };

        // 3. Cria a nova conta associada ao usuário logado
        const [novaConta] = await ContasModel.criar(dadosDaConta);
        return res.json(novaConta);
    }
    catch(error){
        return res.status(500).json({ erro: "Erro ao criar conta" });
    }
  }
};

export default new ContasControllerCreate();