import connection from '../database/connection.js';

// Esta interface garante que não esqueça nenhum campo
export interface IComprovantes {
  id_comprovante?: number;
  caminho_arquivo: string;
  nome_original: string;
  data_upload?: string;
  id_conta: number;
  criado_em?: string;
  atualizado_em?: string;
}

class ComprovantesModel {
  // Função para listar todos os comprovantes (admin)
  async listarTodos(): Promise<IComprovantes[]> {
    return await connection<IComprovantes>('comprovantes').select('*').orderBy('data_upload', 'desc');
  }

  // Listar apenas o que pertence ao usuário
  async listarPorUsuario(id_usuario: number): Promise<IComprovantes[]> {
    return await connection<IComprovantes>('comprovantes')
      .join('contas', 'comprovantes.id_conta', '=', 'contas.id_conta')
      .where('contas.id_usuario', id_usuario)
      .select('comprovantes.*')
      .orderBy('comprovantes.data_upload', 'desc');
  }

  // Criar um novo comprovante
  async criar(dados: IComprovantes): Promise<IComprovantes> {
    const [novo] = await connection<IComprovantes>('comprovantes')
      .insert(dados)
      .returning('*');
    
    return novo;
  }

  // Buscar um comprovante específico
  async buscarPorId(id: number): Promise<IComprovantes | undefined> {
    return await connection<IComprovantes>('comprovantes')
      .where({ 'id_comprovante': id })
      .first();
  }

  // Atualiza os dados de um comprovante existente
  async atualizar(id: number, dados: Partial<IComprovantes>): Promise<IComprovantes[]> {
    return await connection<IComprovantes>('comprovantes')
        .where('id_comprovante', id)
        .update({
          ...dados,
          atualizado_em: connection.fn.now()
        })
        .returning('*');
  }

  // Excluir um comprovante
  async excluir(id: number): Promise<number> {
    return await connection<IComprovantes>('comprovantes')
      .where('id_comprovante', id)
      .delete();
  }
}

export default new ComprovantesModel();