/**
 * Prepara la base de datos de desarrollo end-to-end:
 *   1. Asegura que la BD exista (la crea si falta).
 *   2. Sincroniza el schema desde los modelos Sequelize ({ force: true } por default → destructivo).
 *   3. Inserta datos de prueba coherentes en las 35 tablas, en el orden correcto de FKs.
 *
 * Uso:
 *   npm run db:setup           # crea schema vacío + carga datos
 *   npm run db:reset           # alias de db:setup (force destructivo)
 *   npm run db:seed            # solo carga datos sobre tablas ya creadas
 *
 * Variables de entorno reconocidas:
 *   SEED_FORCE=false  → no dropea/recrea tablas (útil cuando ya hay datos a preservar)
 *   SEED_ONLY=true    → omite el sync y solo inserta datos
 */
import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2/promise';
import { sequelize } from '../src/modules/index.js';
import Rol from '../src/modules/roles/model/Rol.js';
import Administrativo from '../src/modules/administrativos/model/Administrativo.js';
import Usuario from '../src/modules/usuarios/model/Usuario.js';
import Docente from '../src/modules/docentes/model/Docente.js';
import Estudiante from '../src/modules/estudiantes/model/Estudiante.js';
import Carrera from '../src/modules/carreras/model/Carrera.js';
import PlanEstudio from '../src/modules/planes_estudios/model/PlanEstudio.js';
import CicloLectivo from '../src/modules/ciclo-lectivos/model/CicloLectivo.js';
import UnidadCurricular from '../src/modules/unidades_curriculares/model/UnidadCurricular.js';
import Correlatividad from '../src/modules/correlatividad/model/Correlatividad.js';
import Curso from '../src/modules/cursos/model/Curso.js';
import Division from '../src/modules/division/model/Division.js';
import DivisionXUnidadCurricular from '../src/modules/divisionXUnidadCurricular/model/DivisionXUnidadCurricular.js';
import DesignacionesDocente from '../src/modules/designacionesDocente/model/DesignacionDocente.js';
import Legajo from '../src/modules/legajos/model/Legajo.js';
import Asistencia from '../src/modules/asistencia/model/Asistencia.js';
import EstudianteXUnidadCurricular from '../src/modules/estudiantesXUnidadCurricular/model/EstudianteXUnidadCurricular.js';
import CambioPlanEstudio from '../src/modules/cambioPlanEstudio/model/CambioPlanEstudio.js';
import InstanciaEvaluativa from '../src/modules/instanciasEvaluativas/model/InstanciaEvaluativa.js';
import LegajoXInstanciaEvaluativa from '../src/modules/legajosXInstanciasEvaluativas/model/LegajoXInstanciaEvaluativa.js';
import TurnoExamen from '../src/modules/turnos-examenes/model/TurnoExamen.js';
import MesaExamen from '../src/modules/mesasExamenes/model/MesaExamen.js';
import MesaExamenXLegajo from '../src/modules/mesaExamenXLegajo/model/MesaExamenXLegajo.js';
import EquivalenciaUnidadCurricular from '../src/modules/equivalenciaUnidadCurricular/model/EquivalenciaUnidadCurricular.js';
import MovimientoFinanciero from '../src/modules/movimientoFinanciero/model/movimientoFinanciero.js';
import ComprobanteAlumno from '../src/modules/comprobanteAlumno/model/ComprobanteAlumno.js';
import TipoDocumentoRequerido from '../src/modules/tipoDocumentoRequerido/model/TipoDocumentoRequerido.js';
import DocumentoLegajo from '../src/modules/documentoLegajo/model/DocumentoLegajo.js';
import DossierInstitucional from '../src/modules/dossierInstitucional/model/DossierInstitucional.js';
import Preinscripto from '../src/modules/preinscriptos/model/Preinscripto.js';
import InscripcionCarrera from '../src/modules/inscripcionCarrera/model/InscripcionCarrera.js';
import InformacionExtra from '../src/modules/informacionExtra/model/InformacionExtra.js';
import SesionUsuario from '../src/modules/sesiones/model/sesion-usuario.model.js';
import RecuperacionContrasenia from '../src/modules/recuperaciones/model/recuperacion-contrasenia.model.js';
import Notificacion from '../src/modules/notificaciones/model/notificacion.model.js';

const FORCE = process.env.SEED_FORCE !== 'false';
const SEED_ONLY = process.env.SEED_ONLY === 'true';

