import connection from '../database/connection.js';

// Esta interface garante que não esqueça nenhum campo
export interface IUsuario {
  id_usuario?: number;
  nome: string;
  email: string;
  senha: string;
  role: 'admin' | 'user';
  criado_em?: string;
  atualizado_em?: string;
}

class UsuariosModel {
  // Função para buscar um usuário pelo email
  async buscarPorEmail(email: string): Promise<IUsuario | undefined> {
    return connection<IUsuario>("usuarios").where({ email }).first();
  }

  // Função para listar todos os usuários
  async listarTodos(): Promise<IUsuario[]> {
    return await connection<IUsuario>('usuarios').select('*').orderBy('nome', 'asc');
  }

  // Criar usuário novo
  async criar(dados: IUsuario): Promise<IUsuario[]> {
    return await connection<IUsuario>('usuarios').insert(dados).returning('*');
  }
  
  // Buscar um usuário específico
  async buscarPorID(id: number): Promise<IUsuario | undefined> {
    return await connection<IUsuario>('usuarios').where({'id_usuario': id}).first();
  }

  // Atualiza os dados de um usuário existente
  async atualizar(id: number, dados: Partial<IUsuario>): Promise<IUsuario[]> {
    return await connection<IUsuario>('usuarios')
      .where('id_usuario', id)
      .update({
        ...dados,
        atualizado_em: connection.fn.now()
      })
      .returning('*');
  }

  // Remove um usuário do banco
  async excluir(id: number): Promise<number> {
    return await connection<IUsuario>('usuarios')
      .where('id_usuario', id)
      .delete();
  }   
}

export default new UsuariosModel();