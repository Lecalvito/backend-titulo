const db = require("../../config/db");

const listarUsuarios = async () => {
  const [rows] = await db.query(
    `SELECT
      u.id_usuario,
      u.nombre_usuario,
      u.correo_usuario,
      u.estado_usuario,
      u.det_permiso,
      p.nombre_permiso,
      p.descripcion_permiso
    FROM usuario u
    INNER JOIN permiso p ON u.det_permiso = p.id_permiso
    ORDER BY u.id_usuario DESC`
  );

  return rows;
};

const obtenerUsuario = async (id) => {
  const [rows] = await db.query(
    `SELECT
      u.id_usuario,
      u.nombre_usuario,
      u.correo_usuario,
      u.estado_usuario,
      u.det_permiso,
      p.nombre_permiso,
      p.descripcion_permiso
    FROM usuario u
    INNER JOIN permiso p ON u.det_permiso = p.id_permiso
    WHERE u.id_usuario = ?`,
    [id]
  );

  return rows[0];
};

const crearUsuario = async (data) => {
  const {
    nombre_usuario,
    correo_usuario,
    password_usuario,
    estado_usuario,
    det_permiso
  } = data;

  const [resultado] = await db.query(
    `INSERT INTO usuario (
      nombre_usuario,
      correo_usuario,
      password_usuario,
      estado_usuario,
      det_permiso
    ) VALUES (?, ?, ?, ?, ?)`,
    [
      nombre_usuario,
      correo_usuario,
      password_usuario,
      estado_usuario,
      det_permiso
    ]
  );

  return resultado;
};

const actualizarUsuario = async (id, data) => {
  const {
    nombre_usuario,
    correo_usuario,
    password_usuario,
    estado_usuario,
    det_permiso
  } = data;

  const [resultado] = await db.query(
    `UPDATE usuario SET
      nombre_usuario = ?,
      correo_usuario = ?,
      password_usuario = ?,
      estado_usuario = ?,
      det_permiso = ?
    WHERE id_usuario = ?`,
    [
      nombre_usuario,
      correo_usuario,
      password_usuario,
      estado_usuario,
      det_permiso,
      id
    ]
  );

  return resultado;
};

const eliminarUsuario = async (id) => {
  const [resultado] = await db.query(
    "DELETE FROM usuario WHERE id_usuario = ?",
    [id]
  );

  return resultado;
};

module.exports = {
  listarUsuarios,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
};