async function ensureDatabaseExists() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER_M,
    password: process.env.DB_PASSWORD,
  });
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
  await conn.end();
  console.log(`✓ BD '${process.env.DB_NAME}' lista.`);
}

async function syncSchema() {
  await sequelize.authenticate();
  await sequelize.sync({ force: FORCE });
  console.log(`✓ Schema sincronizado (force=${FORCE}).`);
}

async function seed() {
  console.log('→ Insertando datos de prueba...');

  //const [admin1, admin2] = await Promise.all([
    // los hooks de bcrypt corren porque usamos create (no bulkCreate)
  //]);

  // ─── Roles ────────────────────────────────────────────
  const roles = await Rol.bulkCreate([
    { nombre: 'ADMIN', descripcion: 'Administrador del sistema' },
    { nombre: 'DOCENTE', descripcion: 'Docente de la institución' },
    { nombre: 'ESTUDIANTE', descripcion: 'Alumno regular' },
    { nombre: 'RECTOR', descripcion: 'Rector de la institución' },
  ]);
  console.log(`  • ${roles.length} roles`);

  // ─── Administrativos (hooks bcrypt corren con create individual) ──
  const adminMaria = await Administrativo.create({
    nombre: 'María', apellido: 'Gómez', email: 'maria.gomez@instituto.edu',
    dni: '20123456', contrasenia: 'Admin1234!',
    telefono: '351-1111111', domicilio: 'Calle 1 N° 100', idRol: 1, activo: true,
  } as any);
  const adminCarlos = await Administrativo.create({
    nombre: 'Carlos', apellido: 'Pérez', email: 'carlos.perez@instituto.edu',
    dni: '20765432', contrasenia: 'Admin1234!',
    telefono: '351-2222222', domicilio: 'Av. Siempre Viva 742', idRol: 1, activo: true,
  } as any);
  console.log(`  • 2 administrativos`);

  // ─── Usuarios ─────────────────────────────────────────
  const usuarioJuan = await Usuario.create({
    nombre: 'Juan', apellido: 'López', email: 'juan.lopez@correo.com',
    contrasenia: 'Usuario1234!', idAdministrativo: adminMaria.id,
  } as any);
  const usuarioMarcela = await Usuario.create({
    nombre: 'Marcela', apellido: 'Ruiz', email: 'marcela.ruiz@correo.com',
    contrasenia: 'Usuario1234!', idAdministrativo: adminMaria.id,
  } as any);
  console.log(`  • 2 usuarios`);

  // ─── Docentes ─────────────────────────────────────────
  const docenteLucia = await Docente.create({
    nombre: 'Lucía', apellido: 'Martínez', email: 'lucia.martinez@instituto.edu',
    contrasenia: 'Docente1234!', dni: '28999888', titulo: 'Lic. en Sistemas',
    especialidad: 'Bases de datos', domicilio: 'Calle Falsa 100', telefono: '351-1234567',
    foto: null, idAdministrativo: adminMaria.id,
  } as any);
  const docenteRoberto = await Docente.create({
    nombre: 'Roberto', apellido: 'Suárez', email: 'roberto.suarez@instituto.edu',
    contrasenia: 'Docente1234!', dni: '27444555', titulo: 'Ing. en Informática',
    especialidad: 'Algoritmos', domicilio: 'Av. Test 200', telefono: '351-7654321',
    foto: null, idAdministrativo: adminMaria.id,
  } as any);
  console.log(`  • 2 docentes`);

  // ─── Estudiantes ──────────────────────────────────────
  const estudianteJuan = await Estudiante.create({
    dni: '45111222', nombre: 'Juan', apellido: 'López', email: 'juan.lopez@correo.com',
    telefono: '351-1112223', domicilio: 'Mendoza 100', fechaDeNacimiento: '2005-03-15',
    foto: null, trabaja: false, idUsuario: usuarioJuan.id, idAdministrativo: adminMaria.id,
  } as any);
  const estudianteMarcela = await Estudiante.create({
    dni: '45333444', nombre: 'Marcela', apellido: 'Ruiz', email: 'marcela.ruiz@correo.com',
    telefono: '351-3334445', domicilio: 'San Juan 200', fechaDeNacimiento: '2004-08-22',
    foto: null, trabaja: true, idUsuario: usuarioMarcela.id, idAdministrativo: adminMaria.id,
  } as any);
  console.log(`  • 2 estudiantes`);

  // ─── Carrera + Plan + Ciclo ───────────────────────────
  const carrera = await Carrera.create({
    codigo: 'TSP', nombre: 'Tecnicatura Superior en Programación', tipo: 'permanente',
    activo: true, imagen: null, descripcion: 'Carrera de 3 años con orientación en desarrollo',
    dossier: null, idAdministrativo: adminMaria.id,
  } as any);
  const planEstudio = await PlanEstudio.create({
    version: '2026.1', fechaDeAprobacion: '2026-01-15', fechaDeCierre: '2030-12-31',
    duracionEnAnios: 3, estado: 'vigente', idCarrera: carrera.id, idAdministrativo: adminMaria.id,
  } as any);
  const cicloLectivo = await CicloLectivo.create({
    anio: 2026, activo: true, fechaInicio: '2026-03-01', fechaFin: '2026-12-15',
    idPlanEstudio: planEstudio.id, idAdministrativo: adminMaria.id,
  } as any);
  console.log(`  • carrera, plan, ciclo lectivo`);

  // ─── Unidades curriculares ────────────────────────────
  const ucProg1 = await UnidadCurricular.create({
    idPlanEstudio: planEstudio.id, nombre: 'Programación I', duracion: 'cuatrimestral',
    cargaHoraria: 96, cuatrimestre: 'primero', idAdministrativo: adminMaria.id,
  } as any);
  const ucBD = await UnidadCurricular.create({
    idPlanEstudio: planEstudio.id, nombre: 'Bases de Datos', duracion: 'cuatrimestral',
    cargaHoraria: 96, cuatrimestre: 'segundo', idAdministrativo: adminMaria.id,
  } as any);
  console.log(`  • 2 unidades curriculares`);

  // ─── Correlatividades ─────────────────────────────────
  await Correlatividad.create({
    idPlan: planEstudio.id, idUnidadCurricular: ucBD.id,
    idUnidadCurricularCorrelativa: ucProg1.id, condicion: 'APROBADA',
  } as any);
  console.log(`  • 1 correlatividad`);

  // ─── Curso + División ─────────────────────────────────
  const curso = await Curso.create({
    cupoEstudiantes: 40, anioAcademico: 1, idCicloLectivo: cicloLectivo.id,
    idAdministrativo: adminMaria.id,
  } as any);
  const division = await Division.create({
    idDocente: docenteLucia.id, idCurso: curso.id, idAdministrativo: adminMaria.id,
  } as any);
  console.log(`  • 1 curso, 1 división`);

  // ─── Division x Unidad Curricular ─────────────────────
  const dxuc1 = await DivisionXUnidadCurricular.create({
    idDivision: division.id, idUnidadCurricular: ucProg1.id, idAdministrativo: adminMaria.id,
  } as any);
  const dxuc2 = await DivisionXUnidadCurricular.create({
    idDivision: division.id, idUnidadCurricular: ucBD.id, idAdministrativo: adminMaria.id,
  } as any);
  console.log(`  • 2 división x unidad curricular`);

  // ─── Designación docente ──────────────────────────────
  await DesignacionesDocente.create({
    idDocente: docenteLucia.id, idDivisionXUnidadCurricular: dxuc1.id,
    idCicloLectivo: cicloLectivo.id, idAdministrativo: adminMaria.id,
    turno: 'Mañana', aula: 'Lab 1', horario: 'Lunes 8-12', nroMAB: 'MAB-001',
    fechaAltaMAB: '2026-03-01', fechaVtoMAB: '2026-12-31',
  } as any);
  await DesignacionesDocente.create({
    idDocente: docenteRoberto.id, idDivisionXUnidadCurricular: dxuc2.id,
    idCicloLectivo: cicloLectivo.id, idAdministrativo: adminMaria.id,
    turno: 'Tarde', aula: 'Lab 2', horario: 'Martes 14-18', nroMAB: 'MAB-002',
    fechaAltaMAB: '2026-03-01', fechaVtoMAB: '2026-12-31',
  } as any);
  console.log(`  • 2 designaciones docentes`);

  // ─── Legajos ──────────────────────────────────────────
  const legajo1 = await Legajo.create({
    idEstudiante: estudianteJuan.id, numeroLegajo: 99001,
    idPlanEstudio: planEstudio.id, activo: true, idAdministrativo: adminMaria.id,
  } as any);
  const legajo2 = await Legajo.create({
    idEstudiante: estudianteMarcela.id, numeroLegajo: 99002,
    idPlanEstudio: planEstudio.id, activo: true, idAdministrativo: adminMaria.id,
  } as any);
  console.log(`  • 2 legajos`);

  // ─── Asistencias ──────────────────────────────────────
  await Asistencia.create({
    idDivisionXUnidadCurricular: dxuc1.id, fecha: '2026-04-01', presente: true,
    idLegajo: legajo1.id, idAdministrativo: adminMaria.id,
  } as any);
  await Asistencia.create({
    idDivisionXUnidadCurricular: dxuc1.id, fecha: '2026-04-01', presente: false,
    idLegajo: legajo2.id, idAdministrativo: adminMaria.id,
  } as any);
  console.log(`  • 2 asistencias`);

  // ─── Estudiantes x Unidad Curricular ──────────────────
  await EstudianteXUnidadCurricular.create({
    idDivisionXUnidadCurricular: dxuc1.id, idLegajo: legajo1.id,
    fechaDeInscripcion: '2026-03-01', condicion: 'regular', idAdministrativo: adminMaria.id,
  } as any);
  await EstudianteXUnidadCurricular.create({
    idDivisionXUnidadCurricular: dxuc1.id, idLegajo: legajo2.id,
    fechaDeInscripcion: '2026-03-01', condicion: 'regular', idAdministrativo: adminMaria.id,
  } as any);
  console.log(`  • 2 estudiantes x unidad curricular`);

  // ─── Cambio plan estudio ──────────────────────────────
  await CambioPlanEstudio.create({
    idLegajo: legajo1.id, idPlanEstudioOrigen: planEstudio.id,
    idPlanEstudioDestino: planEstudio.id, idUsuarioGestor: adminMaria.id,
    estado: 'PENDIENTE', idAdministrativo: adminMaria.id,
  } as any);
  console.log(`  • 1 cambio plan estudio`);

  // ─── Evaluación ───────────────────────────────────────
  const instancia = await InstanciaEvaluativa.create({
    idDivisionXUnidadCurricular: dxuc1.id, descripcion: 'Primer Parcial',
    fecha: '2026-06-20', tipo: 'parcial', idAdministrativo: adminMaria.id,
  } as any);
  await LegajoXInstanciaEvaluativa.create({
    idInstanciaEvaluativa: instancia.id, idLegajo: legajo1.id, nota: 8,
    fechaRegistro: '2026-05-20', idAdministrativo: adminMaria.id,
  } as any);
  await LegajoXInstanciaEvaluativa.create({
    idInstanciaEvaluativa: instancia.id, idLegajo: legajo2.id, nota: 6,
    fechaRegistro: '2026-05-20', idAdministrativo: adminMaria.id,
  } as any);
  console.log(`  • 1 instancia, 2 notas`);

  // ─── Mesa de examen ───────────────────────────────────
  const turno = await TurnoExamen.create({
    descripcion: 'Turno Julio 2026', fechaDesde: new Date('2026-07-01'),
    fechaHasta: new Date('2026-07-31'), idCicloLectivo: cicloLectivo.id,
    idAdministrativo: adminMaria.id,
  } as any);

  const mesa = await MesaExamen.create({
    idTurnoExamen: turno.id, idUnidadCurricular: ucProg1.id, fecha: '2026-07-10',
    hora: '09:00', idDocentePresidente: docenteLucia.id,
    idDocenteVocal1: docenteRoberto.id, idDocenteVocal2: docenteLucia.id,
    tipo: 'Regular', idAdministrativo: adminMaria.id,
  } as any);

  await MesaExamenXLegajo.create({
    idMesaExamen: mesa.id, idLegajo: legajo1.id, condicion: 'regular',
    fechaInscripcion: new Date('2026-07-01T10:00:00Z'),
    nota_oral: 0, nota_escrita: 0, nota_final: 0,
    fechaUltimaModificacion: new Date('2026-07-01T10:00:00Z'),
    resultado: 'ausente', // 💡 CORREGIDO: Volvemos a usar 'ausente' en minúscula para respetar el ENUM estricto de la base de datos
    idAdministrativo: adminMaria.id,
  } as any);
  console.log(`   • turno, mesa, inscripción a mesa`);

  // ─── Equivalencias ────────────────────────────────────
  await EquivalenciaUnidadCurricular.create({
    idPlanEstudioOrigen: planEstudio.id, idPlanEstudioDestino: planEstudio.id,
    idUnidadCurricularOrigen: ucProg1.id, idUnidadCurricularDestino: ucBD.id,
    tipoEquivalencia: 'PARCIAL', observaciones: 'Reconocimiento parcial',
    idAdministrativo: adminMaria.id,
  } as any);
  console.log(`  • 1 equivalencia`);

  // ─── Movimientos financieros + comprobantes ───────────
  const movimiento = await MovimientoFinanciero.create({
    idEstudiante: estudianteJuan.id, tipo: 'INGRESO', concepto: 'Pago cuota abril',
    monto: 25000, fecha: '2026-04-05', medioPago: 'Transferencia',
    descripcion: null, idAdministrativo: adminMaria.id,
  } as any);
  await ComprobanteAlumno.create({
    idMovimientoFinanciero: movimiento.id, urlComprobante: 'https://example.com/comprobante.pdf',
    concepto: 'Cuota abril', estado: 'VALIDADO', idAdministrativo: adminMaria.id,
  } as any);
  console.log(`  • 1 movimiento, 1 comprobante`);

  // ─── Documentos ───────────────────────────────────────
  const tipoDoc = await TipoDocumentoRequerido.create({
    idCarrera: carrera.id, nombreDocumento: 'DNI escaneado', obligatorio: true,
    esCritico: true, descripcion: 'Documento obligatorio para inscripción',
    diasVigencia: 365, idAdministrativo: adminMaria.id,
  } as any);
  await DocumentoLegajo.create({
    idLegajo: legajo1.id, idTipoDocumentoRequerido: tipoDoc.id,
    idUsuarioCarga: usuarioJuan.id, urlArchivo: 'https://example.com/doc.pdf',
    idAdministrativo: adminMaria.id,
  } as any);
  await DossierInstitucional.create({
    idCarrera: carrera.id, titulo: 'Reglamento de Promoción',
    seccion: 'Normativa Académica', contenido: 'Texto del reglamento...',
    urlArchivo: null, tipo: 'NORMATIVA', estado: true, idAdministrativo: adminMaria.id,
  } as any);
  console.log(`  • 1 tipo doc, 1 doc legajo, 1 dossier`);

  // ─── Admisión ─────────────────────────────────────────
  const inscripcion = await InscripcionCarrera.create({
    cupo: 50, fechaDesde: '2026-01-01', fechaHasta: '2026-02-28',
    idPlanEstudio: planEstudio.id, idAdministrativo: adminMaria.id,
  } as any);
  await Preinscripto.create({
    idInscripcionCarrera: inscripcion.id, idUsuario: usuarioJuan.id,
    fechaInscripcion: '2026-02-01', cus: 'CUS-001', isa: 'ISA-001', emmac: null,
    analitico: 'analitico.pdf', partidaNacimiento: 'partida.pdf', foto: 'foto.jpg',
    estado: 'pendiente', idAdministrativo: adminMaria.id,
  } as any);
  await InformacionExtra.create({
    titulo: 'Salida laboral', icono: 'briefcase',
    descripcion: 'Posibilidad de trabajo en desarrollo de software', idCarrera: carrera.id,
  } as any);
  console.log(`  • 1 inscripción, 1 preinscripto, 1 info extra`);

  // ─── Seguridad / Sesiones / Notificaciones ────────────
  await SesionUsuario.create({
    idUsuario: usuarioJuan.id, intentoFallido: 0, bloqueado: false,
  } as any);
  await RecuperacionContrasenia.create({
    idUsuario: usuarioJuan.id, fechaExpiracion: new Date(Date.now() + 24 * 3600 * 1000),
  } as any);
  await Notificacion.create({
    idEstudiante: estudianteJuan.id, titulo: 'Bienvenido al sistema',
    mensaje: 'Tu cuenta fue creada exitosamente', tipo: 'BIENVENIDA',
    entidadRelacionada: null, entidadId: null,
  } as any);
  console.log(`  • 1 sesión, 1 recuperación, 1 notificación`);

  console.log('✓ Seed completo.');
}

async function main() {
  try {
    await ensureDatabaseExists();
    if (!SEED_ONLY) {
      await syncSchema();
    }
    await seed();
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Credenciales de prueba para POST /auth/login:');
    console.log('  email: juan.lopez@correo.com  → contrasenia: usuario1234');
    console.log('  email: marcela.ruiz@correo.com → contrasenia: usuario1234');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en db-setup:', err);
    await sequelize.close();
    process.exit(1);
  }
}

main();
