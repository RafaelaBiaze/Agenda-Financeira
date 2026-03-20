import type { Request, Response } from 'express';
import ResponsaveisModels, {IResponsavel} from '../../models/ResponsaveisModels.js';

class ResponsaveisControllerUpdate {
  async update(req: Request, res: Response) {
    try{
      // 1. Pegamos o ID do responsável que vem na URL (ex: /responsaveis/5)
      const { id } = req.params;

      // 2. Verificamos se o responsável existe
      const responsavelExistente = await ResponsaveisModels.buscarPorID(Number(id));

      if (!responsavelExistente) {
        return res.status(404).json({ erro: "Responsável não encontrado" });
      }

      const dadosDoResponsavel: IResponsavel = req.body;

      if (!dadosDoResponsavel.nome && !dadosDoResponsavel.documento) {
        return res.status(400).json({ erro: "O novo nome e documento do responsável é obrigatório." });
      }

      // 3. Atualiza o responsável
      const [responsavelAtualizado] = await ResponsaveisModels.atualizar(Number(id), dadosDoResponsavel);

      return res.json(responsavelAtualizado);
    }
    catch(error){
      return res.status(500).json({ erro: "Erro ao atualizar responsável" });
    }
  }
};

export default new ResponsaveisControllerUpdate();