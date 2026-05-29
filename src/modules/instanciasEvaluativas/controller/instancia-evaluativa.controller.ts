import { Request, Response, NextFunction } from 'express';
import { instanciaEvaluativaService } from '../service/instancia-evaluativa.service.js';
import { CreateInstanciaEvaluativaDto } from '../dto/create-instancia-evaluativa.dto.js';
import { UpdateInstanciaEvaluativaDto } from '../dto/update-instancia-evaluativa.dto.js';
import { parsePagination } from '../../../helpers/parsePagination.js';
import { respondZodError } from '../../../helpers/respondZodError.js';


export const instanciaEvaluativaController = {

  // GET /instancias-evaluativas?page=1&limit=10
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = parsePagination(req.query);
      const result = await instanciaEvaluativaService.getAll(page, limit);
      res.status(200).json({ status: 'success', ...result });
    } catch (err) {
      next(err);
    }
  },

  // GET /instancias-evaluativas/:id
  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }
      const instancia = await instanciaEvaluativaService.getById(id);
      if (!instancia) {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró ninguna instancia evaluativa con id ${id}.`,
        });
      }
      res.status(200).json({ status: 'success', data: instancia });
    } catch (err) {
      next(err);
    }
  },

  // GET /instancias-evaluativas/division-x-unidad-curricular/:idDivisionXUnidadCurricular
  getByDivisionXUnidadCurricular: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.idDivisionXUnidadCurricular as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "idDivisionXUnidadCurricular" debe ser un entero positivo.',
        });
      }
      const instancias = await instanciaEvaluativaService.getByDivisionXUnidadCurricular(id);
      res.status(200).json({ status: 'success', data: instancias });
    } catch (err) {
      next(err);
    }
  },

  // POST /instancias-evaluativas
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = CreateInstanciaEvaluativaDto.safeParse(req.body);
      if (!parsed.success) {
        return respondZodError(res, parsed.error);
      }
      const nueva = await instanciaEvaluativaService.create(parsed.data);
      res
        .status(201)
        .location(`/api/v1/instancias-evaluativas/${nueva.id}`)
        .json({ status: 'success', data: nueva });
    } catch (err) {
      next(err);
    }
  },

  // PATCH /instancias-evaluativas/:id
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }
      const parsed = UpdateInstanciaEvaluativaDto.safeParse(req.body);
      if (!parsed.success) {
        return respondZodError(res, parsed.error);
      }
      const actualizada = await instanciaEvaluativaService.update(id, parsed.data);
      if (!actualizada) {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró ninguna instancia evaluativa con id ${id}.`,
        });
      }
      res.status(200).json({ status: 'success', data: actualizada });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /instancias-evaluativas/:id
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }
      const eliminada = await instanciaEvaluativaService.delete(id);
      if (!eliminada) {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró ninguna instancia evaluativa con id ${id}.`,
        });
      }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
