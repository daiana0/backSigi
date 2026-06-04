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

  // 💡 NUEVO: Retorna la estructura formateada de asistencias que requiere tu pantalla de React
  async getByEstudiante(idEstudiante: number) {
    try {
      // Nota para el equipo: En el futuro acá se hará la consulta real usando Sequelize filtrando por idEstudiante
      // const asistenciasBD = await Asistencia.findAll({ where: { estudianteId: idEstudiante } });

      // Estructura Mock idéntica al DTO del frontend para garantizar compatibilidad total
      return {
        asistenciaGeneral: 85,
        resumenMaterias: [
          { id: 1, materia: 'Programación I', division: '2º A', presentes: 18, ausentes: 2, porcentaje: 90, estado: 'Regular' },
          { id: 2, materia: 'Matemática', division: '2º A', presentes: 11, ausentes: 6, porcentaje: 64, estado: 'En riesgo' },
          { id: 3, materia: 'Inglés Técnico', division: '2º A', presentes: 15, ausentes: 2, porcentaje: 88, estado: 'Regular' },
          { id: 4, materia: 'Base de Datos', division: '2º A', presentes: 20, ausentes: 1, porcentaje: 95, estado: 'Regular' }
        ],
        detalles: [
          { id: 101, fecha: '24 May, 2026', materia: 'Programación I', division: '2º A', estado: 'Presente', registro: 'Prof. Martínez' },
          { id: 102, fecha: '23 May, 2026', materia: 'Matemática', division: '2º A', estado: 'Ausente', registro: 'Prof. García' },
          { id: 103, fecha: '22 May, 2026', materia: 'Base de Datos', division: '2º A', estado: 'Presente', registro: 'Prof. Soria' }
        ]
      };
    } catch (error) {
      throw error;
    }
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