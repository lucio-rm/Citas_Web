import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import usuariosRoutes from "./routes/usuarios.js";

const app = express();
const PORT = 3000;

// Para __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());

// 👉 SERVIR FRONTEND (ESTO ES LO QUE FALTABA)
app.use("/frontend", express.static(path.join(__dirname, "../../frontend")));

// Rutas API
app.use("/usuarios", usuariosRoutes);

// Ruta test
app.get("/", (req, res) => {
  res.send("Backend Red Thread funcionando");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
