import { Schema, model } from "mongoose"
import { CATEGORY_SLUGS } from "../services/categories.services.js"

const productSchema = new Schema(
    {
        name: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
        description: { type: String, required: true, trim: true, minlength: 10, maxlength: 800 },
        ingredients: {
            type: [String],
            validate: { validator: list => list.length > 0, message: "Debe tener al menos un ingrediente" }
        },
        link: { type: String, required: true, trim: true },
        img: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 0 },
        category: { type: String, required: true, enum: CATEGORY_SLUGS },
        brand_id: { type: Schema.Types.ObjectId, ref: "Brand", required: true, index: true },
        created_by: { type: Schema.Types.ObjectId, ref: "User" }
    },
    { timestamps: true, versionKey: false }
)

productSchema.index({ category: 1 })

export const Product = model("Product", productSchema, "Products")
