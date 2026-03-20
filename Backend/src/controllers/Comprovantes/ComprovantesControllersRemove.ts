import type { Request, Response } from 'express';
import ComprovanteModel, {IComprovantes} from '../../models/ComprovantesModels.js';
import ContasModel from '../../models/ContasModel.js';
import fs from 'fs';
import path from 'path';

class ComprovantesControllerRemove {
  async remove(req: Request, res: Response) {
    try{
      const id_usuario_logado = req.user?.id;
      const role_usuario = req.user?.role;
      const id_comprovante = Number(req.params.id);

      if (!id_usuario_logado) {
        return res.status(401).json({ erro: "Usuário não identificado" });
      }

      // 1. Busca o comprovante para saber o nome do arquivo e a qual conta ele pertence
      const comprovante = await ComprovanteModel.buscarPorId(id_comprovante);
      
      if (!comprovante) {
        return res.status(404).json({ erro: "Comprovante não encontrado" });
      }

      // 2. Só apaga se for o DONO ou se for ADMIN
      if (role_usuario !== 'admin') {
        const conta = await ContasModel.buscarPorId(comprovante.id_conta, id_usuario_logado);
        if (!conta) {
          return res.status(403).json({ erro: "Sem permissão para excluir este arquivo" });
        }
      }

      // 3. Apaga arquivo físico da pasta "uploads"
      const caminhoFisico = path.join('uploads', comprovante.caminho_arquivo);
      if (fs.existsSync(caminhoFisico)) {
        fs.unlinkSync(caminhoFisico); // Deleta o arquivo real da pasta
      }

      // 4. Remove do banco de dados
      await ComprovanteModel.excluir(id_comprovante);

      return res.status(204).send();
    }
    catch(error){
      return res.status(500).json({ erro: "Erro ao remover comprovante" });
    }
  }
};

export default new ComprovantesControllerRemove();