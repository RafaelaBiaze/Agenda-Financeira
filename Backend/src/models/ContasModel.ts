import connection from '../database/connection.js';
import { startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths,format } from 'date-fns';

// Esta interface garante que não esqueça nenhum campo
export interface IConta {
  id_conta?: number;
  descricao: string;
  valor: number;
  data_vencimento: string;
  status: 'pago' | 'pendente' | 'atrasado';
  id_categoria: number;
  id_responsavel: number;
  id_usuario: number;
  criado_em?: string;
  atualizado_em?: string;
}

class ContasModel {
  // Função para listar todas as contas com os nomes das categorias
  async listarTodas(
    id_usuario: number, 
    filtros: { 
      busca?: string; 
      mes?: number; 
      ano?: number;
      data_inicio?: string;
      data_fim?: string;
      status?: string;
      filtroCategoria?: string;
      filtroResponsavel?: string;
      limit?: number; 
      offset?: number;
      orderField: string;
      orderDirection?: string;
    }
  ): Promise<(IConta & { nome_categoria: string; nome_responsavel: string })[]> {
    const { busca, mes, ano, data_inicio, data_fim, status, filtroCategoria, filtroResponsavel, limit = 10, offset = 0, orderField, orderDirection } = filtros || {};
    const query = connection<IConta>('contas')
      .where('contas.id_usuario', id_usuario)
      .leftJoin('categorias', 'contas.id_categoria', 'categorias.id_categoria')
      .leftJoin('responsaveis', 'contas.id_responsavel', 'responsaveis.id_responsavel')
      .leftJoin('comprovantes', 'contas.id_conta', 'comprovantes.id_conta')
      .select(
        'contas.*', 
        'categorias.nome_categoria as categoria_nome', 
        'responsaveis.nome as responsavel_nome',
        'comprovantes.caminho_arquivo'
      );

    // 1. Filtros Dinâmicos (para busca personalizada)
    if (filtroCategoria) {
      query.where('categorias.nome_categoria', 'ilike', `%${filtroCategoria}%`);
    }

    if (filtroResponsavel) {
      query.where('responsaveis.nome', 'ilike', `%${filtroResponsavel}%`);
    }

    if (busca) {
      query.where((builder) => {
        builder.where('contas.descricao', 'ilike', `%${busca}%`)
               .orWhere('responsaveis.nome', 'ilike', `%${busca}%`);
      });
    }

    if (status) {
      query.where('contas.status', status);
    }

    if (ano && Number(ano) > 0) {
      if (mes && Number(mes) !== 0) {
        // Mês específico
        const dataAlvo = new Date(Number(ano), Number(mes) - 1, 1);
        query.where('contas.data_vencimento', '>=', format(startOfMonth(dataAlvo), 'yyyy-MM-dd 00:00:00'))
             .where('contas.data_vencimento', '<=', format(endOfMonth(dataAlvo), 'yyyy-MM-dd 23:59:59'));
      } else {
        // O ano inteiro ("Todos" no mês)
        const dataAlvo = new Date(Number(ano), 0, 1);
        query.where('contas.data_vencimento', '>=', format(startOfYear(dataAlvo), 'yyyy-MM-dd 00:00:00'))
             .where('contas.data_vencimento', '<=', format(endOfYear(dataAlvo), 'yyyy-MM-dd 23:59:59'));
      }
    }

    if (data_inicio && data_fim) {
      query.where('contas.data_vencimento', '>=', `${data_inicio} 00:00:00`)
           .where('contas.data_vencimento', '<=', `${data_fim} 23:59:59`);
    } else if (data_inicio) {
      query.where('contas.data_vencimento', '>=', `${data_inicio} 00:00:00`);
    } else if (data_fim) {
      query.where('contas.data_vencimento', '<=', `${data_fim} 23:59:59`);
    }

    // 2. Dicionário de tradução (Frontend -> Banco de Dados)
    let colunaBanco = 'contas.data_vencimento'; // padrão
    
    switch (orderField) {
      case 'descricao': colunaBanco = 'contas.descricao'; break;
      case 'valor': colunaBanco = 'contas.valor'; break;
      case 'status': colunaBanco = 'contas.status'; break;
      case 'data_vencimento': colunaBanco = 'contas.data_vencimento'; break;
      case 'responsavel_nome': colunaBanco = 'responsaveis.nome'; break;
      case 'categoria_nome': colunaBanco = 'categorias.nome_categoria'; break;
    }

    // 3. Aplica a ordenação e o limite CHAMANDO a variável 'query'
    query.orderBy(colunaBanco, orderDirection);
    query.limit(limit);
    query.offset(offset);

    return query
  }

