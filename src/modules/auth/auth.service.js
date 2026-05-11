const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../../config/db");

const obtenerUsuarioPorCorreo = async (correo_usuario) => {
  const [rows] = await db.query(
    `SELECT
      u.id_usuario,
      u.nombre_usuario,
      u.correo_usuario,
      u.password_usuario,
      u.estado_usuario,
      u.det_permiso,
      p.nombre_permiso
    FROM usuario u
    INNER JOIN permiso p ON u.det_permiso = p.id_permiso
    WHERE u.correo_usuario = ?`,
    [correo_usuario]
  );

  return rows[0];
};

const validarPassword = async (passwordIngresada, passwordGuardada) => {
  if (!passwordGuardada) return false;

  const esHash = passwordGuardada.startsWith("$2a$") || passwordGuardada.startsWith("$2b$");

  if (esHash) {
    return bcrypt.compare(passwordIngresada, passwordGuardada);
  }

  return passwordIngresada === passwordGuardada;
};

const login = async (correo_usuario, password_usuario) => {
  const usuario = await obtenerUsuarioPorCorreo(correo_usuario);

  if (!usuario) {
    return null;
  }

  if (usuario.estado_usuario !== "activo") {
    return null;
  }

  const passwordValida = await validarPassword(
    password_usuario,
    usuario.password_usuario
  );

  if (!passwordValida) {
    return null;
  }

  const payload = {
    id_usuario: usuario.id_usuario,
    correo_usuario: usuario.correo_usuario,
    det_permiso: usuario.det_permiso,
    nombre_permiso: usuario.nombre_permiso
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "8h"
  });

  delete usuario.password_usuario;

  return {
    usuario,
    token
  };
};

module.exports = {
  login
};