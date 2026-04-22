const express = require("express");
const cors = require("cors");

require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.log(err));

const app = express();

app.use(cors());
app.use(express.json());

let peliculas = [];

app.post("/peliculas", (req, res) => {
  const peli = req.body;

  if (!peli.titulo || !peli.genero) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  peliculas.push(peli);
  res.json({ mensaje: "Película guardada", data: peli });
});

app.get("/peliculas", (req, res) => {
  res.json(peliculas);
});

app.put("/peliculas/:id", (req, res) => {
  const id = req.params.id;

  if (!peliculas[id]) {
    return res.status(404).json({ error: "No existe" });
  }

  peliculas[id] = req.body;
  res.json({ mensaje: "Actualizada" });
});

app.delete("/peliculas/:id", (req, res) => {
  const id = req.params.id;

  if (!peliculas[id]) {
    return res.status(404).json({ error: "No existe" });
  }

  peliculas.splice(id, 1);
  res.json({ mensaje: "Eliminada" });
});

app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en http://localhost:" + PORT);
});