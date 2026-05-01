const express = require("express");
const { uid } = require("uid");

const app = express();
app.use(express.json());
const PORT = 3001;

let recetas = [
  {
    id: uid(),
    nombre: "Flan",
    descripcion: "Postre cremoso de huevo y leche con caramelo dorado.",
    categoria: "postre",
    dificultad: "media",
    tiempoMinutos: 90,
    porciones: 8,
    ingredientes: ["huevos", "leche condensada", "leche evaporada", "azúcar", "vainilla"],
    disponible: true,
  },
  {
    id: uid(),
    nombre: "Tiramisú",
    descripcion: "Clásico postre italiano con mascarpone, café y cocoa.",
    categoria: "postre",
    dificultad: "alta",
    tiempoMinutos: 60,
    porciones: 6,
    ingredientes: ["queso mascarpone", "huevos", "café espresso", "dedos de dama", "cocoa", "azúcar"],
    disponible: true,
  },
  {
    id: uid(),
    nombre: "Pastel de 3 leches",
    descripcion: "Bizcocho esponjoso empapado en tres tipos de leche con crema chantilly.",
    categoria: "pastel",
    dificultad: "media",
    tiempoMinutos: 120,
    porciones: 12,
    ingredientes: ["harina", "huevos", "leche entera", "leche condensada", "leche evaporada", "crema", "azúcar"],
    disponible: true,
  },
  {
    id: uid(),
    nombre: "Pie de queso",
    descripcion: "Tarta fría de queso crema sobre base de galleta, con coulis de fresa.",
    categoria: "pie",
    dificultad: "baja",
    tiempoMinutos: 45,
    porciones: 10,
    ingredientes: ["queso crema", "galletas María", "mantequilla", "azúcar glass", "crema para batir", "fresas"],
    disponible: true,
  },
];


const CAMPOS_REQUERIDOS = ["nombre", "descripcion", "categoria", "dificultad", "tiempoMinutos", "porciones", "ingredientes"];

//  HELPERS
const ok = (data) => ({ ok: true, data });
const err = (mensaje, extra = {}) => ({ ok: false, error: mensaje, ...extra });

//  RUTA RAÍZ — Información de endpoints
app.get("/", (req, res) => {
  res.status(200).json(
    ok({
      mensaje: "API de Recetas — Andrés Ismalej (24005)",
      curso: "Sistemas y Tecnologías Web",
      endpoints: {
        "GET    /api/recetas":              "Listar todas las recetas (filtros: ?categoria=&dificultad=&disponible=)",
        "GET    /api/recetas/:id":          "Obtener una receta por id",
        "POST   /api/recetas":              "Crear una nueva receta",
        "PUT    /api/recetas/:id":          "Reemplazar una receta completa",
        "PATCH  /api/recetas/:id":          "Actualizar campos específicos de una receta",
        "DELETE /api/recetas/:id":          "Eliminar una receta",
      },
    })
  );
});

//  GET /api/recetas — Listar con filtros opcionales
app.get("/api/recetas", (req, res) => {
  const { categoria, dificultad, disponible } = req.query;
  let resultado = [...recetas];

  if (categoria) {
    resultado = resultado.filter((r) => r.categoria.toLowerCase() === categoria.toLowerCase());
  }
  if (dificultad) {
    resultado = resultado.filter((r) => r.dificultad.toLowerCase() === dificultad.toLowerCase());
  }
  if (disponible !== undefined) {
    const val = disponible === "true";
    resultado = resultado.filter((r) => r.disponible === val);
  }

  res.status(200).json(ok(resultado));
});

//  GET /api/recetas/:id — Obtener una receta
app.get("/api/recetas/:id", (req, res) => {
  const receta = recetas.find((r) => r.id === req.params.id);
  if (!receta) {
    return res.status(404).json(err(`Receta con id '${req.params.id}' no encontrada`));
  }
  res.status(200).json(ok(receta));
});

//  POST /api/recetas — Crear receta
app.post("/api/recetas", (req, res) => {
  const body = req.body;

  // Validación: campos obligatorios
  const faltantes = CAMPOS_REQUERIDOS.filter((campo) => body[campo] === undefined || body[campo] === "");
  if (faltantes.length > 0) {
    return res.status(400).json(err("Faltan campos obligatorios", { camposFaltantes: faltantes }));
  }

  // Validación: ingredientes debe ser arreglo no vacío
  if (!Array.isArray(body.ingredientes) || body.ingredientes.length === 0) {
    return res.status(400).json(err("'ingredientes' debe ser un arreglo con al menos un elemento"));
  }

  const nueva = {
    id: uid(),
    nombre: body.nombre,
    descripcion: body.descripcion,
    categoria: body.categoria,
    dificultad: body.dificultad,
    tiempoMinutos: body.tiempoMinutos,
    porciones: body.porciones,
    ingredientes: body.ingredientes,
    disponible: body.disponible !== undefined ? body.disponible : true,
  };

  recetas.push(nueva);
  res.status(201).json(ok(nueva));
});

//  PUT /api/recetas/:id — Reemplazar receta completa
app.put("/api/recetas/:id", (req, res) => {
  const idx = recetas.findIndex((r) => r.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json(err(`Receta con id '${req.params.id}' no encontrada`));
  }

  const body = req.body;
  const faltantes = CAMPOS_REQUERIDOS.filter((campo) => body[campo] === undefined || body[campo] === "");
  if (faltantes.length > 0) {
    return res.status(400).json(err("Faltan campos obligatorios para reemplazar la receta", { camposFaltantes: faltantes }));
  }

  const actualizada = {
    id: recetas[idx].id,
    nombre: body.nombre,
    descripcion: body.descripcion,
    categoria: body.categoria,
    dificultad: body.dificultad,
    tiempoMinutos: body.tiempoMinutos,
    porciones: body.porciones,
    ingredientes: body.ingredientes,
    disponible: body.disponible !== undefined ? body.disponible : true,
  };

  recetas[idx] = actualizada;
  res.status(200).json(ok(actualizada));
});

//  PATCH /api/recetas/:id — Actualizar campos específicos
app.patch("/api/recetas/:id", (req, res) => {
  const idx = recetas.findIndex((r) => r.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json(err(`Receta con id '${req.params.id}' no encontrada`));
  }

  // Solo mezclar campos permitidos
  const camposPermitidos = [...CAMPOS_REQUERIDOS, "disponible"];
  const actualizaciones = {};
  for (const campo of camposPermitidos) {
    if (req.body[campo] !== undefined) {
      actualizaciones[campo] = req.body[campo];
    }
  }

  if (Object.keys(actualizaciones).length === 0) {
    return res.status(400).json(err("El body no contiene ningún campo válido para actualizar"));
  }

  recetas[idx] = { ...recetas[idx], ...actualizaciones };
  res.status(200).json(ok(recetas[idx]));
});

//  DELETE /api/recetas/:id — Eliminar receta
app.delete("/api/recetas/:id", (req, res) => {
  const idx = recetas.findIndex((r) => r.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json(err(`Receta con id '${req.params.id}' no encontrada`));
  }
  const eliminada = recetas.splice(idx, 1)[0];
  res.status(200).json(ok({ mensaje: "Receta eliminada correctamente", recetaEliminada: eliminada }));
});

//  RUTA 404 — catch-all
app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    ruta: req.originalUrl,
    metodo: req.method,
    sugerencia: "Visita / para ver los endpoints disponibles",
  });
});

//  INICIAR SERVIDOR
app.listen(PORT, () => {
  console.log(`API de Recetas corriendo en http://localhost:${PORT}`);
});