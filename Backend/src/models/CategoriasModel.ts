import connection from '../database/connection.js';

// Esta interface garante que não esqueça nenhum campo
export interface ICategoria {
  id_categoria?: number;
  nome_categoria: string;
}

class CategoriaModel {
  // Função para listar todas as contas com os nomes das categorias
  async listarTodas() {
    return await connection('categorias').select('*').orderBy('nome_categoria', 'asc');
  }

  // Criar categoria nova
  async criar(nome: string) {
    return await connection('categorias').insert({ nome_categoria: nome }).returning('*');
  }

  // Buscar uma categoria específica
  async buscarPorID(id: number) {
    return await connection('categorias').where({'id_categoria': id}).first();
  }

  // Atualiza os dados de uma categoria existente
  async atualizar(id: number, nome: string) {
    return await connection('categorias')
      .where('id_categoria', id)
      .update({ nome_categoria: nome })
      .returning('*');
  }

  // Remove uma categoria do banco
  async excluir(id: number) {
    return await connection('categorias')
      .where('id_categoria', id)
      .delete();
  }
}

export default new CategoriaModel();