  // Criar conta nova
  async criar(dados: IConta): Promise<IConta[]> {
    return await connection<IConta>('contas').insert(dados).returning('*');
  }

  // Buscar uma conta específica pelo ID
  async buscarPorId(id: number, id_usuario: number): Promise<IConta | undefined> {
    return await connection<IConta>('contas').where({ 
      'id_conta': id,
      'id_usuario': id_usuario
    }).first();
  }

  // Atualiza os dados de uma conta existente
  async atualizar(id: number, dados: Partial<IConta>): Promise<IConta[]> {
    return await connection<IConta>('contas')
      .where('id_conta', id)
      .update({
        ...dados,
        atualizado_em: connection.fn.now()
      })
      .returning('*');
  }

  // Remove uma conta do banco
  async excluir(id: number): Promise<number> {
    return await connection<IConta>('contas')
      .where('id_conta', id)
      .delete();
  }

  // Função para obter o resumo do dashboard (valores e dados dos gráficos)
  async obterResumoDashboard(id_usuario: number, mes: number, ano: number) {
    const dataAlvo = new Date(ano, mes - 1, 1);
    const inicioMes = format(startOfMonth(dataAlvo), 'yyyy-MM-dd 00:00:00');
    const fimMes = format(endOfMonth(dataAlvo), 'yyyy-MM-dd 23:59:59');

    // 1. Cards
    const resumoGeral = await connection('contas')
      .where('id_usuario', id_usuario)
      .select(
        connection.raw("SUM(CASE WHEN status = 'pago' THEN valor ELSE 0 END) as total_pago"),
        connection.raw("SUM(CASE WHEN status = 'pendente' THEN valor ELSE 0 END) as total_pendente"),
        // Contas que não estão pagas E a data já passou de hoje
        connection.raw("COUNT(CASE WHEN status = 'pendente' AND data_vencimento < CURRENT_DATE THEN 1 END) as qtd_atrasadas")
      )
      .first();

    // 2. Gráfico de Categorias (Total acumulado por categoria)
    const categorias = await connection('contas')
      .select('categorias.nome_categoria as label')
      .sum('contas.valor as total')
      .join('categorias', 'contas.id_categoria', 'categorias.id_categoria')
      .where('contas.id_usuario', id_usuario)
      .groupBy('categorias.nome_categoria');

    // 3. Gráfico de Evolução (Mantemos os últimos 6 meses para não poluir o visual)
    const seisMesesAtras = format(startOfMonth(subMonths(new Date(), 5)), 'yyyy-MM-dd 00:00:00');
    
    const evolucao = await connection('contas')
      .select(connection.raw("TO_CHAR(data_vencimento, 'MM/YYYY') as mes_ano"))
      .sum('valor as total')
      .where('id_usuario', id_usuario)
      .where('data_vencimento', '>=', seisMesesAtras)
      .groupBy('mes_ano')
      .orderByRaw("MIN(data_vencimento) ASC");

    return {
      pago: Number(resumoGeral?.total_pago || 0),
      pendente: Number(resumoGeral?.total_pendente || 0),
      qtdAtrasadas: Number(resumoGeral?.qtd_atrasadas || 0),
      graficoCategorias: {
        labels: categorias.map(c => c.label),
        valores: categorias.map(c => Number(c.total))
      },
      graficoEvolucao: {
        labels: evolucao.map(e => (e as any).mes_ano),
        valores: evolucao.map(e => Number(e.total))
      }
    };
  }

}

export default new ContasModel();