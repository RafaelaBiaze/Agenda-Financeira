import type { Request, Response } from 'express';
import ComprovanteModel, {IComprovantes} from '../../models/ComprovantesModels.js';
import ContasModel from '../../models/ContasModel.js';

class ComprovantesControllerListID {
  async listID(req: Request, res: Response) {
    try{
      const id_usuario_logado = req.user?.id;
      const role_usuario = req.user?.role;
      const id_comprovante = Number(req.params.id);

      if (id_usuario_logado === undefined) {
        return res.status(401).json({ erro: "Usuário não identificado" });
      }

      // 1. Busca o comprovante pelo ID para verificar se ele existe e pegar o ID da conta associada
      const comprovante = await ComprovanteModel.buscarPorId(id_comprovante);

      if (!comprovante) {
        return res.status(404).json({ erro: "Comprovante não encontrado" });
      }

      // 2. Verifica se o usuário tem permissão para acessar esse comprovante
      if (role_usuario !== 'admin') {
        const conta = await ContasModel.buscarPorId(comprovante.id_conta, id_usuario_logado);
        
        if (!conta) {
          // Usamos 404 para não confirmar que o arquivo existe,
          // e para evitar usuários mal-intencionados descobrirem comprovantes de outros usuários
          return res.status(404).json({ erro: "Comprovante não encontrado ou sem permissão" });
        }
      }

      return res.json(comprovante);
    }
    catch(error){
      return res.status(500).json({ erro: "Erro ao listar comprovante" });
    }
  }
};

export default new ComprovantesControllerListID();