import connection from '../database/connection.js';

export interface IResetSenha {
  id?: number;
  id_usuario: number;
  token: string;
  expiracao: Date;
  criado_em?: string;
}

class ResetSenhaModel {
  // Salva o novo token no banco
  async criar(dados: IResetSenha): Promise<IResetSenha[]> {
    return await connection<IResetSenha>("reset_senha")
      .insert(dados)
      .returning('*');
  }

  // Busca o token na hora que o usuário tenta trocar a senha
  async buscarPorToken(token: string): Promise<IResetSenha | undefined> {
    return await connection<IResetSenha>("reset_senha")
      .where({ token })
      .first();
  }

  // Limpa tokens antigos
  async deletarPorUsuario(id_usuario: number): Promise<number> {
    return await connection<IResetSenha>("reset_senha")
      .where({ id_usuario })
      .delete();
  }
}

export default new ResetSenhaModel();