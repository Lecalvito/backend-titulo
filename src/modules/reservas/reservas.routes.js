const express = require("express");
const router = express.Router();

const reservasController = require("./reservas.controller");
const uploadPlanificacion = require("../../middlewares/upload.middleware");
const { verificarToken } = require("../../middlewares/auth.middleware");
const { autorizarPermisos } = require("../../middlewares/permiso.middleware");

router.get(
  "/",
  verificarToken,
  autorizarPermisos("Administrador", "Auxiliar", "Docente"),
  reservasController.listarReservas
);

router.get(
  "/:id",
  verificarToken,
  autorizarPermisos("Administrador", "Auxiliar", "Docente"),
  reservasController.obtenerReserva
);

router.post(
  "/",
  verificarToken,
  autorizarPermisos("Docente", "Administrador"),
  uploadPlanificacion.single("documento_planificacion"),
  reservasController.crearReserva
);

router.put(
  "/:id",
  verificarToken,
  autorizarPermisos("Docente", "Administrador"),
  uploadPlanificacion.single("documento_planificacion"),
  reservasController.actualizarReserva
);

router.patch(
  "/:id/estado",
  verificarToken,
  autorizarPermisos("Administrador"),
  reservasController.cambiarEstadoReserva
);

router.delete(
  "/:id",
  verificarToken,
  autorizarPermisos("Administrador"),
  reservasController.eliminarReserva
);

module.exports = router;