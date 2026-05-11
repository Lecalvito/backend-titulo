const historialReservasService = require("./historialReservas.service");

const listarHistorialPorReserva = async (req, res) => {
  try {
    const { idReserva } = req.params;

    const data = await historialReservasService.listarHistorialPorReserva(idReserva);

    res.json(data);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al listar historial de reserva",
      error: error.message
    });
  }
};

const crearHistorialReserva = async (req, res) => {
  try {
    const {
      det_reserva,
      estado_anterior_historial_reserva,
      estado_nuevo_historial_reserva,
      observacion_historial_reserva
    } = req.body;

    if (
      !det_reserva ||
      !estado_anterior_historial_reserva ||
      !estado_nuevo_historial_reserva
    ) {
      return res.status(400).json({
        mensaje: "Faltan datos obligatorios"
      });
    }

    const resultado = await historialReservasService.crearHistorialReserva(req.body);

    res.status(201).json({
      mensaje: "Historial registrado correctamente",
      id_historial_reserva: resultado.insertId
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al registrar historial",
      error: error.message
    });
  }
};

module.exports = {
  listarHistorialPorReserva,
  crearHistorialReserva
};