import { Schema, model } from "mongoose"

const brandSchema = new Schema(
    {
        name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60, unique: true },
        photo: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true, minlength: 10, maxlength: 500 },
        created_by: { type: Schema.Types.ObjectId, ref: "User" }
    },
    { timestamps: true, versionKey: false }
)

export const Brand = model("Brand", brandSchema, "Brands")
