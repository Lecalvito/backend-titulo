const authService = require("./auth.service");

const login = async (req, res) => {
  try {
    const { correo_usuario, password_usuario } = req.body;

    if (!correo_usuario || !password_usuario) {
      return res.status(400).json({
        mensaje: "Correo y contraseña son obligatorios"
      });
    }

    const resultado = await authService.login(correo_usuario, password_usuario);

    if (!resultado) {
      return res.status(401).json({
        mensaje: "Credenciales inválidas"
      });
    }

    res.json({
      mensaje: "Login correcto",
      usuario: resultado.usuario,
      token: resultado.token
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al iniciar sesión",
      error: error.message
    });
  }
};

module.exports = {
  login
};