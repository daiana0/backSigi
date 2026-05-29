import Legajo from '../model/Legajo.js';
import type { CreateLegajoDto } from '../dto/create-legajo.dto.js';
import type { UpdateLegajoDto } from '../dto/update-legajo.dto.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const legajoService = {
    async getAll(page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT) {
        const offset = (page - 1) * limit;
        const { count, rows } = await Legajo.findAndCountAll({
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
        return Legajo.findByPk(id);
    },

    async create(data: CreateLegajoDto) {
        return Legajo.create(data as any);
    },

    async update(id: number, data: UpdateLegajoDto) {
        const legajo = await Legajo.findByPk(id);
        if (!legajo) return null;
        await legajo.update(data);
        return legajo.reload();
    },

    async delete(id: number) {
        const legajo = await Legajo.findByPk(id);
        if (!legajo) return null;
        await legajo.destroy();
        return true;
    },
};