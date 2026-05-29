import { z } from 'zod';

export const CreateUsuarioDto = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio'),
  apellido: z.string().trim().min(1, 'El apellido es obligatorio'),
  email: z.string().email('Debe proporcionar un email válido').trim().toLowerCase(),
  contrasenia: z.string().trim().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  idAdministrativo: z.number().int('El ID administrativo debe ser un entero'),
  activo: z.boolean().optional(),
});

export type CreateUsuarioDto = z.infer<typeof CreateUsuarioDto>;