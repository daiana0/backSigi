// src/modules/usuarios/controller/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import { usuarioService } from '../service/usuario.service.js';
import jwt from 'jsonwebtoken';
import { AppError } from '../../../core/middlewares/error-handler.middleware.js';

export const authController = {
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, contrasenia } = req.body;

      const usuario = await usuarioService.getByEmail(email);
      if (!usuario) throw new AppError('Credenciales inválidas', 401);

      // Verificamos el hash con el método que debería estar en tu modelo Usuario
      const esValida = await usuario.validarContrasenia(contrasenia);
      if (!esValida) throw new AppError('Credenciales inválidas', 401);

      const token = jwt.sign(
        { id: usuario.id, email: usuario.email },
        process.env.JWT_SECRET || 'secret_key_provisoria',
        { expiresIn: '8h' }
      );

      res.status(200).json({
        status: 'success',
        token,
        user: { id: usuario.id, nombre: usuario.nombre, email: usuario.email }
      });
    } catch (err) {
      next(err);
    }
  }
};