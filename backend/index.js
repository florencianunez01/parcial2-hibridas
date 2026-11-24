import express from "express"
import cors from "cors"
import { PORT, CORS_ORIGIN } from "./config/env.js"
import { connectDB } from "./config/db.js"
import apiRoutes from "./routes/index.js"
import { errorHandler, notFound } from "./middlewares/error.middleware.js"

const app = express()

app.use(cors({ origin: CORS_ORIGIN.split(",").map(o => o.trim()) }))
app.use(express.json())

app.get("/", (req, res) => res.json({ name: "Seoul Glow API", docs: "Ver README.md" }))
app.use("/api", apiRoutes)
app.use(notFound)
app.use(errorHandler)

connectDB()
    .then(() => app.listen(PORT, () => console.log(`API en http://localhost:${PORT}`)))
    .catch(err => {
        console.error("No se pudo conectar a MongoDB:", err.message)
        process.exit(1)
    })
