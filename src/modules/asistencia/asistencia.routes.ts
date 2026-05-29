import { Router } from 'express';
import { asistenciaController } from './controller/asistencia.controller.js';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { validateRole } from '../../core/middlewares/validate-role.middleware.js';
import { Role } from '../../core/enums/role.enum.js';

export const asistenciaRouter = Router();

// Rutas de lectura (cualquier autenticado)
asistenciaRouter.get(
  '/',
  validateJwt,
  asistenciaController.getAll,
);

asistenciaRouter.get(
  '/:id',
  validateJwt,
  asistenciaController.getById,
);

// Rutas de escritura (requieren ADMIN o algún rol con permisos, ej: DOCENTE/ADMIN)
// Usamos Role.ADMIN por defecto basado en el modelo administrativo.
asistenciaRouter.post(
  '/',
  validateJwt,
  validateRole(Role.ADMIN),
  asistenciaController.create,
);

asistenciaRouter.patch(
  '/:id',
  validateJwt,
  validateRole(Role.ADMIN),
  asistenciaController.update,
);

asistenciaRouter.delete(
  '/:id',
  validateJwt,
  validateRole(Role.ADMIN),
  asistenciaController.delete,
);
