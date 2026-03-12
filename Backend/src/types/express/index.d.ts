// src/@types/express/index.d.ts

declare namespace Express {
    // Nós estamos "reabrindo" a interface Request do Express
    // e adicionando o nosso campo personalizado
    export interface Request {
        user?: {
            id: number;
            email: string;
            role: 'admin' | 'user';
        };
    }
}