import { Router } from 'express';
import { legajoController } from './controller/legajo.controller.js';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { validateRole } from '../../core/middlewares/validate-role.middleware.js';
import { Role } from '../../core/enums/role.enum.js';

export const legajoRouter = Router();

// Lectura: cualquier autenticado
legajoRouter.get('/', validateJwt, legajoController.getAll);
legajoRouter.get('/:id', validateJwt, legajoController.getById);

// Escritura: solo ADMIN
legajoRouter.post('/', validateJwt, validateRole(Role.ADMIN), legajoController.create);
legajoRouter.patch('/:id', validateJwt, validateRole(Role.ADMIN), legajoController.update);
legajoRouter.delete('/:id', validateJwt, validateRole(Role.ADMIN), legajoController.delete);