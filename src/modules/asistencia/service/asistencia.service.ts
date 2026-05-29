import Asistencia from '../model/Asistencia.js';
import type { CreateAsistenciaDto } from '../dto/create-asistencia.dto.js';
import type { UpdateAsistenciaDto } from '../dto/update-asistencia.dto.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const asistenciaService = {
  async getAll(page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT) {
    const offset = (page - 1) * limit;
    const { count, rows } = await Asistencia.findAndCountAll({
      limit,
      offset,
      order: [['id', 'ASC']],
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
    return Asistencia.findByPk(id);
  },

  async create(data: CreateAsistenciaDto) {
    return Asistencia.create(data as any);
  },

  async update(id: number, data: UpdateAsistenciaDto) {
    const record = await Asistencia.findByPk(id);
    if (!record) return null;
    await record.update(data as any);
    return record;
  },

  async delete(id: number) {
    const record = await Asistencia.findByPk(id);
    if (!record) return null;
    await record.destroy();
    return true;
  },
};
