const db = require("../../config/db");

const listarLaboratorios = async () => {
  const [rows] = await db.query("SELECT * FROM laboratorio ORDER BY id_laboratorio DESC");
  return rows;
};

const obtenerLaboratorio = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM laboratorio WHERE id_laboratorio = ?",
    [id]
  );

  return rows[0];
};

const crearLaboratorio = async (data) => {
  const {
    nombre_laboratorio,
    ubicacion_laboratorio,
    capacidad_laboratorio,
    estado_laboratorio
  } = data;

  const [resultado] = await db.query(
    `INSERT INTO laboratorio 
    (nombre_laboratorio, ubicacion_laboratorio, capacidad_laboratorio, estado_laboratorio)
    VALUES (?, ?, ?, ?)`,
    [
      nombre_laboratorio,
      ubicacion_laboratorio,
      capacidad_laboratorio,
      estado_laboratorio
    ]
  );

  return resultado;
};

const actualizarLaboratorio = async (id, data) => {
  const {
    nombre_laboratorio,
    ubicacion_laboratorio,
    capacidad_laboratorio,
    estado_laboratorio
  } = data;

  const [resultado] = await db.query(
    `UPDATE laboratorio SET
    nombre_laboratorio = ?,
    ubicacion_laboratorio = ?,
    capacidad_laboratorio = ?,
    estado_laboratorio = ?
    WHERE id_laboratorio = ?`,
    [
      nombre_laboratorio,
      ubicacion_laboratorio,
      capacidad_laboratorio,
      estado_laboratorio,
      id
    ]
  );

  return resultado;
};

const eliminarLaboratorio = async (id) => {
  const [resultado] = await db.query(
    "DELETE FROM laboratorio WHERE id_laboratorio = ?",
    [id]
  );

  return resultado;
};

module.exports = {
  listarLaboratorios,
  obtenerLaboratorio,
  crearLaboratorio,
  actualizarLaboratorio,
  eliminarLaboratorio
};