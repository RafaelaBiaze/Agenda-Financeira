import type { Request, Response } from 'express';
import ContasModel from '../../models/ContasModel.js';

class ContasControllerUpdate {
  async update(req: Request, res: Response) {
    try{
        // 1. Verifica se o usuário está autenticado e pega seu ID
        const id_usuario_logado = req.user?.id; // O middleware de autenticação deve ter anexado o usuário à requisição

        if (!id_usuario_logado) {
            return res.status(401).json({ erro: "Usuário não autenticado" });
        }

        // 2. Pegamos o ID da conta que vem na URL (ex: /contas/5)
        const { id } = req.params;

        // 3. Verificamos se a conta existe e pertence a este utilizador
        const contaExistente = await ContasModel.buscarPorId(Number(id), id_usuario_logado);

        if (!contaExistente) {
        return res.status(404).json({ erro: "Conta não encontrada" });
        }

        // 4. Impede que o usuário A edite a conta do usuário B
        if (contaExistente.id_usuario !== id_usuario_logado) {
            return res.status(403).json({ erro: "Sem permissão para alterar esta conta" });
        }

        const dadosParaAtualizar = { ...req.body };

        // 5. Atualiza a conta do usuário logado
        const [contaAtualizada] = await ContasModel.atualizar(Number(id), dadosParaAtualizar);

        return res.json(contaAtualizada);
    }
    catch(error){
        return res.status(500).json({ erro: "Erro ao atualizar conta" });
    }
  }
};

export default new ContasControllerUpdate();