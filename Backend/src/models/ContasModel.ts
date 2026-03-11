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
  async listarTodas() {
    return await connection('contas')
      .join('categorias', 'contas.id_categoria', 'categorias.id_categoria')
      .join('responsaveis', 'contas.id_responsavel', 'responsaveis.id_responsavel')
      .select(
        'contas.*', 
        'categorias.nome_categoria', 
        'responsaveis.nome as nome_responsavel'
      );
  }

  // Função para criar uma nova conta
  async criar(dados: IConta) {
    return await connection('contas').insert(dados).returning('*');
  }

  // Função para buscar uma conta específica pelo ID
  async buscarPorId(id: number) {
    return await connection('contas').where('id_conta', id).first();
  }
}

export default new ContasModel();