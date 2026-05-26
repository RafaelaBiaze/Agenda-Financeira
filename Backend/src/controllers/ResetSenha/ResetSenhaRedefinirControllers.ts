import { Request, Response } from "express";
import bcrypt from "bcrypt";
import UsuariosModel from "../../models/UsuariosModel.js";
import ResetSenhaModel from "../../models/ResetSenhaModel.js";

class ResetSenhaRedefinirController {
  async redefinir(req: Request, res: Response) {
    try {
      const { token, novaSenha } = req.body;

      if (!token || !novaSenha) {
        return res.status(400).json({ erro: "Token e nova senha são obrigatórios." });
      }

      // 1. Busca o token no banco de dados
      const registroReset = await ResetSenhaModel.buscarPorToken(token);

      if (!registroReset) {
        return res.status(400).json({ erro: "Token inválido ou não encontrado." });
      }

      // 2. Verifica se o token já passou da validade
      const agora = new Date();
      if (agora > registroReset.expiracao) {
        // Se expirou, já limpa ele do banco
        await ResetSenhaModel.deletarPorUsuario(registroReset.id_usuario);
        return res.status(400).json({ erro: "O link de recuperação expirou. Solicite um novo." });
      }

      // 3. Criptografa a nova senha
      const salt = await bcrypt.genSalt(10);
      const senhaCriptografada = await bcrypt.hash(novaSenha, salt);

      // 4. Atualiza o usuário com a nova senha
      await UsuariosModel.atualizar(registroReset.id_usuario, {
        senha: senhaCriptografada
      });

      // 5. Destrói o token para que o link do e-mail morra instantaneamente
      await ResetSenhaModel.deletarPorUsuario(registroReset.id_usuario);

      return res.status(200).json({ mensagem: "Senha redefinida com sucesso!" });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: "Erro interno ao redefinir a senha." });
    }
  }
}

export default new ResetSenhaRedefinirController();