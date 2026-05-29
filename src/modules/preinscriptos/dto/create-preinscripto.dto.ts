import { z } from 'zod';

export const CreatePreinscriptoDto = z.object({
  idInscripcionCarrera: z.number().int().positive(),
  idUsuario: z.number().int().positive(),
  fechaInscripcion: z.string().date(),     // formato YYYY-MM-DD
  cus: z.string().trim().min(1),
  isa: z.string().trim().min(1),
  emmac: z.string().nullable().optional(),
  analitico: z.string().trim().min(1),
  partidaNacimiento: z.string().trim().min(1),
  foto: z.string().trim().min(1),
  estado: z.enum(['pendiente', 'aprobado', 'rechazado']).default('pendiente'),
  idAdministrativo: z.number().int().positive(),
});

export type CreatePreinscriptoDto = z.infer<typeof CreatePreinscriptoDto>;