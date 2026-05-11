const movimientosStockService = require("./movimientosStock.service");

const listarMovimientosStock = async (req, res) => {
  try {
    const data = await movimientosStockService.listarMovimientosStock();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al listar movimientos de stock",
      error: error.message
    });
  }
};

const obtenerMovimientoStock = async (req, res) => {
  try {
    const data = await movimientosStockService.obtenerMovimientoStock(req.params.id);

    if (!data) {
      return res.status(404).json({
        mensaje: "Movimiento de stock no encontrado"
      });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener movimiento de stock",
      error: error.message
    });
  }
};

const crearMovimientoStock = async (req, res) => {
  try {
    const {
      det_insumo,
      tipo_movimiento_stock,
      cantidad_movimiento_stock,
      motivo_movimiento_stock
    } = req.body;

    if (
      !det_insumo ||
      !tipo_movimiento_stock ||
      !cantidad_movimiento_stock ||
      !motivo_movimiento_stock
    ) {
      return res.status(400).json({
        mensaje: "Faltan datos obligatorios"
      });
    }

    if (cantidad_movimiento_stock <= 0) {
      return res.status(400).json({
        mensaje: "La cantidad debe ser mayor a cero"
      });
    }

    const resultado = await movimientosStockService.crearMovimientoStock(req.body);

    res.status(201).json({
      mensaje: "Movimiento de stock registrado correctamente",
      id_movimiento_stock: resultado.insertId
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      mensaje: "Error al registrar movimiento de stock",
      error: error.message
    });
  }
};

module.exports = {
  listarMovimientosStock,
  obtenerMovimientoStock,
  crearMovimientoStock
};