import "dotenv/config"

export const PORT = process.env.PORT || 3333
export const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/seoul_glow"
export const JWT_SECRET = process.env.JWT_SECRET
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h"
export const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5175"

if (!JWT_SECRET) {
    console.error("Falta la variable JWT_SECRET en el archivo .env")
    process.exit(1)
}
