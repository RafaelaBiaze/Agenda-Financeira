import type { Request, Response } from 'express';
import ContasModel from '../../models/ContasModel.js';

const MAX_GET_LIMIT = 100;

class ContasControllerList {
  async list(req: Request, res: Response) {
    try{
        // 1. Verifica se o usuário está autenticado e pega seu ID
        const id_usuario_logado = req.user?.id; // O middleware de autenticação deve ter anexado o usuário à requisição

        if (!id_usuario_logado) {
            return res.status(401).json({ erro: "Usuário não autenticado" });
        }

        const limit = parseInt(req.query.limit as string) || 10;
        const offset = parseInt(req.query.offset as string) || 0;

        // 2. Filtros enviado pelo React
        const busca = req.query.busca as string;
        const mes = req.query.mes ? Number(req.query.mes) : undefined;
        const ano = req.query.ano ? Number(req.query.ano) : undefined;

        if (limit > MAX_GET_LIMIT) {
        return res.status(400).json({ error: `Limit máximo: ${MAX_GET_LIMIT}.` });
        }

        const data = await ContasModel.listarTodas(id_usuario_logado, { 
          busca, mes, ano, 
          limit: limit + 1, 
          offset 
        });

        const hasMore = data.length > limit;
        const rows = hasMore ? data.slice(0, limit) : data;
        const next = hasMore ? offset + limit : null;

        return res.json({
          rows: rows,
          limit: limit,
          next: next
        });
    }
    catch(error){
      return res.status(500).json({ erro: "Erro ao listar contas" });
    }
  }
};

export default new ContasControllerList();