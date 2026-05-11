const express = require("express");
const router = express.Router();

const usuariosController = require("./usuarios.controller");
const { verificarToken } = require("../../middlewares/auth.middleware");
const { autorizarPermisos } = require("../../middlewares/permiso.middleware");

router.get(
  "/",
  verificarToken,
  autorizarPermisos("Administrador"),
  usuariosController.listarUsuarios
);

router.get(
  "/:id",
  verificarToken,
  autorizarPermisos("Administrador"),
  usuariosController.obtenerUsuario
);

router.post(
  "/",
  verificarToken,
  autorizarPermisos("Administrador"),
  usuariosController.crearUsuario
);

router.put(
  "/:id",
  verificarToken,
  autorizarPermisos("Administrador"),
  usuariosController.actualizarUsuario
);

router.delete(
  "/:id",
  verificarToken,
  autorizarPermisos("Administrador"),
  usuariosController.eliminarUsuario
);

module.exports = router;