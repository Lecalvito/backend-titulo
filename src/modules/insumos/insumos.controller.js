const insumosService = require("./insumos.service");

const listarInsumos = async (req, res) => {
  try {
    const insumos = await insumosService.listarInsumos();
    res.json(insumos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar insumos", error: error.message });
  }
};

const obtenerInsumo = async (req, res) => {
  try {
    const insumo = await insumosService.obtenerInsumo(req.params.id);

    if (!insumo) {
      return res.status(404).json({ mensaje: "Insumo no encontrado" });
    }

    res.json(insumo);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener insumo", error: error.message });
  }
};

const crearInsumo = async (req, res) => {
  try {
    const resultado = await insumosService.crearInsumo(req.body);
    res.status(201).json({
      mensaje: "Insumo creado correctamente",
      id_insumo: resultado.insertId
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear insumo", error: error.message });
  }
};

const actualizarInsumo = async (req, res) => {
  try {
    const resultado = await insumosService.actualizarInsumo(req.params.id, req.body);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Insumo no encontrado" });
    }

    res.json({ mensaje: "Insumo actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar insumo", error: error.message });
  }
};

const eliminarInsumo = async (req, res) => {
  try {
    const resultado = await insumosService.eliminarInsumo(req.params.id);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Insumo no encontrado" });
    }

    res.json({ mensaje: "Insumo eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar insumo", error: error.message });
  }
};

module.exports = {
  listarInsumos,
  obtenerInsumo,
  crearInsumo,
  actualizarInsumo,
  eliminarInsumo
};