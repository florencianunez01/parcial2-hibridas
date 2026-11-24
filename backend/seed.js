// Carga datos de ejemplo. Uso: npm run seed  (borra y vuelve a crear usuarios, marcas y productos)
import bcrypt from "bcryptjs"
import { connectDB, closeDB } from "./config/db.js"
import { User } from "./models/user.model.js"
import { Brand } from "./models/brand.model.js"
import { Product } from "./models/product.model.js"

await connectDB()

await Promise.all([Product.deleteMany({}), Brand.deleteMany({}), User.deleteMany({})])

// Usuario de prueba para iniciar sesión (ver README)
const demo = await User.create({
    name: "Usuario Demo",
    email: "demo@seoulglow.com",
    password: await bcrypt.hash("demo1234", 10)
})

// Fotos de cosmética de Unsplash (licencia libre). Se piden ya recortadas al tamaño que usa la app.
const unsplash = (id, w, h) => `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&q=80`
const photo = id => unsplash(id, 300, 300)
const [cosrx, joseon, laneige, innisfree] = await Brand.insertMany(
    [
        { name: "COSRX", photo: photo("1567721913486-6585f069b332"), description: "Marca coreana conocida por fórmulas simples y efectivas, como su esencia de mucina de caracol." },
        { name: "Beauty of Joseon", photo: photo("1612817288484-6f916006741a"), description: "Marca inspirada en los rituales de belleza de la dinastía Joseon, con ingredientes como arroz y ginseng." },
        { name: "Laneige", photo: photo("1583209814683-c023dd293cc6"), description: "Marca especializada en hidratación, famosa por sus mascarillas de noche." },
        { name: "Innisfree", photo: photo("1629198688000-71f23e745b6e"), description: "Marca que usa ingredientes de la isla de Jeju, como el té verde." },
        { name: "Anua", photo: photo("1737007516314-27508948ab4e"), description: "Marca recién agregada al catálogo, todavía sin productos cargados." }
    ].map(b => ({ ...b, created_by: demo._id }))
)

const img = id => unsplash(id, 800, 600)

const products = [
    { name: "Low pH Good Morning Gel Cleanser", description: "Limpiador en gel suave de pH bajo, pensado para usar a la mañana.", ingredients: ["BHA", "Árbol de té"], link: "https://www.cosrx.com", img: img("1620916566398-39f1143ab7be"), price: 14500, category: "limpiador", brand_id: cosrx._id },
    { name: "Green Tea Foam Cleanser", description: "Espuma limpiadora con extracto de té verde que limpia sin resecar.", ingredients: ["Té verde", "Aminoácidos"], link: "https://www.innisfree.com", img: img("1616750819456-5cdee9b85d22"), price: 12900, category: "limpiador", brand_id: innisfree._id },
    { name: "AHA/BHA Clarifying Treatment Toner", description: "Tónico exfoliante suave que ayuda a mantener los poros limpios.", ingredients: ["AHA", "BHA", "Agua de manzana"], link: "https://www.cosrx.com", img: img("1615397349754-cfa2066a298e"), price: 16800, category: "tonico", brand_id: cosrx._id },
    { name: "Cream Skin Toner & Moisturizer", description: "Tónico cremoso que hidrata como una crema ligera.", ingredients: ["Té blanco", "Ceramidas"], link: "https://www.laneige.com", img: img("1689414480286-aae7c21fe1e2"), price: 29900, category: "tonico", brand_id: laneige._id },
    { name: "Advanced Snail 96 Mucin Power Essence", description: "Esencia liviana con mucina de caracol que hidrata y calma la piel.", ingredients: ["Mucina de caracol", "Ácido hialurónico"], link: "https://www.cosrx.com", img: img("1764694187667-f28a05a52c0e"), price: 21500, category: "serum", brand_id: cosrx._id },
    { name: "Glow Serum: Propolis + Niacinamide", description: "Sérum para dar luminosidad y unificar el tono de la piel.", ingredients: ["Propóleo", "Niacinamida"], link: "https://beautyofjoseon.com", img: img("1608571423902-eed4a5ad8108"), price: 18700, category: "serum", brand_id: joseon._id },
    { name: "Green Tea Seed Serum", description: "Sérum hidratante con semillas de té verde de Jeju.", ingredients: ["Té verde", "Ácido hialurónico"], link: "https://www.innisfree.com", img: img("1781344116880-029945a42b75"), price: 24300, category: "serum", brand_id: innisfree._id },
    { name: "Water Sleeping Mask", description: "Mascarilla de noche en gel que hidrata mientras dormís.", ingredients: ["Ácido hialurónico", "Escualano"], link: "https://www.laneige.com", img: img("1763503834047-ac85c4105c0b"), price: 27600, category: "hidratante", brand_id: laneige._id },
    { name: "Dynasty Cream", description: "Crema nutritiva de textura rica, ideal para pieles secas.", ingredients: ["Agua de arroz", "Niacinamida", "Ginseng"], link: "https://beautyofjoseon.com", img: img("1585945037805-5fd82c2e60b1"), price: 22400, category: "hidratante", brand_id: joseon._id },
    { name: "Relief Sun: Rice + Probiotics SPF50+", description: "Protector solar liviano de terminación natural, sin dejar marcas blancas.", ingredients: ["Extracto de arroz", "Probióticos"], link: "https://beautyofjoseon.com", img: img("1738721796993-5f42d9315689"), price: 19800, category: "protector-solar", brand_id: joseon._id },
    { name: "Daily UV Defense Sunscreen", description: "Protector solar de uso diario con textura ligera.", ingredients: ["Té verde", "Centella asiática"], link: "https://www.innisfree.com", img: img("1611246937963-bfd36070ac90"), price: 17200, category: "protector-solar", brand_id: innisfree._id }
].map(p => ({ ...p, created_by: demo._id }))

await Product.insertMany(products)
await Promise.all([User.syncIndexes(), Brand.syncIndexes(), Product.syncIndexes()])

console.log(`Cargados 1 usuario, 5 marcas y ${products.length} productos`)
await closeDB()
