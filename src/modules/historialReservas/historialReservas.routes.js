const express = require("express");
const router = express.Router();

const historialReservasController = require("./historialReservas.controller");
const { verificarToken } = require("../../middlewares/auth.middleware");
const { autorizarPermisos } = require("../../middlewares/permiso.middleware");

router.get(
  "/:idReserva",
  verificarToken,
  autorizarPermisos("Administrador", "Auxiliar", "Docente"),
  historialReservasController.listarHistorialPorReserva
);

router.post(
  "/",
  verificarToken,
  autorizarPermisos("Administrador"),
  historialReservasController.crearHistorialReserva
);

module.exports = router;