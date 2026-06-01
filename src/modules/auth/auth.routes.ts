import { Router } from 'express';
import { authController } from './controller/auth.controller.js';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';

export const authRouter = Router();

// POST /api/v1/auth/login — no requiere autenticación previa
authRouter.post('/login', authController.login);

// POST /api/v1/auth/logout — requiere token válido
authRouter.post('/logout', validateJwt, authController.logout);