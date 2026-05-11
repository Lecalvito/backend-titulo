const usuariosService = require("./usuarios.service");

const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await usuariosService.listarUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al listar usuarios",
      error: error.message
    });
  }
};

const obtenerUsuario = async (req, res) => {
  try {
    const usuario = await usuariosService.obtenerUsuario(req.params.id);

    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado"
      });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener usuario",
      error: error.message
    });
  }
};

const crearUsuario = async (req, res) => {
  try {
    const {
      nombre_usuario,
      correo_usuario,
      password_usuario,
      estado_usuario,
      det_permiso
    } = req.body;

    if (
      !nombre_usuario ||
      !correo_usuario ||
      !password_usuario ||
      !estado_usuario ||
      !det_permiso
    ) {
      return res.status(400).json({
        mensaje: "Faltan datos obligatorios"
      });
    }

    const resultado = await usuariosService.crearUsuario(req.body);

    res.status(201).json({
      mensaje: "Usuario creado correctamente",
      id_usuario: resultado.insertId
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear usuario",
      error: error.message
    });
  }
};

const actualizarUsuario = async (req, res) => {
  try {
    const {
      nombre_usuario,
      correo_usuario,
      password_usuario,
      estado_usuario,
      det_permiso
    } = req.body;

    if (
      !nombre_usuario ||
      !correo_usuario ||
      !password_usuario ||
      !estado_usuario ||
      !det_permiso
    ) {
      return res.status(400).json({
        mensaje: "Faltan datos obligatorios"
      });
    }

    const resultado = await usuariosService.actualizarUsuario(
      req.params.id,
      req.body
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado"
      });
    }

    res.json({
      mensaje: "Usuario actualizado correctamente"
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar usuario",
      error: error.message
    });
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    const resultado = await usuariosService.eliminarUsuario(req.params.id);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado"
      });
    }

    res.json({
      mensaje: "Usuario eliminado correctamente"
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar usuario",
      error: error.message
    });
  }
};

module.exports = {
  listarUsuarios,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
};