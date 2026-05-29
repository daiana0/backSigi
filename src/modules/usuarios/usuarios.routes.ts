import { Router } from 'express';
import { usuarioController } from './controller/usuario.controller.js';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { validateRole } from '../../core/middlewares/validate-role.middleware.js';
import { Role } from '../../core/enums/role.enum.js';

export const usuarioRouter = Router();

usuarioRouter.get('/', validateJwt, usuarioController.getAll);
usuarioRouter.get('/:id', validateJwt, usuarioController.getById);
usuarioRouter.post('/', validateJwt, validateRole(Role.ADMIN), usuarioController.create);
usuarioRouter.patch('/:id', validateJwt, validateRole(Role.ADMIN), usuarioController.update);
usuarioRouter.delete('/:id', validateJwt, validateRole(Role.ADMIN), usuarioController.delete);