import Docente from '../model/Docente.js';
import type { CreateDocenteDto } from '../dto/create-docente.dto.js';
import type { UpdateDocenteDto } from '../dto/update-docente.dto.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const docenteService = {

  async getAll(page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT) {
    const offset = (page - 1) * limit;
    const { count, rows } = await Docente.findAndCountAll({
      limit,
      offset,
      order: [['id', 'ASC']],
      attributes: { exclude: ['contrasenia'] },
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
    return Docente.findByPk(id, {
      attributes: { exclude: ['contrasenia'] },
    });
  },

  async create(data: CreateDocenteDto) {
    return Docente.create(data as any);
  },

  async update(id: number, data: UpdateDocenteDto) {
    const docente = await Docente.findByPk(id);
    if (!docente) return null;
    await docente.update(data);
    return Docente.findByPk(id, {
      attributes: { exclude: ['contrasenia'] },
    });
  },

  async delete(id: number) {
    const docente = await Docente.findByPk(id);
    if (!docente) return null;
    await docente.destroy();
    return true;
  },
};