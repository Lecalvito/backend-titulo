const express = require("express");
const router = express.Router();

const insumosController = require("./insumos.controller");
const { verificarToken } = require("../../middlewares/auth.middleware");
const { autorizarPermisos } = require("../../middlewares/permiso.middleware");

router.get(
  "/",
  verificarToken,
  autorizarPermisos("Administrador", "Auxiliar", "Docente"),
  insumosController.listarInsumos
);

router.get(
  "/:id",
  verificarToken,
  autorizarPermisos("Administrador", "Auxiliar", "Docente"),
  insumosController.obtenerInsumo
);

router.post(
  "/",
  verificarToken,
  autorizarPermisos("Administrador"),
  insumosController.crearInsumo
);

router.put(
  "/:id",
  verificarToken,
  autorizarPermisos("Administrador"),
  insumosController.actualizarInsumo
);

router.delete(
  "/:id",
  verificarToken,
  autorizarPermisos("Administrador"),
  insumosController.eliminarInsumo
);

module.exports = router;