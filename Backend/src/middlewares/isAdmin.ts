import { Request, Response, NextFunction } from 'express';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // 1. Verificamos se o usuário foi anexado à requisição (pelo middleware de autenticação)
  const usuario = (req as any).user; 

  if (!usuario) {
    return res.status(401).json({ erro: "Usuário não autenticado." });
  }

  // 2. Verificamos se o papel (role) é 'admin'
  if (usuario.role !== 'admin') {
    return res.status(403).json({ 
      erro: "Acesso negado. Esta operação exige privilégios de administrador." 
    });
  }

  console.log("ADMIN: Recebi o usuário ->", req.user);
  return next();
};