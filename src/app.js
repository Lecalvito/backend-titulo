const express = require("express");
const cors = require("cors");
const path = require("path");
const routes = require("./routes/index.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/cargas", express.static(path.join(__dirname, "../cargas")));

app.use("/api", routes);

app.get("/", (req, res) => {
  res.json({
    mensaje: "API Sistema Laboratorios de Simulación Clínica"
  });
});

module.exports = app;