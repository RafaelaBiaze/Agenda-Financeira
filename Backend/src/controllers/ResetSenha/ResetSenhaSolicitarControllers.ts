import { Request, Response } from "express";
import crypto from "crypto";
import { Resend } from "resend";
import UsuariosModel from "../../models/UsuariosModel.js"; 
import ResetSenhaModel from "../../models/ResetSenhaModel.js";

class ResetSenhaSolicitarController {
  async solicitar(req: Request, res: Response) {
    try {
      
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ erro: "O e-mail é obrigatório." });
      }

      // 1. Verifica se o utilizador existe na tabela usuarios
      const usuario = await UsuariosModel.buscarPorEmail(email);

      if (!usuario || !usuario.id_usuario) {
        return res.json({ mensagem: "Se o e-mail existir no sistema, um link de recuperação será enviado." });
      }

      // 2. Limpa os tokens antigos deste utilizador para não acumular
      await ResetSenhaModel.deletarPorUsuario(usuario.id_usuario);

      // 3. Gera o Token e a validade (1 hora a partir de agora)
      const token = crypto.randomBytes(20).toString("hex");
      const expiracao = new Date(Date.now() + 3600000);

      // 4. Guarda o novo token na tabela reset_senha
      await ResetSenhaModel.criar({
        id_usuario: usuario.id_usuario,
        token: token,
        expiracao: expiracao
      });

      // 5. Inicializa a API do Resend e monta o link
      const resend = new Resend(process.env.RESEND_API_KEY);
      const linkReset = `${process.env.FRONTEND_URL}/redefinir-senha?token=${token}`;
      
      // 6. Dispara a mensagem via HTTPS
      await resend.emails.send({
        from: 'Suporte SmartAgenda <onboarding@resend.dev>',
        to: email,
        subject: "Recuperação de Senha - SmartAgenda",
        html: `
          <h3>Recuperação de Senha</h3>
          <p>Olá, ${usuario.nome}!</p>
          <p>Foi solicitada a recuperação de senha para a tua conta. Clica no link abaixo para criar uma nova senha:</p>
          <a href="${linkReset}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Redefinir Minha Senha</a>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">Este link expira em 1 hora. Se não fizeste este pedido, podes ignorar este e-mail.</p>
        `,
      });

      return res.json({ mensagem: "Se o e-mail existir no sistema, um link de recuperação será enviado." });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: "Erro interno ao solicitar recuperação." });
    }
  }
}

export default new ResetSenhaSolicitarController();