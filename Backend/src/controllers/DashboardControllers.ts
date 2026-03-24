import { Request, Response } from 'express';
import knex from '../database/connection.js';

// Define o que o nosso Controller promete entregar
interface DashboardSummary {
  pago: number;
  pendente: number;
  responsaveis: number;
  vencimentos: Array<{
    id_conta: number;
    descricao: string;
    valor: number;
    data_vencimento: string;
    status: string;
    responsavel_nome: string;
  }>;
}

class DashboardController {
  // Tipa o Request e o Response do Express
  async summary(request: Request, response: Response) {
    try {
      // Tipa o retorno da query do Knex para evitar erros de nomes de colunas
      const pago = await knex('contas')
        .where('status', 'pago')
        .sum<{ total: string | number }>('valor as total')
        .first();

      const pendente = await knex('contas')
        .where('status', 'pendente')
        .sum<{ total: string | number }>('valor as total')
        .first();

      const responsaveis = await knex('responsaveis')
        .count<{ total: number }>('* as total')
        .first();

      const proximosVencimentos = await knex('contas')
        .select(
            'contas.id_conta', // Nome exato da sua interface IConta
            'contas.descricao',
            'contas.valor',
            'contas.data_vencimento',
            'contas.status',
            'responsaveis.nome as responsavel_nome' // Pegando o nome da tabela IResponsavel
        )
        /* JOIN CORRETO: 
            Ligamos o id_responsavel da conta com o id_responsavel da tabela de responsaveis 
        */
        .join('responsaveis', 'contas.id_responsavel', 'responsaveis.id_responsavel') 
        .where('contas.status', '!=', 'pago')
        .orderBy('contas.data_vencimento', 'asc')
        .limit(5);

      // Cria o objeto de resposta seguindo a nossa Interface
      const summary: DashboardSummary = {
        pago: Number(pago?.total) || 0,
        pendente: Number(pendente?.total) || 0,
        responsaveis: Number(responsaveis?.total) || 0,
        vencimentos: proximosVencimentos || [] // Adiciona os próximos vencimentos à resposta
      };

      return response.json(summary);

    } catch (error) {
      return response.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default new DashboardController();