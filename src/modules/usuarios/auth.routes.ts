import { Router } from 'express';
import { authController } from './controller/auth.controller.js';

export const authRouter = Router();

// POST /api/v1/auth/login — autenticación (no requiere JWT previo)
authRouter.post('/login', authController.login);
