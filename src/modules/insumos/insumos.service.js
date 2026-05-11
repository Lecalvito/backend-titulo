const db = require("../../config/db");

const listarInsumos = async () => {
  const [rows] = await db.query("SELECT * FROM insumo ORDER BY id_insumo DESC");
  return rows;
};

const obtenerInsumo = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM insumo WHERE id_insumo = ?",
    [id]
  );

  return rows[0];
};

const crearInsumo = async (data) => {
  const {
    nombre_insumo,
    descripcion_insumo,
    unidad_medida_insumo,
    stock_actual_insumo,
    stock_minimo_insumo,
    estado_insumo
  } = data;

  const [resultado] = await db.query(
    `INSERT INTO insumo 
    (nombre_insumo, descripcion_insumo, unidad_medida_insumo, stock_actual_insumo, stock_minimo_insumo, estado_insumo)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [
      nombre_insumo,
      descripcion_insumo,
      unidad_medida_insumo,
      stock_actual_insumo,
      stock_minimo_insumo,
      estado_insumo
    ]
  );

  return resultado;
};

const actualizarInsumo = async (id, data) => {
  const {
    nombre_insumo,
    descripcion_insumo,
    unidad_medida_insumo,
    stock_actual_insumo,
    stock_minimo_insumo,
    estado_insumo
  } = data;

  const [resultado] = await db.query(
    `UPDATE insumo SET
    nombre_insumo = ?,
    descripcion_insumo = ?,
    unidad_medida_insumo = ?,
    stock_actual_insumo = ?,
    stock_minimo_insumo = ?,
    estado_insumo = ?
    WHERE id_insumo = ?`,
    [
      nombre_insumo,
      descripcion_insumo,
      unidad_medida_insumo,
      stock_actual_insumo,
      stock_minimo_insumo,
      estado_insumo,
      id
    ]
  );

  return resultado;
};

const eliminarInsumo = async (id) => {
  const [resultado] = await db.query(
    "DELETE FROM insumo WHERE id_insumo = ?",
    [id]
  );

  return resultado;
};

module.exports = {
  listarInsumos,
  obtenerInsumo,
  crearInsumo,
  actualizarInsumo,
  eliminarInsumo
};