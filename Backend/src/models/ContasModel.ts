import connection from '../database/connection.js';

// Esta interface garante que não esqueça nenhum campo
export interface IConta {
  id_conta?: number;
  descricao: string;
  valor: number;
  data_vencimento: string;
  status: 'pago' | 'pendente' | 'atrasado';
  id_categoria: number;
  id_responsavel: number;
}

class ContasModel {
  // Função para listar todas as contas com os nomes das categorias
  async listarTodas(id_usuario: number) {
    return await connection('contas')
      // 1. Especificamos que o ID é da tabela contas
      .where('contas.id_usuario', id_usuario)

      .leftJoin('categorias', 'contas.id_categoria', 'categorias.id_categoria')
      .leftJoin('responsaveis', 'contas.id_responsavel', 'responsaveis.id_responsavel')
      
      .select(
        'contas.*', 
        'categorias.nome_categoria', 
        'responsaveis.nome as nome_responsavel'
      );
  }

  // Criar conta nova
  async criar(dados: IConta) {
    return await connection('contas').insert(dados).returning('*');
  }

  // Buscar uma conta específica pelo ID
  async buscarPorId(id: number, id_usuario: number) {
    return await connection('contas').where({ 
      'id_conta': id,
      'id_usuario': id_usuario
    }).first();
  }

  // Atualiza os dados de uma conta existente
  async atualizar(id: number, dados: Partial<IConta>) {
    return await connection('contas')
      .where('id_conta', id)
      .update(dados)
      .returning('*');
  }

  // Remove uma conta do banco
  async excluir(id: number) {
    return await connection('contas')
      .where('id_conta', id)
      .delete();
  }
}

export default new ContasModel();