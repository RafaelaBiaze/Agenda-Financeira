import { Router } from 'express';
import ContasController from '../controllers/ContasControllers.js';
import { UsuariosController } from '../controllers/UsuariosControllers.js';
import { LoginController } from '../controllers/LoginControllers.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const routes = Router();

// Quando o navegador acessar /contas, ele chama a função index do controller
routes.get('/contas', authMiddleware, ContasController.index);

// Quando o navegador acessar /usuarios, ele chama a função create do controller
routes.post('/usuarios', UsuariosController.create);

// Login
routes.post('/login', LoginController.login);

export default routes;