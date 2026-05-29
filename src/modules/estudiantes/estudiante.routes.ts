import { Router } from 'express';
import { estudianteController } from './controller/estudiante.controller.js';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { validateRole } from '../../core/middlewares/validate-role.middleware.js';
import { Role } from '../../core/enums/role.enum.js';

export const estudianteRouter = Router();

// Lectura: cualquier autenticado puede ver estudiantes
estudianteRouter.get('/', validateJwt, estudianteController.getAll);
estudianteRouter.get('/:id', validateJwt, estudianteController.getById);

// Escritura: solo ADMIN puede crear, modificar o eliminar
estudianteRouter.post('/', validateJwt, validateRole(Role.ADMIN), estudianteController.create);
estudianteRouter.patch('/:id', validateJwt, validateRole(Role.ADMIN), estudianteController.update);
estudianteRouter.delete('/:id', validateJwt, validateRole(Role.ADMIN), estudianteController.delete);