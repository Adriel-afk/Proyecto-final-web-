require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado correctamente"))
  .catch(err => console.log(err));

const peliculaSchema = new mongoose.Schema({
  titulo: String,
  genero: String,
  calificacion: Number,
  estado: String,
  comentario: String
});

const Pelicula = mongoose.model("Pelicula", peliculaSchema);

app.post("/peliculas", async (req, res) => {
  try {
    const nueva = new Pelicula(req.body);
    await nueva.save();
    res.json(nueva);
  } catch (err) {
    res.status(500).json({ error: "Error al guardar" });
  }
});

app.get("/peliculas", async (req, res) => {
  try {
    const peliculas = await Pelicula.find();
    res.json(peliculas);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener" });
  }
});

app.put("/peliculas/:id", async (req, res) => {
  try {
    await Pelicula.findByIdAndUpdate(req.params.id, req.body);
    res.json({ mensaje: "Actualizada" });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar" });
  }
});

app.delete("/peliculas/:id", async (req, res) => {
  try {
    await Pelicula.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Eliminada" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar" });
  }
});

app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Servidor corriendo en http://localhost:" + PORT);
});