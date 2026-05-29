import InstanciaEvaluativa from '../model/InstanciaEvaluativa.js';
import type { CreateInstanciaEvaluativaDto } from '../dto/create-instancia-evaluativa.dto.js';
import type { UpdateInstanciaEvaluativaDto } from '../dto/update-instancia-evaluativa.dto.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const instanciaEvaluativaService = {

  async getAll(page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT) {
    const offset = (page - 1) * limit;
    const { count, rows } = await InstanciaEvaluativa.findAndCountAll({
      limit,
      offset,
      order: [['fecha', 'ASC']],
    });

    return {
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  },

  async getById(id: number) {
    return InstanciaEvaluativa.findByPk(id);
  },

  async getByDivisionXUnidadCurricular(idDivisionXUnidadCurricular: number) {
    return InstanciaEvaluativa.findAll({
      where: { idDivisionXUnidadCurricular },
      order: [['fecha', 'ASC']],
    });
  },

  async create(data: CreateInstanciaEvaluativaDto) {
    return InstanciaEvaluativa.create(data as any);
  },

  async update(id: number, data: UpdateInstanciaEvaluativaDto) {
    const instancia = await InstanciaEvaluativa.findByPk(id);
    if (!instancia) return null;
    await instancia.update(data as any);
    return instancia;
  },

  async delete(id: number) {
    const instancia = await InstanciaEvaluativa.findByPk(id);
    if (!instancia) return null;
    await instancia.destroy();
    return true;
  },
};
