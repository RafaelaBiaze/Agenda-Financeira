import connection from '../database/connection.js';
import { startOfMonth, endOfMonth, startOfYear, endOfYear, format } from 'date-fns';

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
    filtros?: { 
      busca?: string; 
      mes?: number; 
      ano?: number;
      filtroCategoria?: string;
      filtroResponsavel?: string;
      limit?: number; 
      offset?: number
    }
  ): Promise<(IConta & { nome_categoria: string; nome_responsavel: string })[]> {
    const { busca, mes, ano, filtroCategoria, filtroResponsavel, limit = 10, offset = 0 } = filtros || {};
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

    // 2. Filtros Dinâmicos (para busca personalizada)
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

    // 3. Aplica a ordenação e o limite CHAMANDO a variável 'query'
    query.limit(limit);
    query.offset(offset);
    query.orderBy('contas.data_vencimento', 'asc');

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
}

export default new ContasModel();