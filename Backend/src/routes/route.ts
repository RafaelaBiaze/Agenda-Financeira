import { Router } from 'express';
import { UsuariosController } from '../controllers/UsuariosControllers.js';
import { LoginController } from '../controllers/LoginControllers.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import ContasControllerCreate from '../controllers/Contas/ContasControllersCreate.js';
import ContasControllerList from '../controllers/Contas/ContasControllersList.js';
import ContasControllerListID from '../controllers/Contas/ContasControllersListID.js';
import ContasControllerUpdate from '../controllers/Contas/ContasControllersUpdate.js';
import ContasControllerRemove from '../controllers/Contas/ContasControllersRemove.js';
import CategoriasControllerList from '../controllers/Categorias/CategoriasControllersList.js';
import CategoriasControllerListID from '../controllers/Categorias/CategoriasControllersListID.js';
import CategoriasControllerCreate from '../controllers/Categorias/CategoriasControllersCreate.js';
import CategoriasControllerUpdate from '../controllers/Categorias/CategoriasControllersUpdate.js';
import CategoriasControllerRemove from '../controllers/Categorias/CategoriasControllersRemove.js';

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

// Categorias
// Lista todas as categorias
routes.get('/categorias', authMiddleware, CategoriasControllerList.list);
// Lista uma categoria específica
routes.get('/categorias/:id', authMiddleware, CategoriasControllerListID.listID);
// Cria uma nova categoria
routes.post('/categorias', authMiddleware, isAdmin, CategoriasControllerCreate.create);
// Edita uma categoria existente
routes.put('/categorias/:id', authMiddleware, isAdmin, CategoriasControllerUpdate.update);
// Remove uma categoria existente
routes.delete('/categorias/:id', authMiddleware, isAdmin, CategoriasControllerRemove.remove);

// Quando o navegador acessar /usuarios, ele chama a função create do controller
routes.post('/usuarios', authMiddleware, isAdmin, UsuariosController.create);

// Login
routes.post('/login', LoginController.login);

export default routes;