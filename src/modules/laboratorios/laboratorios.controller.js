const laboratoriosService = require("./laboratorios.service");

const listarLaboratorios = async (req, res) => {
  try {
    const laboratorios = await laboratoriosService.listarLaboratorios();
    res.json(laboratorios);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar laboratorios", error: error.message });
  }
};

const obtenerLaboratorio = async (req, res) => {
  try {
    const laboratorio = await laboratoriosService.obtenerLaboratorio(req.params.id);

    if (!laboratorio) {
      return res.status(404).json({ mensaje: "Laboratorio no encontrado" });
    }

    res.json(laboratorio);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener laboratorio", error: error.message });
  }
};

const crearLaboratorio = async (req, res) => {
  try {
    const resultado = await laboratoriosService.crearLaboratorio(req.body);
    res.status(201).json({
      mensaje: "Laboratorio creado correctamente",
      id_laboratorio: resultado.insertId
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear laboratorio", error: error.message });
  }
};

const actualizarLaboratorio = async (req, res) => {
  try {
    const resultado = await laboratoriosService.actualizarLaboratorio(req.params.id, req.body);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Laboratorio no encontrado" });
    }

    res.json({ mensaje: "Laboratorio actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar laboratorio", error: error.message });
  }
};

const eliminarLaboratorio = async (req, res) => {
  try {
    const resultado = await laboratoriosService.eliminarLaboratorio(req.params.id);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Laboratorio no encontrado" });
    }

    res.json({ mensaje: "Laboratorio eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar laboratorio", error: error.message });
  }
};

module.exports = {
  listarLaboratorios,
  obtenerLaboratorio,
  crearLaboratorio,
  actualizarLaboratorio,
  eliminarLaboratorio
};