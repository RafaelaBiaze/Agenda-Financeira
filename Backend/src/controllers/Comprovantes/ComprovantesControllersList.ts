import type { Request, Response } from 'express';
import ComprovanteModel, {IComprovantes} from '../../models/ComprovantesModels.js';

class ComprovantesControllerList {
  async list(req: Request, res: Response) {
    try{
      const id_usuario_logado = req.user?.id;
      const role_usuario = req.user?.role;

      if (id_usuario_logado === undefined) {
        return res.status(401).json({ erro: "Usuário não identificado" });
      }

      let comprovantes;

      // 1. Se for admin, usa o método que traz todos
      if (role_usuario === 'admin') {
        comprovantes = await ComprovanteModel.listarTodos();
      } else {
        // 2. Se for usuário comum, filtra apenas os dele
        comprovantes = await ComprovanteModel.listarPorUsuario(id_usuario_logado);
      }

      const comprovantesComUrl = comprovantes.map(comp => ({
        ...comp,
        url_arquivo: `http://localhost/arquivos/${comp.caminho_arquivo}`
      }));

      return res.json(comprovantesComUrl);
    }
    catch(error){
      return res.status(500).json({ erro: "Erro ao listar comprovantes" });
    }
  }
};

export default new ComprovantesControllerList();