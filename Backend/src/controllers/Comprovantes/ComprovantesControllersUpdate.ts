import type { Request, Response } from 'express';
import ComprovanteModel, {IComprovantes} from '../../models/ComprovantesModels.js';
import ContasModel from '../../models/ContasModel.js';
import fs from 'fs';
import path from 'path';
import { UploadedFile } from 'express-fileupload';

class ComprovantesControllerUpdate {
  async update(req: Request, res: Response) {
    try{
      const { id } = req.params;
      const id_usuario_logado = req.user?.id;
      const role_usuario = req.user?.role;

      if (id_usuario_logado === undefined) {
        return res.status(401).json({ error: "Usuário não identificado" });
      }

      // 1. Busca o comprovante atual no banco
      const comprovanteAtual = await ComprovanteModel.buscarPorId(Number(id));
      if (!comprovanteAtual) {
        return res.status(404).json({ error: "Comprovante não encontrado" });
      }

      // 2. Se o usuário não for ADMIN, verificamos se ele é o dono da conta
      if (role_usuario !== 'admin') {
        const contaPertenceAoUsuario = await ContasModel.buscarPorId(
          comprovanteAtual.id_conta, 
          id_usuario_logado
        );

        if (!contaPertenceAoUsuario) {
          return res.status(403).json({ 
            error: "Acesso negado: Você não tem permissão para alterar este comprovante." 
          });
        }
      }

      let dadosParaAtualizar: any = {};
      
      // A. O usuário mandou um NOVO ARQUIVO?
      if (req.files && req.files.comprovante) {
        const novoArquivo = req.files.comprovante as UploadedFile;

        // 1. Apaga o arquivo antigo do disco
        const caminhoAntigo = path.join('uploads', comprovanteAtual.caminho_arquivo);
        if (fs.existsSync(caminhoAntigo)) {
          fs.unlinkSync(caminhoAntigo);
        }

        // 2. Prepara o novo arquivo
        const nomeLimpo = novoArquivo.name.replace(/\s+/g, '_');
        const newName = `${Date.now()}_${nomeLimpo}`;
        const novoCaminho = path.join('uploads', newName);

        // 3. Move o novo arquivo para a pasta
        await novoArquivo.mv(novoCaminho);

        // 4. Atualiza os dados que vão para o banco
        dadosParaAtualizar.caminho_arquivo = newName;
        dadosParaAtualizar.nome_original = novoArquivo.name;
      }

      // B. O usuário só mandou um NOVO NOME no texto?
      if (req.body.nome_original && !req.files?.comprovante) {
        dadosParaAtualizar.nome_original = req.body.nome_original;
      }

      // 3. Salva as mudanças no banco de dados
      const [atualizado] = await ComprovanteModel.atualizar(Number(id), dadosParaAtualizar);

      return res.json({
        ...atualizado,
        url_arquivo: `http://localhost/arquivos/${atualizado.caminho_arquivo}`
      });

    } catch (error) {
      return res.status(500).json({ erro: "Erro ao atualizar comprovante" });
    }
  }
};

export default new ComprovantesControllerUpdate();