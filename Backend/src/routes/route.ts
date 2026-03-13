import { Router } from 'express';
import ContasControllerCreate from '../controllers/Contas/ContasControllersCreate.js';
import ContasControllerList from '../controllers/Contas/ContasControllersList.js';
import ContasControllerListID from '../controllers/Contas/ContasControllersListID.js';
import ContasControllerUpdate from '../controllers/Contas/ContasControllersUpdate.js';
import ContasControllerRemove from '../controllers/Contas/ContasControllersRemove.js';
import { UsuariosController } from '../controllers/UsuariosControllers.js';
import { LoginController } from '../controllers/LoginControllers.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const routes = Router();

// Contas
// Lista todas as contas do usuário logado, incluindo os nomes das categorias e responsáveis
routes.get('/contas', authMiddleware, ContasControllerList.list);
// Lista uma conta específica do usuário logado, incluindo o nome da categoria e responsável
routes.get('/contas/:id', authMiddleware, ContasControllerListID.listID);
// Cria uma nova conta associada ao usuário logado
routes.post('/contas', authMiddleware, ContasControllerCreate.create);
// Edita uma conta existente, garantindo que o usuário só possa editar suas próprias contas
routes.put('/contas/:id', authMiddleware, ContasControllerUpdate.update);
// Remove uma conta existente, garantindo que só administrador possa remover contas
routes.delete('/contas/:id', authMiddleware, isAdmin, ContasControllerRemove.remove);

// Quando o navegador acessar /usuarios, ele chama a função create do controller
routes.post('/usuarios', authMiddleware, isAdmin, UsuariosController.create);

// Login
routes.post('/login', LoginController.login);

export default routes;