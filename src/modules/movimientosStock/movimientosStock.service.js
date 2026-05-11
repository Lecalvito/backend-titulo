const db = require("../../config/db");

const listarMovimientosStock = async () => {
  const [rows] = await db.query(`
    SELECT 
      ms.*,
      i.nombre_insumo
    FROM movimiento_stock ms
    INNER JOIN insumo i ON ms.det_insumo = i.id_insumo
    ORDER BY ms.id_movimiento_stock DESC
  `);

  return rows;
};

const obtenerMovimientoStock = async (id) => {
  const [rows] = await db.query(
    `SELECT 
      ms.*,
      i.nombre_insumo
    FROM movimiento_stock ms
    INNER JOIN insumo i ON ms.det_insumo = i.id_insumo
    WHERE ms.id_movimiento_stock = ?`,
    [id]
  );

  return rows[0];
};

const crearMovimientoStock = async (data) => {
  const {
    det_insumo,
    tipo_movimiento_stock,
    cantidad_movimiento_stock,
    motivo_movimiento_stock,
    referencia_movimiento_stock
  } = data;

  const [resultado] = await db.query(
    `INSERT INTO movimiento_stock (
      det_insumo,
      tipo_movimiento_stock,
      cantidad_movimiento_stock,
      fecha_movimiento_stock,
      motivo_movimiento_stock,
      referencia_movimiento_stock
    ) VALUES (?, ?, ?, NOW(), ?, ?)`,
    [
      det_insumo,
      tipo_movimiento_stock,
      cantidad_movimiento_stock,
      motivo_movimiento_stock,
      referencia_movimiento_stock || null
    ]
  );

  return resultado;
};

module.exports = {
  listarMovimientosStock,
  obtenerMovimientoStock,
  crearMovimientoStock
};