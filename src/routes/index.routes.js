const express = require("express");
const router = express.Router();

const authRoutes = require("../modules/auth/auth.routes");
const laboratoriosRoutes = require("../modules/laboratorios/laboratorios.routes");
const insumosRoutes = require("../modules/insumos/insumos.routes");
const permisosRoutes = require("../modules/permisos/permisos.routes");
const usuariosRoutes = require("../modules/usuarios/usuarios.routes");
const reservasRoutes = require("../modules/reservas/reservas.routes");
const reservaInsumosRoutes = require("../modules/reservaInsumos/reservaInsumos.routes");
const movimientosStockRoutes = require("../modules/movimientosStock/movimientosStock.routes");
const historialReservasRoutes = require("../modules/historialReservas/historialReservas.routes");

router.use("/auth", authRoutes);
router.use("/laboratorios", laboratoriosRoutes);
router.use("/insumos", insumosRoutes);
router.use("/permisos", permisosRoutes);
router.use("/usuarios", usuariosRoutes);
router.use("/reservas", reservasRoutes);
router.use("/reserva-insumos", reservaInsumosRoutes);
router.use("/movimientos-stock", movimientosStockRoutes);
router.use("/historial-reservas", historialReservasRoutes);

module.exports = router;