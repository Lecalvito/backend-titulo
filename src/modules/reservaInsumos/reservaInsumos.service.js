const db = require("../../config/db");

const listarInsumosPorReserva = async (idReserva) => {
  const [rows] = await db.query(
    `SELECT
      ri.det_reserva,
      ri.det_insumo,
      i.nombre_insumo,
      i.descripcion_insumo,
      i.unidad_medida_insumo,
      i.stock_actual_insumo,
      ri.cantidad_solicitada_reserva_insumo,
      ri.observacion_reserva_insumo
    FROM reserva_insumo ri
    INNER JOIN insumo i ON ri.det_insumo = i.id_insumo
    WHERE ri.det_reserva = ?
    ORDER BY i.nombre_insumo ASC`,
    [idReserva]
  );

  return rows;
};

const existeRelacionReservaInsumo = async (det_reserva, det_insumo, conexion = db) => {
  const [rows] = await conexion.query(
    `SELECT det_reserva, det_insumo
    FROM reserva_insumo
    WHERE det_reserva = ?
      AND det_insumo = ?`,
    [det_reserva, det_insumo]
  );

  return rows.length > 0;
};

const obtenerInsumo = async (det_insumo, conexion = db) => {
  const [rows] = await conexion.query(
    `SELECT id_insumo, stock_actual_insumo
    FROM insumo
    WHERE id_insumo = ?`,
    [det_insumo]
  );

  return rows[0];
};

const agregarInsumoAReserva = async (data) => {
  const {
    det_reserva,
    det_insumo,
    cantidad_solicitada_reserva_insumo,
    observacion_reserva_insumo
  } = data;

  const conexion = await db.getConnection();

  try {
    await conexion.beginTransaction();

    const existeRelacion = await existeRelacionReservaInsumo(
      det_reserva,
      det_insumo,
      conexion
    );

    if (existeRelacion) {
      const error = new Error("El insumo ya está asociado a esta reserva");
      error.statusCode = 409;
      throw error;
    }

    const insumo = await obtenerInsumo(det_insumo, conexion);

    if (!insumo) {
      const error = new Error("Insumo no encontrado");
      error.statusCode = 404;
      throw error;
    }

    if (insumo.stock_actual_insumo < cantidad_solicitada_reserva_insumo) {
      const error = new Error("Stock insuficiente para asociar el insumo a la reserva");
      error.statusCode = 400;
      throw error;
    }

    const [resultado] = await conexion.query(
      `INSERT INTO reserva_insumo (
        det_reserva,
        det_insumo,
        cantidad_solicitada_reserva_insumo,
        observacion_reserva_insumo
      ) VALUES (?, ?, ?, ?)`,
      [
        det_reserva,
        det_insumo,
        cantidad_solicitada_reserva_insumo,
        observacion_reserva_insumo || null
      ]
    );

    await conexion.query(
      `UPDATE insumo
      SET stock_actual_insumo = stock_actual_insumo - ?
      WHERE id_insumo = ?`,
      [cantidad_solicitada_reserva_insumo, det_insumo]
    );

    await conexion.query(
      `INSERT INTO movimiento_stock (
        det_insumo,
        tipo_movimiento_stock,
        cantidad_movimiento_stock,
        fecha_movimiento_stock,
        motivo_movimiento_stock,
        referencia_movimiento_stock
      ) VALUES (?, ?, ?, NOW(), ?, ?)`,
      [
        det_insumo,
        "salida",
        cantidad_solicitada_reserva_insumo,
        "Insumo asociado a reserva",
        `Reserva ID ${det_reserva}`
      ]
    );

    await conexion.commit();

    return resultado;
  } catch (error) {
    await conexion.rollback();
    throw error;
  } finally {
    conexion.release();
  }
};

const actualizarInsumoReserva = async (data) => {
  const {
    det_reserva,
    det_insumo,
    cantidad_solicitada_reserva_insumo,
    observacion_reserva_insumo
  } = data;

  const [resultado] = await db.query(
    `UPDATE reserva_insumo SET
      cantidad_solicitada_reserva_insumo = ?,
      observacion_reserva_insumo = ?
    WHERE det_reserva = ?
      AND det_insumo = ?`,
    [
      cantidad_solicitada_reserva_insumo,
      observacion_reserva_insumo || null,
      det_reserva,
      det_insumo
    ]
  );

  return resultado;
};

const eliminarInsumoDeReserva = async (det_reserva, det_insumo) => {
  const [resultado] = await db.query(
    `DELETE FROM reserva_insumo
    WHERE det_reserva = ?
      AND det_insumo = ?`,
    [det_reserva, det_insumo]
  );

  return resultado;
};

module.exports = {
  listarInsumosPorReserva,
  agregarInsumoAReserva,
  actualizarInsumoReserva,
  eliminarInsumoDeReserva
};