import connection from '../database/connection.js';

// Esta interface garante que não esqueça nenhum campo
export interface IResponsavel {
  id_responsavel?: number;
  nome: string;
  tipo: 'F' | 'J';
  documento: string;
  observacoes?: string;
}

class ResponsaveisModel {
  // Função para listar todos os responsáveis
  async listarTodos(): Promise<IResponsavel[]> {
    return await connection<IResponsavel>('responsaveis').select('*').orderBy('nome', 'asc');
  }

  // Criar responsável novo
  async criar(dados: IResponsavel): Promise<IResponsavel[]> {
    return await connection<IResponsavel>('responsaveis').insert(dados).returning('*');
  }
  
  // Buscar um responsável específico
  async buscarPorID(id: number): Promise<IResponsavel | undefined> {
    return await connection<IResponsavel>('responsaveis').where({'id_responsavel': id}).first();
  }

  // Atualiza os dados de um responsável existente
  async atualizar(id: number, dados: Partial<IResponsavel>): Promise<IResponsavel[]> {
    return await connection<IResponsavel>('responsaveis')
      .where('id_responsavel', id)
      .update(dados)
      .returning('*');
  }

  // Remove um responsável do banco
  async excluir(id: number): Promise<number> {
    return await connection<IResponsavel>('responsaveis')
      .where('id_responsavel', id)
      .delete();
  }   
}

export default new ResponsaveisModel();