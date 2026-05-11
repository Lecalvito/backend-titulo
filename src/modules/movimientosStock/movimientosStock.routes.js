const express = require("express");
const router = express.Router();

const movimientosStockController = require("./movimientosStock.controller");
const { verificarToken } = require("../../middlewares/auth.middleware");
const { autorizarPermisos } = require("../../middlewares/permiso.middleware");

router.get(
  "/",
  verificarToken,
  autorizarPermisos("Administrador", "Auxiliar"),
  movimientosStockController.listarMovimientosStock
);

router.get(
  "/:id",
  verificarToken,
  autorizarPermisos("Administrador", "Auxiliar"),
  movimientosStockController.obtenerMovimientoStock
);

router.post(
  "/",
  verificarToken,
  autorizarPermisos("Administrador"),
  movimientosStockController.crearMovimientoStock
);

module.exports = router;