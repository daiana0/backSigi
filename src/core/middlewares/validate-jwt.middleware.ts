import { Request, Response, NextFunction } from 'express';

export const validateJwt = (req: Request, res: Response, next: NextFunction) => {
  // Falta: extraer el token del header Authorization, verificarlo, y cargar `req.user`.
  // Ejemplo (solo para desarrollo):
  if (!req.headers.authorization) {
    return res.status(401).json({ status: 'error', message: 'Token no proporcionado' });
  }
  // Simular usuario autenticado
  (req as any).user = { id: 1, rol: 'ADMIN' };
  next();
};