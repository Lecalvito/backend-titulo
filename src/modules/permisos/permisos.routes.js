const express = require("express");
const router = express.Router();

const permisosController = require("./permisos.controller");
const { verificarToken } = require("../../middlewares/auth.middleware");
const { autorizarPermisos } = require("../../middlewares/permiso.middleware");

router.get(
  "/",
  verificarToken,
  autorizarPermisos("Administrador"),
  permisosController.listarPermisos
);

router.get(
  "/:id",
  verificarToken,
  autorizarPermisos("Administrador"),
  permisosController.obtenerPermiso
);

router.post(
  "/",
  verificarToken,
  autorizarPermisos("Administrador"),
  permisosController.crearPermiso
);

router.put(
  "/:id",
  verificarToken,
  autorizarPermisos("Administrador"),
  permisosController.actualizarPermiso
);

router.delete(
  "/:id",
  verificarToken,
  autorizarPermisos("Administrador"),
  permisosController.eliminarPermiso
);

module.exports = router;