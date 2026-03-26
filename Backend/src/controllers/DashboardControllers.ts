import { Request, Response } from 'express';
import knex from '../database/connection.js';
import { startOfMonth, endOfMonth, format } from 'date-fns';

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
  async summary(request: Request, response: Response) {
    try {
      // 1. Recebe os parâmetros da URL (Query Params)
      const { mes, ano } = request.query;

      console.log(`Buscando dados para: ${mes}/${ano}`);

      // 2. Define a data base. Se não vier nada, usa a data de HOJE.
      const dataAlvo = (mes && ano) 
        ? new Date(Number(ano), Number(mes) - 1, 1) 
        : new Date();

      // 3. Formata as datas para o formato que o banco entende (YYYY-MM-DD)
      const inicioMes = format(startOfMonth(dataAlvo), 'yyyy-MM-dd 00:00:00');
      const fimMes = format(endOfMonth(dataAlvo), 'yyyy-MM-dd 23:59:59');

      console.log(`Filtro Exato: DE ${inicioMes} ATÉ ${fimMes}`);

      // Tipa o retorno da query do Knex para evitar erros de nomes de colunas
      const pago = await knex('contas')
        .where('status', 'pago')
        .where('data_vencimento', '>=', inicioMes)
        .where('data_vencimento', '<=', fimMes)
        .sum<{ total: string | number }>('valor as total')
        .first();
        

      const pendente = await knex('contas')
        .where('status', 'pendente')
        .where('data_vencimento', '>=', inicioMes)
        .where('data_vencimento', '<=', fimMes)
        .sum<{ total: string | number }>('valor as total')
        .first();

      const responsaveis = await knex('responsaveis')
        .count<{ total: number }>('* as total')
        .first();

      const proximosVencimentos = await knex('contas')
        .select(
            'contas.id_conta',
            'contas.descricao',
            'contas.valor',
            'contas.data_vencimento',
            'contas.status',
            'responsaveis.nome as responsavel_nome' // Pegando o nome da tabela IResponsavel
        )
        .join('responsaveis', 'contas.id_responsavel', 'responsaveis.id_responsavel')
        .where('data_vencimento', '>=', inicioMes)
        .where('data_vencimento', '<=', fimMes)
        .orderBy('contas.data_vencimento', 'asc')

      console.log("DADOS CRUS DO POSTGRES:", proximosVencimentos);
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