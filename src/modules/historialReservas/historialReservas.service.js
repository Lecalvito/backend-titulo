const db = require("../../config/db");

const listarHistorialPorReserva = async (idReserva) => {
  const [rows] = await db.query(
    `SELECT *
    FROM historial_reserva
    WHERE det_reserva = ?
    ORDER BY fecha_cambio_historial_reserva DESC`,
    [idReserva]
  );

  return rows;
};

const crearHistorialReserva = async (data) => {
  const {
    det_reserva,
    estado_anterior_historial_reserva,
    estado_nuevo_historial_reserva,
    observacion_historial_reserva
  } = data;

  const [resultado] = await db.query(
    `INSERT INTO historial_reserva (
      det_reserva,
      fecha_cambio_historial_reserva,
      estado_anterior_historial_reserva,
      estado_nuevo_historial_reserva,
      observacion_historial_reserva
    ) VALUES (?, NOW(), ?, ?, ?)`,
    [
      det_reserva,
      estado_anterior_historial_reserva,
      estado_nuevo_historial_reserva,
      observacion_historial_reserva || null
    ]
  );

  return resultado;
};

module.exports = {
  listarHistorialPorReserva,
  crearHistorialReserva
};