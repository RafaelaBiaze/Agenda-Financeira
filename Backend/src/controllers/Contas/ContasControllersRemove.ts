import type { Request, Response } from 'express';
import ContasModel, {IConta} from '../../models/ContasModel.js';

class ContasControllerRemove {
  async remove(req: Request, res: Response) {
    try{
      // 1. Verifica se o usuário está autenticado e pega seu ID
      const id_usuario_logado = req.user?.id; // O middleware de autenticação deve ter anexado o usuário à requisição

      if (!id_usuario_logado) {
        return res.status(401).json({ erro: "Usuário não autenticado" });
      }

      // 2. Pegamos o ID da conta que vem na URL (ex: /contas/5)
      const { id } = req.params;

      // 3. Remove a conta do banco
      await ContasModel.excluir(Number(id));

      return res.status(204).send();
    }
    catch(error){
        return res.status(500).json({ erro: "Erro ao remover conta" });
    }
  }
};

export default new ContasControllerRemove();