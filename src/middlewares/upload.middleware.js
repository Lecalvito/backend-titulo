const multer = require("multer");
const path = require("path");

const almacenamiento = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "cargas/planificaciones");
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const nombreArchivo = `planificacion_${Date.now()}${extension}`;
    cb(null, nombreArchivo);
  }
});

const filtroArchivo = (req, file, cb) => {
  const tiposPermitidos = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];

  if (tiposPermitidos.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos PDF, DOC o DOCX"), false);
  }
};

const uploadPlanificacion = multer({
  storage: almacenamiento,
  fileFilter: filtroArchivo,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

module.exports = uploadPlanificacion;