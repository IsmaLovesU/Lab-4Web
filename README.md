# Laboratorio #4 — JavaScript API

**Nombre:** Andrés Ismalej  
**Carnet:** 24005  
**Curso:** Sistemas y Tecnologías Web  

---

## Descripción

En este laboratorio se construyó una API REST funcional desde cero usando Node.js y Express. El laboratorio se divide en dos partes:

- **Parte 1:** Depuración de un servidor HTTP nativo con errores (`Laboratorio_4_servidor_malo.js`)
- **Parte 2:** Diseño e implementación de un CRUD completo para gestionar un catálogo de recetas de repostería

---

## Requisitos previos

- Node.js v18 o superior
- npm

---

## Instalación

```bash
npm install
```

---

## Ejecución

```bash
# API principal (Parte 2)
node server.js

# Servidor corregido (Parte 1)
node servidor-malo-corregido.js
```

El servidor corre en `http://localhost:3001`

---

## Parte 1 — Depuración del servidor roto

Se identificaron y corrigieron **8 errores** en el archivo `servidor-malo.js`. La documentación completa de cada error se encuentra en [SOLUCION.md](./SOLUCION.md).

| # | Tipo | Descripción |
|---|------|-------------|
| 1 | HTTP | Ruta no encontrada respondía con `200` en vez de `404` |
| 2 | HTTP | `application-json` → `application/json` (guion por slash) |
| 3 | Asincronía | `fs.readFile` sin `await` |
| 4 | Lógica | `JSON.stringify` sobre un string ya serializado |
| 5 | ESM | `__dirname` no existe en ES Modules |
| 6 | Asincronía | Callback del servidor no declarado como `async` |
| 7 | Sintaxis | Paréntesis de cierre faltante en `http.createServer(...)` |
| 8 | Sintaxis | Paréntesis de cierre faltante en `server.listen(...)` |

---

## Parte 2 — API REST de Recetas

### Dominio

Catálogo de recetas de repostería con las siguientes propiedades:

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `id` | string | Identificador único generado con `uid()` |
| `nombre` | string | Nombre de la receta |
| `descripcion` | string | Descripción breve |
| `categoria` | string | Categoría (`postre`, `pastel`, `pie`, etc.) |
| `dificultad` | string | Nivel de dificultad (`baja`, `media`, `alta`) |
| `tiempoMinutos` | number | Tiempo de preparación en minutos |
| `porciones` | number | Número de porciones |
| `ingredientes` | array | Lista de ingredientes |
| `disponible` | boolean | Si la receta está disponible |

### Datos iniciales

El API arranca con 4 recetas precargadas:

| Nombre | Categoría | Dificultad | Tiempo |
|--------|-----------|------------|--------|
| Flan | postre | media | 90 min |
| Tiramisú | postre | alta | 60 min |
| Pastel de 3 leches | pastel | media | 120 min |
| Pie de queso | pie | baja | 45 min |

### Endpoints

| Método | Ruta | Descripción | Código exitoso |
|--------|------|-------------|----------------|
| GET | `/` | Información general y lista de endpoints | 200 |
| GET | `/api/recetas` | Listar todas las recetas | 200 |
| GET | `/api/recetas?categoria=postre` | Filtrar por categoría | 200 |
| GET | `/api/recetas?dificultad=alta` | Filtrar por dificultad | 200 |
| GET | `/api/recetas?disponible=true` | Filtrar por disponibilidad | 200 |
| GET | `/api/recetas/:id` | Obtener una receta por ID | 200 |
| POST | `/api/recetas` | Crear nueva receta | 201 |
| PUT | `/api/recetas/:id` | Reemplazar receta completa | 200 |
| PATCH | `/api/recetas/:id` | Actualizar campos específicos | 200 |
| DELETE | `/api/recetas/:id` | Eliminar una receta | 200 |

### Ruta 404

Cualquier ruta no existente responde con:

```json
{
  "error": "Ruta no encontrada",
  "ruta": "/ruta-que-no-existe",
  "metodo": "GET",
  "sugerencia": "Visita / para ver los endpoints disponibles"
}
```

### Formato de respuestas

Todas las respuestas siguen una estructura consistente:

```json
// Éxito
{ "ok": true, "data": { } }

// Error
{ "ok": false, "error": "Mensaje descriptivo" }
```

### Códigos HTTP

| Código | Situación |
|--------|-----------|
| 200 | Operación exitosa |
| 201 | Recurso creado (POST) |
| 400 | Datos inválidos o campos faltantes |
| 404 | Receta o ruta no encontrada |
| 500 | Error interno del servidor |

### Validación en POST y PUT

Si el body no contiene los campos obligatorios, responde con `400`:

```json
{
  "ok": false,
  "error": "Faltan campos obligatorios",
  "camposFaltantes": ["nombre", "descripcion"]
}
```

**Campos obligatorios:** `nombre`, `descripcion`, `categoria`, `dificultad`, `tiempoMinutos`, `porciones`, `ingredientes`

### Diferencia entre PUT y PATCH

- **PUT** reemplaza el objeto completo. Requiere todos los campos obligatorios.
- **PATCH** actualiza solo los campos que se envían en el body. El resto se mantiene igual.

---

## Estructura del proyecto

```
Lab-4Web/
├── server.js                   # API Express — Parte 2
├── servidor-malo-corregido.js  # Servidor HTTP corregido — Parte 1
├── datos.json                  # Datos del estudiante para /api/student
├── SOLUCION.md                 # Documentación de errores corregidos
├── package.json
├── .gitignore
└── README.md
```

---

## Recursos utilizados

- [Documentación oficial de Express](https://expressjs.com/es/)
- [HTTP Status Codes — MDN](https://developer.mozilla.org/es/docs/Web/HTTP/Status)
- [REST API Design Best Practices](https://restfulapi.net/)
- [Node.js ES Modules Documentation](https://nodejs.org/api/esm.html)