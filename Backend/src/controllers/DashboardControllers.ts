import { Request, Response } from 'express';
import knex from '../database/connection.js';
import { getMonth, getYear } from 'date-fns';
import ContasModel from '../models/ContasModel.js';

// Define o que o nosso Controller promete entregar
interface DashboardSummary {
  pago: number;
  pendente: number;
  responsaveis: number;
  graficoCategorias: { labels: string[], valores: number[] };
  graficoEvolucao: { labels: string[], valores: number[] };
  vencimentos: any[];
}

class DashboardController {
  async summary(request: Request, response: Response) {
    try {
      // 1. Pega o ID do usuário logado (você deve ter um middleware de autenticação que anexa isso à requisição)
      const id_usuario = (request as any).id_usuario || 1; 

      // 2. Pega Mês e Ano da URL ou usa o atual como padrão
      const { mes, ano } = request.query;
      const agora = new Date();
      const m = mes ? Number(mes) : getMonth(agora) + 1;
      const a = ano ? Number(ano) : getYear(agora);

      // 3. Busca os dados de resumo (valores e dados dos gráficos)
      const dadosResumo = await ContasModel.obterResumoDashboard(id_usuario, m, a);

      // 4. Busca a contagem de responsáveis
      const responsaveis = await knex('responsaveis')
        .count<{ total: number }>('* as total')
        .first();

      // 5. Busca a lista de vencimentos do mês
      const vencimentos = await ContasModel.listarTodas(id_usuario, {
        mes: m,
        ano: a,
        limit: 10,
        orderField: 'data_vencimento',
        orderDirection: 'asc'
      });

      // 6. Monta o objeto final do resumo do dashboard
      const summary: DashboardSummary = {
        ...dadosResumo,
        responsaveis: Number(responsaveis?.total) || 0,
        vencimentos: vencimentos || []
      };

      return response.json(summary);

    } catch (error) {
      console.error("Erro no DashboardController:", error);
      return response.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default new DashboardController();