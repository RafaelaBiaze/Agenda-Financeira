import type { Request, Response } from 'express';
import ResponsaveisModels, {IResponsavel} from '../../models/ResponsaveisModels.js';

class ResponsaveisControllerCreate {
  async create(req: Request, res: Response) {
    try{
      // 1. Pegamos os dados do body
      const { nome, tipo, documento, observacoes } = req.body;

      // 2. Limpeza do documento (Evita salvar "123.456" em vez de "123456")
      const documentoLimpo = documento.replace(/\D/g, "");

      // 3. Criamos o objeto seguindo a Interface IResponsavel
      const dadosNovoResponsavel: IResponsavel = {
        nome,
        tipo, 
        documento: documentoLimpo,
        observacoes
      };

      // 4. Chamamos a Model
      const novoResponsavel = await ResponsaveisModels.criar(dadosNovoResponsavel);

      return res.status(201).json(novoResponsavel);
    }
    catch(error){
      return res.status(500).json({ erro: "Erro ao criar responsável" });
    }
  }
};

export default new ResponsaveisControllerCreate();