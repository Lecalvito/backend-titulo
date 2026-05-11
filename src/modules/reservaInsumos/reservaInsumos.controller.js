const reservaInsumosService = require("./reservaInsumos.service");

const listarInsumosPorReserva = async (req, res) => {
  try {
    const { idReserva } = req.params;

    const data = await reservaInsumosService.listarInsumosPorReserva(idReserva);

    res.json(data);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al listar insumos de la reserva",
      error: error.message
    });
  }
};

const agregarInsumoAReserva = async (req, res) => {
  try {
    const {
      det_reserva,
      det_insumo,
      cantidad_solicitada_reserva_insumo
    } = req.body;

    if (!det_reserva || !det_insumo || !cantidad_solicitada_reserva_insumo) {
      return res.status(400).json({
        mensaje: "Faltan datos obligatorios"
      });
    }

    if (cantidad_solicitada_reserva_insumo <= 0) {
      return res.status(400).json({
        mensaje: "La cantidad solicitada debe ser mayor a cero"
      });
    }

    await reservaInsumosService.agregarInsumoAReserva(req.body);

    res.status(201).json({
      mensaje: "Insumo asociado correctamente a la reserva"
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      mensaje:
        error.statusCode === 409
          ? "El insumo ya está asociado a esta reserva"
          : "Error al asociar insumo a la reserva",
      error: error.message
    });
  }
};

const actualizarInsumoReserva = async (req, res) => {
  try {
    const {
      det_reserva,
      det_insumo,
      cantidad_solicitada_reserva_insumo
    } = req.body;

    if (!det_reserva || !det_insumo || !cantidad_solicitada_reserva_insumo) {
      return res.status(400).json({
        mensaje: "Faltan datos obligatorios"
      });
    }

    if (cantidad_solicitada_reserva_insumo <= 0) {
      return res.status(400).json({
        mensaje: "La cantidad solicitada debe ser mayor a cero"
      });
    }

    const resultado = await reservaInsumosService.actualizarInsumoReserva(req.body);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: "Relación reserva-insumo no encontrada"
      });
    }

    res.json({
      mensaje: "Insumo de la reserva actualizado correctamente"
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar insumo de la reserva",
      error: error.message
    });
  }
};

const eliminarInsumoDeReserva = async (req, res) => {
  try {
    const { det_reserva, det_insumo } = req.body;

    if (!det_reserva || !det_insumo) {
      return res.status(400).json({
        mensaje: "Faltan datos obligatorios"
      });
    }

    const resultado = await reservaInsumosService.eliminarInsumoDeReserva(
      det_reserva,
      det_insumo
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: "Relación reserva-insumo no encontrada"
      });
    }

    res.json({
      mensaje: "Insumo eliminado de la reserva correctamente"
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar insumo de la reserva",
      error: error.message
    });
  }
};

module.exports = {
  listarInsumosPorReserva,
  agregarInsumoAReserva,
  actualizarInsumoReserva,
  eliminarInsumoDeReserva
};