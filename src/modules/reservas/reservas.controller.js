const reservasService = require("./reservas.service");

const listarReservas = async (req, res) => {
  try {
    const data = await reservasService.listarReservas();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al listar reservas",
      error: error.message
    });
  }
};

const obtenerReserva = async (req, res) => {
  try {
    const data = await reservasService.obtenerReserva(req.params.id);

    if (!data) {
      return res.status(404).json({
        mensaje: "Reserva no encontrada"
      });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener reserva",
      error: error.message
    });
  }
};

const crearReserva = async (req, res) => {
  try {
    const body = req.body || {};

    const {
      asignatura_reserva,
      fecha_reserva,
      hora_inicio_reserva,
      hora_fin_reserva,
      tipo_fidelidad_reserva,
      estado_actual_reserva,
      det_laboratorio,
      det_usuario
    } = body;

    if (
      !asignatura_reserva ||
      !fecha_reserva ||
      !hora_inicio_reserva ||
      !hora_fin_reserva ||
      !tipo_fidelidad_reserva ||
      !estado_actual_reserva ||
      !det_laboratorio ||
      !det_usuario
    ) {
      return res.status(400).json({
        mensaje: "Faltan datos obligatorios"
      });
    }

    if (hora_inicio_reserva >= hora_fin_reserva) {
      return res.status(400).json({
        mensaje: "La hora de inicio debe ser menor a la hora de término"
      });
    }

    const datosReserva = {
      ...body,
      documento_planificacion_reserva: req.file ? req.file.filename : null,
      nombre_original_documento_reserva: req.file ? req.file.originalname : null,
      fecha_subida_documento_reserva: req.file ? new Date() : null
    };

    const resultado = await reservasService.crearReserva(datosReserva);

    res.status(201).json({
      mensaje: "Reserva creada correctamente",
      id_reserva: resultado.insertId,
      archivo: req.file ? req.file.filename : null
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      mensaje:
        error.statusCode === 409
          ? "Conflicto de horario"
          : "Error al crear reserva",
      error: error.message
    });
  }
};

const actualizarReserva = async (req, res) => {
  try {
    const body = req.body || {};

    const {
      asignatura_reserva,
      fecha_reserva,
      hora_inicio_reserva,
      hora_fin_reserva,
      tipo_fidelidad_reserva,
      estado_actual_reserva,
      det_laboratorio,
      det_usuario
    } = body;

    if (
      !asignatura_reserva ||
      !fecha_reserva ||
      !hora_inicio_reserva ||
      !hora_fin_reserva ||
      !tipo_fidelidad_reserva ||
      !estado_actual_reserva ||
      !det_laboratorio ||
      !det_usuario
    ) {
      return res.status(400).json({
        mensaje: "Faltan datos obligatorios"
      });
    }

    if (hora_inicio_reserva >= hora_fin_reserva) {
      return res.status(400).json({
        mensaje: "La hora de inicio debe ser menor a la hora de término"
      });
    }

    const datosReserva = {
      ...body,
      documento_planificacion_reserva: req.file
        ? req.file.filename
        : body.documento_planificacion_reserva || null,
      nombre_original_documento_reserva: req.file
        ? req.file.originalname
        : body.nombre_original_documento_reserva || null,
      fecha_subida_documento_reserva: req.file
        ? new Date()
        : body.fecha_subida_documento_reserva || null
    };

    const resultado = await reservasService.actualizarReserva(
      req.params.id,
      datosReserva
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: "Reserva no encontrada"
      });
    }

    res.json({
      mensaje: "Reserva actualizada correctamente",
      archivo: req.file
        ? req.file.filename
        : datosReserva.documento_planificacion_reserva
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      mensaje:
        error.statusCode === 409
          ? "Conflicto de horario"
          : "Error al actualizar reserva",
      error: error.message
    });
  }
};

const cambiarEstadoReserva = async (req, res) => {
  try {
    const { estado_nuevo_reserva, observacion_historial_reserva } = req.body;

    if (!estado_nuevo_reserva) {
      return res.status(400).json({
        mensaje: "Debe indicar el nuevo estado de la reserva"
      });
    }

    const estadosPermitidos = ["pendiente", "aprobada", "rechazada", "cancelada"];

    if (!estadosPermitidos.includes(estado_nuevo_reserva)) {
      return res.status(400).json({
        mensaje: "Estado no permitido"
      });
    }

    const resultado = await reservasService.cambiarEstadoReserva(
      req.params.id,
      estado_nuevo_reserva,
      observacion_historial_reserva
    );

    if (resultado.reservaNoEncontrada) {
      return res.status(404).json({
        mensaje: "Reserva no encontrada"
      });
    }

    res.json({
      mensaje: "Estado de reserva actualizado correctamente",
      estado_anterior: resultado.estado_anterior,
      estado_nuevo: resultado.estado_nuevo
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al cambiar estado de reserva",
      error: error.message
    });
  }
};

const eliminarReserva = async (req, res) => {
  try {
    const resultado = await reservasService.eliminarReserva(req.params.id);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: "Reserva no encontrada"
      });
    }

    res.json({
      mensaje: "Reserva eliminada correctamente"
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar reserva",
      error: error.message
    });
  }
};

module.exports = {
  listarReservas,
  obtenerReserva,
  crearReserva,
  actualizarReserva,
  cambiarEstadoReserva,
  eliminarReserva
};