const permisosService = require("./permisos.service");

const listarPermisos = async (req, res) => {
  try {
    const permisos = await permisosService.listarPermisos();
    res.json(permisos);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al listar permisos",
      error: error.message
    });
  }
};

const obtenerPermiso = async (req, res) => {
  try {
    const permiso = await permisosService.obtenerPermiso(req.params.id);

    if (!permiso) {
      return res.status(404).json({
        mensaje: "Permiso no encontrado"
      });
    }

    res.json(permiso);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener permiso",
      error: error.message
    });
  }
};

const crearPermiso = async (req, res) => {
  try {
    const { nombre_permiso, descripcion_permiso } = req.body;

    if (!nombre_permiso || !descripcion_permiso) {
      return res.status(400).json({
        mensaje: "Faltan datos obligatorios"
      });
    }

    const resultado = await permisosService.crearPermiso(req.body);

    res.status(201).json({
      mensaje: "Permiso creado correctamente",
      id_permiso: resultado.insertId
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear permiso",
      error: error.message
    });
  }
};

const actualizarPermiso = async (req, res) => {
  try {
    const { nombre_permiso, descripcion_permiso } = req.body;

    if (!nombre_permiso || !descripcion_permiso) {
      return res.status(400).json({
        mensaje: "Faltan datos obligatorios"
      });
    }

    const resultado = await permisosService.actualizarPermiso(
      req.params.id,
      req.body
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: "Permiso no encontrado"
      });
    }

    res.json({
      mensaje: "Permiso actualizado correctamente"
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar permiso",
      error: error.message
    });
  }
};

const eliminarPermiso = async (req, res) => {
  try {
    const resultado = await permisosService.eliminarPermiso(req.params.id);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: "Permiso no encontrado"
      });
    }

    res.json({
      mensaje: "Permiso eliminado correctamente"
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar permiso",
      error: error.message
    });
  }
};

module.exports = {
  listarPermisos,
  obtenerPermiso,
  crearPermiso,
  actualizarPermiso,
  eliminarPermiso
};