const express = require("express");
const router = express.Router();

const laboratoriosController = require("./laboratorios.controller");
const { verificarToken } = require("../../middlewares/auth.middleware");
const { autorizarPermisos } = require("../../middlewares/permiso.middleware");

router.get(
  "/",
  verificarToken,
  autorizarPermisos("Administrador", "Auxiliar", "Docente"),
  laboratoriosController.listarLaboratorios
);

router.get(
  "/:id",
  verificarToken,
  autorizarPermisos("Administrador", "Auxiliar", "Docente"),
  laboratoriosController.obtenerLaboratorio
);

router.post(
  "/",
  verificarToken,
  autorizarPermisos("Administrador"),
  laboratoriosController.crearLaboratorio
);

router.put(
  "/:id",
  verificarToken,
  autorizarPermisos("Administrador"),
  laboratoriosController.actualizarLaboratorio
);

router.delete(
  "/:id",
  verificarToken,
  autorizarPermisos("Administrador"),
  laboratoriosController.eliminarLaboratorio
);

module.exports = router;