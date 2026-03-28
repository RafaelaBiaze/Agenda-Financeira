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
  // Função para criar um novo usuário
  async criar(usuario: IUsuario): Promise<IUsuario> {
    const [novoUsuario] = await connection<IUsuario>("usuarios").insert(usuario).returning("*");
    return novoUsuario;
  }

  // Função para buscar um usuário pelo email
  async buscarPorEmail(email: string): Promise<IUsuario | undefined> {
    return connection<IUsuario>("usuarios").where({ email }).first();
  }
}

export default new UsuariosModel();