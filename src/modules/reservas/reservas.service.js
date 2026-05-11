const db = require("../../config/db");

const listarReservas = async () => {
  const [rows] = await db.query(`
    SELECT 
      r.*,
      l.nombre_laboratorio,
      u.nombre_usuario
    FROM reserva r
    INNER JOIN laboratorio l ON r.det_laboratorio = l.id_laboratorio
    INNER JOIN usuario u ON r.det_usuario = u.id_usuario
    ORDER BY r.id_reserva DESC
  `);

  return rows;
};

const obtenerReserva = async (id) => {
  const [rows] = await db.query(
    `SELECT 
      r.*,
      l.nombre_laboratorio,
      u.nombre_usuario
    FROM reserva r
    INNER JOIN laboratorio l ON r.det_laboratorio = l.id_laboratorio
    INNER JOIN usuario u ON r.det_usuario = u.id_usuario
    WHERE r.id_reserva = ?`,
    [id]
  );

  return rows[0];
};

const existeConflictoHorario = async ({
  det_laboratorio,
  fecha_reserva,
  hora_inicio_reserva,
  hora_fin_reserva,
  id_reserva = null
}) => {
  let query = `
    SELECT id_reserva
    FROM reserva
    WHERE det_laboratorio = ?
      AND fecha_reserva = ?
      AND estado_actual_reserva NOT IN ('rechazada', 'cancelada')
      AND hora_inicio_reserva < ?
      AND hora_fin_reserva > ?
  `;

  const params = [
    det_laboratorio,
    fecha_reserva,
    hora_fin_reserva,
    hora_inicio_reserva
  ];

  if (id_reserva) {
    query += " AND id_reserva <> ?";
    params.push(id_reserva);
  }

  const [rows] = await db.query(query, params);

  return rows.length > 0;
};

const crearReserva = async (data) => {
  const {
    asignatura_reserva,
    seccion_reserva,
    fecha_reserva,
    hora_inicio_reserva,
    hora_fin_reserva,
    tipo_fidelidad_reserva,
    estado_actual_reserva,
    documento_planificacion_reserva,
    nombre_original_documento_reserva,
    fecha_subida_documento_reserva,
    det_laboratorio,
    det_usuario
  } = data;

  const conflicto = await existeConflictoHorario({
    det_laboratorio,
    fecha_reserva,
    hora_inicio_reserva,
    hora_fin_reserva
  });

  if (conflicto) {
    const error = new Error(
      "Ya existe una reserva para este laboratorio en el horario seleccionado"
    );
    error.statusCode = 409;
    throw error;
  }

  const [result] = await db.query(
    `INSERT INTO reserva (
      asignatura_reserva,
      seccion_reserva,
      fecha_reserva,
      hora_inicio_reserva,
      hora_fin_reserva,
      tipo_fidelidad_reserva,
      estado_actual_reserva,
      documento_planificacion_reserva,
      nombre_original_documento_reserva,
      fecha_subida_documento_reserva,
      det_laboratorio,
      det_usuario
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      asignatura_reserva,
      seccion_reserva || null,
      fecha_reserva,
      hora_inicio_reserva,
      hora_fin_reserva,
      tipo_fidelidad_reserva,
      estado_actual_reserva,
      documento_planificacion_reserva || null,
      nombre_original_documento_reserva || null,
      fecha_subida_documento_reserva || null,
      det_laboratorio,
      det_usuario
    ]
  );

  return result;
};

const actualizarReserva = async (id, data) => {
  const {
    asignatura_reserva,
    seccion_reserva,
    fecha_reserva,
    hora_inicio_reserva,
    hora_fin_reserva,
    tipo_fidelidad_reserva,
    estado_actual_reserva,
    documento_planificacion_reserva,
    nombre_original_documento_reserva,
    fecha_subida_documento_reserva,
    det_laboratorio,
    det_usuario
  } = data;

  const conflicto = await existeConflictoHorario({
    det_laboratorio,
    fecha_reserva,
    hora_inicio_reserva,
    hora_fin_reserva,
    id_reserva: id
  });

  if (conflicto) {
    const error = new Error(
      "Ya existe una reserva para este laboratorio en el horario seleccionado"
    );
    error.statusCode = 409;
    throw error;
  }

  const [result] = await db.query(
    `UPDATE reserva SET
      asignatura_reserva = ?,
      seccion_reserva = ?,
      fecha_reserva = ?,
      hora_inicio_reserva = ?,
      hora_fin_reserva = ?,
      tipo_fidelidad_reserva = ?,
      estado_actual_reserva = ?,
      documento_planificacion_reserva = ?,
      nombre_original_documento_reserva = ?,
      fecha_subida_documento_reserva = ?,
      det_laboratorio = ?,
      det_usuario = ?
    WHERE id_reserva = ?`,
    [
      asignatura_reserva,
      seccion_reserva || null,
      fecha_reserva,
      hora_inicio_reserva,
      hora_fin_reserva,
      tipo_fidelidad_reserva,
      estado_actual_reserva,
      documento_planificacion_reserva || null,
      nombre_original_documento_reserva || null,
      fecha_subida_documento_reserva || null,
      det_laboratorio,
      det_usuario,
      id
    ]
  );

  return result;
};

const cambiarEstadoReserva = async (idReserva, estadoNuevo, observacion) => {
  const conexion = await db.getConnection();

  try {
    await conexion.beginTransaction();

    const [reservas] = await conexion.query(
      `SELECT id_reserva, estado_actual_reserva
      FROM reserva
      WHERE id_reserva = ?`,
      [idReserva]
    );

    if (reservas.length === 0) {
      await conexion.rollback();
      return { reservaNoEncontrada: true };
    }

    const estadoAnterior = reservas[0].estado_actual_reserva;

    await conexion.query(
      `UPDATE reserva
      SET estado_actual_reserva = ?
      WHERE id_reserva = ?`,
      [estadoNuevo, idReserva]
    );

    await conexion.query(
      `INSERT INTO historial_reserva (
        det_reserva,
        fecha_cambio_historial_reserva,
        estado_anterior_historial_reserva,
        estado_nuevo_historial_reserva,
        observacion_historial_reserva
      ) VALUES (?, NOW(), ?, ?, ?)`,
      [
        idReserva,
        estadoAnterior,
        estadoNuevo,
        observacion || null
      ]
    );

    await conexion.commit();

    return {
      estado_anterior: estadoAnterior,
      estado_nuevo: estadoNuevo
    };
  } catch (error) {
    await conexion.rollback();
    throw error;
  } finally {
    conexion.release();
  }
};

const eliminarReserva = async (id) => {
  const [result] = await db.query(
    "DELETE FROM reserva WHERE id_reserva = ?",
    [id]
  );

  return result;
};

module.exports = {
  listarReservas,
  obtenerReserva,
  crearReserva,
  actualizarReserva,
  cambiarEstadoReserva,
  eliminarReserva
};