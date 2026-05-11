const autorizarPermisos = (...permisosPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        mensaje: "Usuario no autenticado"
      });
    }

    const permisoUsuario = req.usuario.nombre_permiso;

    if (!permisosPermitidos.includes(permisoUsuario)) {
      return res.status(403).json({
        mensaje: "No tiene permiso para realizar esta acción"
      });
    }

    next();
  };
};

module.exports = {
  autorizarPermisos
};