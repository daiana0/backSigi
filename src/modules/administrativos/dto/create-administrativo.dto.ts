import { z } from 'zod';

export const CreateAdministrativoDto = z.object({
  nombre: z.string().trim().min(1),
  apellido: z.string().trim().min(1),
  email: z.string().email(),
  dni: z.string().regex(/^\d+$/, 'Debe contener solo números'),
  contrasenia: z.string().min(6),
  telefono: z.string().min(1),
  domicilio: z.string().min(1),
  idRol: z.number().int().positive(),
  activo: z.boolean().optional().default(true),
});

export type CreateAdministrativoDto = z.infer<typeof CreateAdministrativoDto>;