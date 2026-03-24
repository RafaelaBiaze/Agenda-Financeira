import { Router } from 'express';
import { UsuariosController } from '../controllers/UsuariosControllers.js';
import { LoginController } from '../controllers/LoginControllers.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/isAdmin.js';

import DashboardController from '../controllers/DashboardControllers.js';

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

import ResponsaveisControllerList from '../controllers/Responsaveis/ResponsaveisControllersList.js';
import ResponsaveisControllersListID from '../controllers/Responsaveis/ResponsaveisControllersListID.js';
import ResponsaveisControllerCreate from '../controllers/Responsaveis/ResponsaveisControllersCreate.js';
import ResponsaveisControllerUpdate from '../controllers/Responsaveis/ResponsaveisControllersUpdate.js';
import ResponsaveisControllerRemove from '../controllers/Responsaveis/ResponsaveisControllersRemove.js';

import ComprovantesControllersCreate from '../controllers/Comprovantes/ComprovantesControllersCreate.js';
import ComprovantesControllersList from '../controllers/Comprovantes/ComprovantesControllersList.js';
import ComprovantesControllersListID from '../controllers/Comprovantes/ComprovantesControllersListID.js';
import ComprovantesControllersUpdate from '../controllers/Comprovantes/ComprovantesControllersUpdate.js';
import ComprovantesControllerRemove from '../controllers/Comprovantes/ComprovantesControllersRemove.js';

const routes = Router();


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

// Comprovantes
// Lista todos os comprovantes (admin) ou apenas os do usuário logado
routes.get('/comprovantes', authMiddleware, ComprovantesControllersList.list);
// Lista um comprovante específico, garantindo que o usuário só possa acessar seus próprios comprovantes (a não ser que seja admin)
routes.get('/comprovantes/:id', authMiddleware, ComprovantesControllersListID.listID);
// Cria um novo comprovante associado a uma conta do usuário logado
routes.post('/comprovantes', authMiddleware, ComprovantesControllersCreate.create);
// Edita um comprovante existente, garantindo que o usuário só possa editar seus próprios comprovantes (a não ser que seja admin)
routes.put('/comprovantes/:id', authMiddleware, ComprovantesControllersUpdate.update);
// Remove um comprovante existente, garantindo que o usuário só possa remover seus próprios comprovantes (a não ser que seja admin)
routes.delete('/comprovantes/:id', authMiddleware, ComprovantesControllerRemove.remove);

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

// Responsáveis
// Lista todos os responsáveis
routes.get('/responsaveis', authMiddleware, ResponsaveisControllerList.list);
// Lista um responsável específico
routes.get('/responsaveis/:id', authMiddleware, ResponsaveisControllersListID.listID);
// Cria um novo responsável
routes.post('/responsaveis', authMiddleware, isAdmin, ResponsaveisControllerCreate.create);
// Edita um responsável existente
routes.put('/responsaveis/:id', authMiddleware, isAdmin, ResponsaveisControllerUpdate.update);
// Remove um responsável existente
routes.delete('/responsaveis/:id', authMiddleware, isAdmin, ResponsaveisControllerRemove.remove);

// Dashboard
routes.get('/dashboard/summary', authMiddleware, DashboardController.summary);

// Quando o navegador acessar /usuarios, ele chama a função create do controller
routes.post('/usuarios', authMiddleware, isAdmin, UsuariosController.create);

// Login
routes.post('/login', LoginController.login);

export default routes;