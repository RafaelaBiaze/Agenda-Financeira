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

        const ALLOWED_ORDER_FIELDS = ["descricao", "valor", "data_vencimento", "status", "responsavel_nome", "categoria_nome"];
        const ALLOWED_ORDER_DIRECTION = ["asc", "desc"];

        const orderByParam = (req.query.orderBy as string) || "data_vencimento,asc";

        const [orderField, orderDirection] = orderByParam.split(",");

        if (!ALLOWED_ORDER_FIELDS.includes(orderField)) {
            return res.status(400).json({ error: `Campo Order By incorreto: ${orderField}.` });
        }
        if (!ALLOWED_ORDER_DIRECTION.includes(orderDirection)) {
            return res.status(400).json({ error: `Direção Order By incorreto: ${orderDirection}.` });
        }
        
        // 2. Filtros enviado pelo React
        const busca = req.query.busca as string;
        const mes = req.query.mes ? Number(req.query.mes) : undefined;
        const ano = req.query.ano ? Number(req.query.ano) : undefined;
        const data_inicio = req.query.data_inicio as string;
        const data_fim = req.query.data_fim as string;
        const status = req.query.status as string;
        const filtroResponsavel = req.query.filtroResponsavel as string;
        const filtroCategoria = req.query.filtroCategoria as string;
        const status_diferente = req.query.status_diferente as string;
        
        if (limit > MAX_GET_LIMIT) {
        return res.status(400).json({ error: `Limit máximo: ${MAX_GET_LIMIT}.` });
        }

        const data = await ContasModel.listarTodas(id_usuario_logado, { 
          busca, 
          mes, 
          ano,
          data_inicio,
          data_fim,
          status,
          filtroResponsavel,
          filtroCategoria,
          status_diferente, 
          role: req.user?.role,
          limit: limit + 1, 
          offset,
          orderField,
          orderDirection
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
      console.log("Erro ao listar contas:", error);
      return res.status(500).json({ erro: "Erro ao listar contas" });
    }
  }
};

export default new ContasControllerList();