import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../core/middlewares/error-handler.middleware.js';

export const uploadController = {
  uploadFile: (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file;

      if (!file) {
        throw new AppError('No se proporcionó ningún archivo o el formato no es válido.', 400);
      }

      const folder = req.params.tipo || 'otros';
      
      // Construir la URL del archivo
      // Usamos el protocolo y el host de la petición original
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const fileUrl = `${baseUrl}/uploads/${folder}/${file.filename}`;

      return res.status(200).json({
        status: 'success',
        message: 'Archivo subido correctamente',
        data: {
          url: fileUrl,
          filename: file.filename,
          mimetype: file.mimetype,
          size: file.size
        }
      });
    } catch (error) {
      next(error);
    }
  }
};
