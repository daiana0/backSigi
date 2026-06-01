import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

// Destino base para todas las subidas
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

// Asegurar que exista la carpeta principal
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Se espera que la ruta indique el tipo de entidad (ej: /api/v1/uploads/preinscriptos)
    // Extraemos ese parámetro, si no existe usamos 'otros'
    const folder = (req.params.tipo as string) || 'otros';
    const folderPath = path.join(UPLOADS_DIR, folder);

    // Si la subcarpeta no existe, la creamos dinámicamente
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    // Generar un nombre único para evitar colisiones
    const uniqueSuffix = crypto.randomUUID();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

// Filtro de archivos permitidos
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/pdf'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato de archivo no soportado. Solo se permiten JPG, JPEG, PNG y PDF.'));
  }
};

// Middleware configurado (con límite de tamaño de 5MB)
export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB max
  }
});
