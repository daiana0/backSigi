import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import sequelize from "../../../config/database/conexion.js";

interface PreinscriptoAttributes extends InferAttributes<Preinscripto> {
  id: number;
  idInscripcionCarrera: number;
  idUsuario: number;
  fechaInscripcion: string;
  cus: string;
  isa: string;
  emmac: string | null;
  analitico: string;
  partidaNacimiento: string;
  foto: string;
  estado: "pendiente" | "aprobado" | "rechazado";
  idAdministrativo: number;
}
interface PreinscriptoCreationAttributes extends InferCreationAttributes<Preinscripto> {
  idInscripcionCarrera: number;
  idUsuario: number;
  fechaInscripcion: string;
  cus: string;
  isa: string;
  emmac: string | null;
  analitico: string;
  partidaNacimiento: string;
  foto: string;
  idAdministrativo: number;
}

class Preinscripto extends Model<PreinscriptoAttributes, PreinscriptoCreationAttributes> {
  declare id: CreationOptional<number>;
  declare idInscripcionCarrera: number;
  declare idUsuario: number;
  declare fechaInscripcion: string;
  declare cus: string;
  declare isa: string;
  declare emmac: string | null;
  declare analitico: string;
  declare partidaNacimiento: string;
  declare foto: string;
  declare estado: CreationOptional<"pendiente" | "aprobado" | "rechazado">;
  declare idAdministrativo: number;
}

Preinscripto.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    idInscripcionCarrera: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_inscripcion",
      references: {
        model: "inscripciones_carreras",
        key: "id"
      }
    },
    idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_usuario",
      references: { model: "usuarios", key: "id" }
    },
    fechaInscripcion: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    cus: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isa: {
      type: DataTypes.STRING,
      allowNull: false
    },
    emmac: {
      type: DataTypes.STRING,
      allowNull: true
    },
    analitico: {
      type: DataTypes.STRING,
      allowNull: false
    },
    partidaNacimiento: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "partida_nacimiento"
    },
    foto: {
      type: DataTypes.STRING,
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM("pendiente", "aprobado", "rechazado"),
      defaultValue: "pendiente"
    },
    idAdministrativo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_administrativo",
      references: {
        model: "administrativos",
        key: "id"
      }
    }
  },
  {
    sequelize,
    tableName: "preinscriptos",
    timestamps: true,
    indexes: [
      { fields: ["id_inscripcion"] },
      { fields: ["id_usuario"] },
      { fields: ["estado"] },
      { fields: ["id_administrativo"] },
    ]
  }
)

export default Preinscripto;