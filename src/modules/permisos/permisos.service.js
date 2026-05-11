const db = require("../../config/db");

const listarPermisos = async () => {
  const [rows] = await db.query(
    "SELECT * FROM permiso ORDER BY id_permiso ASC"
  );

  return rows;
};

const obtenerPermiso = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM permiso WHERE id_permiso = ?",
    [id]
  );

  return rows[0];
};

const crearPermiso = async (data) => {
  const { nombre_permiso, descripcion_permiso } = data;

  const [resultado] = await db.query(
    `INSERT INTO permiso (
      nombre_permiso,
      descripcion_permiso
    ) VALUES (?, ?)`,
    [nombre_permiso, descripcion_permiso]
  );

  return resultado;
};

const actualizarPermiso = async (id, data) => {
  const { nombre_permiso, descripcion_permiso } = data;

  const [resultado] = await db.query(
    `UPDATE permiso SET
      nombre_permiso = ?,
      descripcion_permiso = ?
    WHERE id_permiso = ?`,
    [nombre_permiso, descripcion_permiso, id]
  );

  return resultado;
};

const eliminarPermiso = async (id) => {
  const [resultado] = await db.query(
    "DELETE FROM permiso WHERE id_permiso = ?",
    [id]
  );

  return resultado;
};

module.exports = {
  listarPermisos,
  obtenerPermiso,
  crearPermiso,
  actualizarPermiso,
  eliminarPermiso
};