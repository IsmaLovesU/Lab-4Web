import http from "http"
import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"

// Error #5 corregido: __dirname no existe en ESM, hay que derivarlo
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = 3000

// Error #6 corregido: el callback del createServer debe ser async para poder usar await
const server = http.createServer(async (req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" })
    res.end("Servidor activo")
    return
  }

  // Error #2 corregido: "application-json" → "application/json" (slash, no guion)
  if (req.url === "/info") {
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ info: "Ruta de información" }))
    return
  }

  if (req.url === "/api/student") {
    const filePath = path.join(__dirname, "datos.json")
    // Error #3 corregido: fs.readFile retorna una Promesa, hay que usar await
    const texto = await fs.readFile(filePath, "utf-8")
    // Error #4 corregido: texto ya es un string JSON; parsearlo antes de re-serializar
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(texto)
    return
  }

  // Error #1 corregido: ruta no encontrada debe responder con 404, no 200
  res.writeHead(404, { "Content-Type": "text/plain" })
  res.end("Ruta no encontrada")
}) // Error #7 corregido: faltaba el paréntesis de cierre de http.createServer(...)

server.listen(PORT, () => {
  console.log("Servidor corriendo en http://localhost:3000")
}) // Error #8 corregido: faltaba el paréntesis de cierre de server.listen(...)