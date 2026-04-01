import type { Request, Response } from 'express';
import UsuariosModel, { IUsuario } from '../../models/UsuariosModel.js';
import bcrypt from "bcrypt";

class UsuariosControllerUpdate {
  async update(req: Request, res: Response) {
    try{
      // 1. Pegamos o ID do usuário que vem na URL
      const { id } = req.params;

      // 2. Verificamos se o usuário existe
      const usuarioExistente = await UsuariosModel.buscarPorID(Number(id));

      if (!usuarioExistente) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }

      // 3. Pegamos os dados do corpo da requisição
      const { nome, email, senha, role } = req.body;

      // 4. Validação
      if (!email || !nome) {
        return res.status(400).json({ erro: "O nome e o email são obrigatórios." });
      }

      const dadosParaAtualizar: Partial<IUsuario> = {
        nome,
        email,
        role
      };

      // 5. Se a senha for fornecida e não for vazia, criptografa a nova senha
      if (senha && senha.trim() !== '') {
        const salt = await bcrypt.genSalt(10);
        dadosParaAtualizar.senha = await bcrypt.hash(senha, salt);
      }

      // 6. Atualiza o usuário no banco de dados
      const [usuarioAtualizado] = await UsuariosModel.atualizar(Number(id), dadosParaAtualizar);

      const { senha: senhaRemovida, ...usuarioSemSenha } = usuarioAtualizado;

      // Sem senha no retorno para não expor a senha mesmo que seja criptografada
      return res.json(usuarioSemSenha);
    }
    catch(error){
      return res.status(500).json({ erro: "Erro ao atualizar usuário" });
    }
  }
};

export default new UsuariosControllerUpdate();