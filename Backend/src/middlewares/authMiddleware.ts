import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Interface para descrever o que tem dentro do Token
interface TokenPayload {
  id: number;
  iat: number; // Issued At (quando o token foi criado)
  exp: number; // Expires In (quando o token perde a validade)
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // 1. O token geralmente vem no cabeçalho 'Authorization'
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ erro: "Token não fornecido" });
  }

  // 2. Removemos a palavra "Bearer" para isolar apenas o código secreto (o hash)
  const token = authorization.replace("Bearer", "").trim();

  try {
    const secret = process.env.SECRET_KEY || "chave_secreta";
    
    // 3. Se o token foi alterado ou expirou, ele lançará um erro e cairá no 'catch'
    const data = jwt.verify(token, secret);

    // 4. Extraímos o ID do usuário que guardamos lá no LoginController
    const { id } = data as TokenPayload;
    
    // Anexamos o ID do usuário à requisição atual
    req.usuarioId = id;

    // 5. Ele encerra o trabalho do Middleware e passa para o Controller
    return next();

  } catch {
    return res.status(401).json({ erro: "Token inválido ou expirado" });
  }
};