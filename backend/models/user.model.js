import { Schema, model } from "mongoose"

const userSchema = new Schema(
    {
        name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
        email: { type: String, required: true, trim: true, lowercase: true, unique: true },
        password: { type: String, required: true, select: false } // hash bcrypt, nunca se devuelve
    },
    { timestamps: true, versionKey: false }
)

export const User = model("User", userSchema, "Users")
