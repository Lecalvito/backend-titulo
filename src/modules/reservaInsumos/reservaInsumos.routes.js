const express = require("express");
const router = express.Router();

const reservaInsumosController = require("./reservaInsumos.controller");
const { verificarToken } = require("../../middlewares/auth.middleware");
const { autorizarPermisos } = require("../../middlewares/permiso.middleware");

router.get(
  "/:idReserva",
  verificarToken,
  autorizarPermisos("Administrador", "Auxiliar", "Docente"),
  reservaInsumosController.listarInsumosPorReserva
);

router.post(
  "/",
  verificarToken,
  autorizarPermisos("Docente", "Administrador"),
  reservaInsumosController.agregarInsumoAReserva
);

router.put(
  "/",
  verificarToken,
  autorizarPermisos("Docente", "Administrador"),
  reservaInsumosController.actualizarInsumoReserva
);

router.delete(
  "/",
  verificarToken,
  autorizarPermisos("Docente", "Administrador"),
  reservaInsumosController.eliminarInsumoDeReserva
);

module.exports = router;