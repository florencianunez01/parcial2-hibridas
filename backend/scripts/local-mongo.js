// Levanta un MongoDB local (puerto 27017) usando mongodb-memory-server, para quien no tenga
// MongoDB instalado. Los datos se guardan en backend/.mongo-data, así que persisten entre reinicios.
// Uso: npm run db:local   (dejar esta terminal abierta)
import { mkdirSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { MongoMemoryServer } from "mongodb-memory-server"

const dbPath = fileURLToPath(new URL("../.mongo-data", import.meta.url))
mkdirSync(dbPath, { recursive: true })

const server = await MongoMemoryServer.create({
    instance: { port: 27017, dbPath, storageEngine: "wiredTiger" }
})

console.log(`MongoDB local corriendo en ${server.getUri()}`)
console.log("Ctrl+C para detenerlo")

const stop = async () => {
    await server.stop({ doCleanup: false })
    process.exit(0)
}
process.on("SIGINT", stop)
process.on("SIGTERM", stop)
