import { Request, Response, NextFunction } from 'express';
import { estudianteService } from '../service/estudiante.service.js';
import { CreateEstudianteDto } from '../dto/create-estudiante.dto.js';
import { UpdateEstudianteDto } from '../dto/update-estudiante.dto.js';
import { respondZodError } from '../../../helpers/respondZodError.js';
import { parsePagination } from '../../../helpers/parsePagination.js';

export const estudianteController = {
    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { page, limit } = parsePagination(req.query);
            const result = await estudianteService.getAll(page, limit);
            res.status(200).json({ status: 'success', ...result });
        } catch (err) {
            next(err);
        }
    },

    getById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id) || id <= 0) {
                return res.status(400).json({ status: 'error', message: 'ID inválido' });
            }
            const estudiante = await estudianteService.getById(id);
            if (!estudiante) {
                return res.status(404).json({ status: 'error', message: `No se encontró estudiante con id ${id}` });
            }
            res.status(200).json({ status: 'success', data: estudiante });
        } catch (err) {
            next(err);
        }
    },

    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = CreateEstudianteDto.safeParse(req.body);
            if (!parsed.success) return respondZodError(res, parsed.error);
            const nuevo = await estudianteService.create(parsed.data);
            res.status(201).location(`/api/v1/estudiantes/${nuevo.id}`).json({ status: 'success', data: nuevo });
        } catch (err) {
            next(err);
        }
    },

    update: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id) || id <= 0) {
                return res.status(400).json({ status: 'error', message: 'ID inválido' });
            }
            const parsed = UpdateEstudianteDto.safeParse(req.body);
            if (!parsed.success) return respondZodError(res, parsed.error);
            const actualizado = await estudianteService.update(id, parsed.data);
            if (!actualizado) {
                return res.status(404).json({ status: 'error', message: `No se encontró estudiante con id ${id}` });
            }
            res.status(200).json({ status: 'success', data: actualizado });
        } catch (err) {
            next(err);
        }
    },

    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id) || id <= 0) {
                return res.status(400).json({ status: 'error', message: 'ID inválido' });
            }
            const eliminado = await estudianteService.delete(id);
            if (!eliminado) {
                return res.status(404).json({ status: 'error', message: `No se encontró estudiante con id ${id}` });
            }
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    },
};