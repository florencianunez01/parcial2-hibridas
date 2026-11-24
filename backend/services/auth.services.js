import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js"
import { httpError } from "../middlewares/error.middleware.js"

const SALT_ROUNDS = 10

function toPublicUser(user) {
    return { _id: user._id, name: user.name, email: user.email, createdAt: user.createdAt }
}

export function createToken(user) {
    return jwt.sign({ sub: String(user._id), name: user.name, email: user.email }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    })
}

export function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET)
}

export async function register({ name, email, password }) {
    if (await User.exists({ email })) throw httpError(409, "Ya existe una cuenta con ese email")
    const hash = await bcrypt.hash(password, SALT_ROUNDS)
    const user = await User.create({ name, email, password: hash })
    return { user: toPublicUser(user), token: createToken(user) }
}

export async function login({ email, password }) {
    const user = await User.findOne({ email }).select("+password")
    const ok = user && (await bcrypt.compare(password, user.password))
    if (!ok) throw httpError(401, "Email o contraseña incorrectos")
    return { user: toPublicUser(user), token: createToken(user) }
}

export async function getProfile(id) {
    const user = await User.findById(id)
    if (!user) throw httpError(404, "Usuario no encontrado")
    return toPublicUser(user)
}

export async function updateProfile(id, data) {
    const user = await User.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })
    if (!user) throw httpError(404, "Usuario no encontrado")
    return { user: toPublicUser(user), token: createToken(user) }
}
