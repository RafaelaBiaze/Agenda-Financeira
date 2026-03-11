import connection from '../database/connection.js';

// Esta interface garante que não esqueça nenhum campo
export interface Usuario {
  id_usuario?: number;
  nome: string;
  email: string;
  senha: string;
  data_criacao?: string;
  data_atualizacao?: string;
}

class UsuariosModel {
  // Função para criar um novo usuário
  async criar(usuario: Usuario) {
    return connection("usuarios").insert(usuario).returning("*");
  };

  // Função para buscar um usuário pelo email (útil para login)
  async buscarPorEmail(email: string) {
    return connection("usuarios").where({ email }).first();
  }
}

export default new UsuariosModel();