const titulo = document.getElementById("titulo");
const genero = document.getElementById("genero");
const calificacion = document.getElementById("calificacion");
const estado = document.getElementById("estado");
const comentario = document.getElementById("comentario");

const form = document.getElementById("form");
const lista = document.getElementById("lista");
const filtro = document.getElementById("filtro");
const total = document.getElementById("total");
const promedio = document.getElementById("promedio");

let peliculas = [];
let editIndex = null;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const peli = {
    titulo: titulo.value,
    genero: genero.value,
    calificacion: Number(calificacion.value),
    estado: estado.value,
    comentario: comentario.value
  };

  if (editIndex !== null) {
    await fetch(`/peliculas/${editIndex}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(peli)
    });

    editIndex = null;
  } 

  else {
    await fetch("/peliculas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(peli)
    });
  }

  form.reset();
  cargarPeliculas();
});

async function cargarPeliculas() {
  const res = await fetch("/peliculas");
  peliculas = await res.json();
  mostrarPeliculas();
}

function mostrarPeliculas() {
  lista.innerHTML = "";

  let filtradas = peliculas;

  if (filtro.value !== "todas") {
    filtradas = peliculas.filter(p => p.estado === filtro.value);
  }

  filtradas.forEach((p, i) => {
    lista.innerHTML += `
      <div class="card">
        <h3>${p.titulo}</h3>
        <p>${p.genero}</p>
        <p>⭐ ${p.calificacion}</p>
        <p>${p.estado}</p>
        <p>${p.comentario}</p>

        <button onclick="editar(${i})">Editar</button>
        <button onclick="eliminar(${i})">Eliminar</button>
      </div>
    `;
  });

  actualizarStats();
}

async function eliminar(i) {
  if (confirm("¿Eliminar película?")) {
    await fetch(`/peliculas/${i}`, {
      method: "DELETE"
    });

    cargarPeliculas();
  }
}

function editar(i) {
  const p = peliculas[i];

  titulo.value = p.titulo;
  genero.value = p.genero;
  calificacion.value = p.calificacion;
  estado.value = p.estado;
  comentario.value = p.comentario;

  editIndex = i;
}

function actualizarStats() {
  total.textContent = "Total: " + peliculas.length;

  if (peliculas.length === 0) {
    promedio.textContent = "Promedio: 0";
    return;
  }

  const suma = peliculas.reduce((acc, p) => acc + p.calificacion, 0);
  const prom = (suma / peliculas.length).toFixed(1);

  promedio.textContent = "Promedio: " + prom;
}

filtro.addEventListener("change", mostrarPeliculas);

cargarPeliculas();