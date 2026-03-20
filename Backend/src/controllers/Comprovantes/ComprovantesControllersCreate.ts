import { Request, Response } from 'express';
import ComprovanteModel, {IComprovantes} from '../../models/ComprovantesModels.js';
import ContasModel from '../../models/ContasModel.js';
import fs from 'fs'; // Para deletar arquivos físicos se necessário
import path from 'path';
import { UploadedFile } from 'express-fileupload'; // Tipagem do pacote

class ComprovantesController {
  async create(req: Request, res: Response) {
    try {
      const id_usuario_logado = req.user?.id;
      const { id_conta } = req.body;

      if (id_usuario_logado === undefined) {
        return res.status(401).json({ error: "Usuário não identificado" });
      }

      // 1. Verificamos se o arquivo chegou com o nome 'comprovante'
      if (!req.files || !req.files.comprovante) {
        return res.status(400).json({ error: 'Arquivo não enviado. Use a chave "comprovante"' });
      }

      const arquivo = req.files.comprovante as UploadedFile;

      // 2. Verifica se a conta está associada ao usuário logado
      const conta = await ContasModel.buscarPorId(Number(id_conta), id_usuario_logado);
      if (!conta) {
        return res.status(403).json({ error: 'Conta não encontrada ou sem permissão' });
      }

      // 3. Limpa o nome do arquivo
      const nomeLimpo = arquivo.name.replace(/\s+/g, '_');
      const newName = `${Date.now()}_${nomeLimpo}`;
      
      // Caminho onde o arquivo vai salvar no servidor
      const caminho = path.join('uploads', newName);

      // 4. Primeiro tentamos mover o arquivo físico
      arquivo.mv(caminho, async (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Erro ao salvar o arquivo no servidor' });
        }

        try {
          // 5. Se o arquivo foi movido, salvamos a referência no banco
          const novoComprovante = await ComprovanteModel.criar({
            id_conta: Number(id_conta),
            caminho_arquivo: newName,
            nome_original: arquivo.name
          });

          return res.json({
            ...novoComprovante,
            url_arquivo: `http://localhost/arquivos/${novoComprovante.caminho_arquivo}`
          });

        } catch (dbError) {
          // 6. Se erro, deleta o arquivo para não ocupar espaço desnecessário
          if (fs.existsSync(caminho)) fs.unlinkSync(caminho);
          return res.status(500).json({ error: 'Erro ao salvar no banco de dados' });
        }
      });

    } catch (error) {
      return res.status(500).json({ error: "Erro ao subir comprovante" });
    }
  }
}

export default new ComprovantesController();