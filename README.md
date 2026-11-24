# Seoul Glow: skin care coreano (Parcial 2, Aplicaciones Híbridas)

Proyecto **fullstack MERN** (MongoDB, Express, React, Node). Es la continuación del [Parcial 1](https://github.com/florencianunez01/parcial1-hibridas): un catálogo de productos de skin care coreano organizados por paso de la rutina, con sus marcas.

- Cualquier visitante puede ver productos y marcas, filtrarlos y buscarlos.
- Para **crear, editar o eliminar** productos y marcas hay que **registrarse e iniciar sesión** (JWT).

```
parcial2-hibridas/
├── backend/    → API REST (Express + Mongoose + JWT)       http://localhost:3333/api
└── frontend/   → SPA en React (Vite + React Router)       http://localhost:5175
```

## Cómo levantar el proyecto

Requisitos: **Node.js 20 o superior** y una base **MongoDB** (local, Atlas, o la que trae el proyecto, ver paso 2).

### 1. Variables de entorno

Los archivos `.env` se entregan aparte. Si no los tenés, copiá los de ejemplo:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

`backend/.env`

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PORT` | Puerto de la API | `3333` |
| `MONGO_URI` | Conexión a MongoDB (incluye el nombre de la base) | `mongodb://127.0.0.1:27017/seoul_glow` |
| `JWT_SECRET` | Clave para firmar los tokens | un texto largo y aleatorio |
| `JWT_EXPIRES_IN` | Duración del token | `2h` |
| `CORS_ORIGIN` | Origen permitido del frontend | `http://localhost:5175` |

`frontend/.env`

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_URL` | URL base de la API | `http://localhost:3333/api` |

### 2. Backend

```bash
cd backend
npm install
```

Si **no tenés MongoDB instalado**, el proyecto trae un Mongo local listo para usar (con `mongodb-memory-server`; los datos se guardan en `backend/.mongo-data`). Dejalo corriendo en una terminal aparte:

```bash
npm run db:local
```

Después, en otra terminal:

```bash
npm run seed   # carga 1 usuario de prueba, 5 marcas y 11 productos (borra los datos anteriores)
npm run dev    # API en http://localhost:3333
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev    # http://localhost:5175
```

### Usuario de prueba (lo crea `npm run seed`)

| Email | Contraseña |
|---|---|
| `demo@seoulglow.com` | `demo1234` |

También se puede crear una cuenta nueva desde **Crear cuenta**.

Las fotos de los datos de ejemplo son imágenes de cosmética de [Unsplash](https://unsplash.com) (licencia libre), elegidas sin logos de marcas reales.

---

## Backend (API REST)

### Estructura

```
backend/
├── index.js                 → arma Express: CORS, JSON, rutas y manejo de errores
├── config/                  → variables de entorno y conexión a MongoDB
├── models/                  → esquemas de Mongoose (User, Brand, Product)
├── routes/                  → routers por recurso (/usuarios, /marcas, /productos, /categorias)
├── controllers/             → reciben la request y arman la respuesta HTTP
├── services/                → lógica de negocio y acceso a datos (único lugar que usa los modelos)
├── middlewares/             → auth (JWT), validación de body e ID, manejo de errores
├── validations/             → reglas de validación y limpieza de cada entidad
├── seed.js                  → datos de ejemplo
└── scripts/local-mongo.js   → MongoDB local para desarrollo
```

Flujo de una request: `router → middlewares (auth, validación) → controller → service → model (MongoDB)`.

### Modelado de la base de datos

Base `seoul_glow`, colecciones `Users`, `Brands` y `Products`.

**Users**
```json
{ "_id": "ObjectId", "name": "Usuario Demo", "email": "demo@seoulglow.com", "password": "<hash bcrypt>", "createdAt": "...", "updatedAt": "..." }
```
El email es único. La contraseña se guarda **encriptada con bcrypt** y nunca se devuelve en las respuestas.

**Brands**
```json
{ "_id": "ObjectId", "name": "COSRX", "photo": "https://...", "description": "...", "created_by": "ObjectId(User)" }
```

**Products**
```json
{
  "_id": "ObjectId",
  "name": "Advanced Snail 96 Mucin Power Essence",
  "description": "Esencia liviana que hidrata y calma la piel.",
  "ingredients": ["Mucina de caracol", "Ácido hialurónico"],
  "link": "https://www.cosrx.com",
  "img": "https://...",
  "price": 21500,
  "category": "serum",
  "brand_id": "ObjectId(Brand)",
  "created_by": "ObjectId(User)"
}
```

**Relaciones:** cada producto referencia a su marca con `brand_id` (1 a N). La marca no guarda un array de productos, se obtienen consultando `Products` por `brand_id` (con índice). Al listar productos se hace `populate` del nombre y la foto de la marca. Una marca **no se puede eliminar si tiene productos** (responde `409`). Marcas y productos guardan en `created_by` el usuario que los creó.

**Categorías** (pasos de la rutina, fijas): `limpiador`, `tonico`, `serum`, `hidratante`, `protector-solar`.

### Autenticación (JWT)

1. `POST /api/usuarios` (registro) o `POST /api/usuarios/login` devuelven `{ user, token }`.
2. Las rutas protegidas esperan el header `Authorization: Bearer <token>`.
3. El middleware `requireAuth` verifica el token y deja el usuario en `req.user`. Si falta o es inválido responde `401`.

### Endpoints

🔒 = requiere token.

**Usuarios**

| Método | URI | Descripción |
|---|---|---|
| POST | `/api/usuarios` | Registro (`name`, `email`, `password`) |
| POST | `/api/usuarios/login` | Login (`email`, `password`) |
| GET | `/api/usuarios/perfil` 🔒 | Datos del usuario logueado |
| PATCH | `/api/usuarios/perfil` 🔒 | Cambia el nombre |

**Marcas**

| Método | URI | Descripción |
|---|---|---|
| GET | `/api/marcas` | Todas las marcas (`?q=` busca por nombre) |
| GET | `/api/marcas/:id` | Una marca |
| GET | `/api/marcas/:id/productos` | Productos de la marca (`[]` si no tiene) |
| POST | `/api/marcas` 🔒 | Crea una marca |
| PUT | `/api/marcas/:id` 🔒 | Reemplaza todos los campos |
| PATCH | `/api/marcas/:id` 🔒 | Modifica sólo los campos enviados |
| DELETE | `/api/marcas/:id` 🔒 | Elimina (sólo si no tiene productos) |

**Productos**

| Método | URI | Descripción |
|---|---|---|
| GET | `/api/productos` | Todos. Filtros combinables: `?category=`, `?brand_id=`, `?ingredient=`, `?q=` |
| GET | `/api/productos/:id` | Un producto (con su marca) |
| POST | `/api/productos` 🔒 | Crea un producto (la marca debe existir) |
| PUT | `/api/productos/:id` 🔒 | Reemplaza todos los campos |
| PATCH | `/api/productos/:id` 🔒 | Modifica sólo los campos enviados |
| DELETE | `/api/productos/:id` 🔒 | Elimina |

**Categorías**

| Método | URI | Descripción |
|---|---|---|
| GET | `/api/categorias` | Lista de categorías (nombre y slug) |

### Validación y errores

Los datos se validan en dos niveles: las reglas de `validations/` (middleware `validateBody`, que además descarta campos que no correspondan) y los esquemas de Mongoose. Ante un error la API responde con el detalle por campo:

```json
{ "error": "Datos inválidos", "details": { "price": "El precio debe ser un número mayor o igual a 0" } }
```

Códigos: `200` OK · `201` creado · `400` datos, ID o JSON inválidos · `401` sin sesión / credenciales incorrectas · `404` no encontrado · `409` email o marca duplicados, marca con productos · `500` error del servidor.

### Ejemplos

```bash
# Login
curl -X POST http://localhost:3333/api/usuarios/login -H "Content-Type: application/json" \
  -d '{"email":"demo@seoulglow.com","password":"demo1234"}'

# Sérums con niacinamida
curl "http://localhost:3333/api/productos?category=serum&ingredient=niacinamida"

# Crear una marca (con el token del login)
curl -X POST http://localhost:3333/api/marcas -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" \
  -d '{"name":"Round Lab","photo":"https://picsum.photos/300","description":"Marca coreana de cuidado suave para la piel."}'
```

---

## Frontend (React)

### Estructura

```
frontend/src/
├── main.jsx                 → monta BrowserRouter + AuthProvider
├── App.jsx                  → definición de rutas (públicas, sólo visitantes y protegidas)
├── api/                     → TODA la comunicación con la API (las vistas nunca usan fetch)
│   ├── client.js            → fetch base: URL, token en el header, errores (ApiError)
│   ├── auth.api.js
│   ├── brands.api.js
│   └── products.api.js
├── context/AuthContext.jsx  → estado global de la sesión (usuario, login, registro, logout)
├── hooks/
│   ├── useAuth.js           → acceso al contexto de sesión
│   ├── useFetch.js          → carga de datos con estados loading / error / data
│   └── useForm.js           → valores, errores por campo y envío de formularios
├── validations/             → validaciones del lado del cliente (mismas reglas que el backend)
├── components/              → componentes reutilizables (cards, listas, filtros, formularios, layout…)
├── pages/                   → una vista por ruta
└── utils/format.js          → formato de precios
```

### Rutas

| Ruta | Página | Acceso |
|---|---|---|
| `/` | Inicio: los 5 pasos de la rutina y últimos productos | Pública |
| `/productos` | Listado con búsqueda y filtros (en la URL) | Pública |
| `/productos/:id` | Detalle del producto | Pública |
| `/marcas` · `/marcas/:id` | Marcas y detalle con sus productos | Pública |
| `/login` · `/registro` | Ingreso y registro | Sólo visitantes |
| `/productos/nuevo` · `/productos/:id/editar` | Alta y edición de productos | 🔒 Logueado |
| `/marcas/nueva` · `/marcas/:id/editar` | Alta y edición de marcas | 🔒 Logueado |
| `/perfil` | Perfil del usuario | 🔒 Logueado |

### Manejo del estado

- **Sesión (global):** `AuthContext` guarda el usuario; el token vive en `localStorage`. Al abrir la app valida el token contra `/usuarios/perfil`; si la API responde `401` (token vencido) cierra la sesión sola.
- **Datos del servidor:** cada página los pide con `useFetch`, que maneja `loading` / `error` / `data` y se vuelve a ejecutar cuando cambian los parámetros.
- **Filtros:** se guardan en la URL (`useSearchParams`), así se pueden compartir y sobreviven al recargar.
- **Formularios:** `useForm` maneja los valores, valida antes de enviar y muestra los errores que devuelve la API en cada campo.
- **Rutas protegidas:** `ProtectedRoute` redirige al login y, al ingresar, vuelve a la página que se quería abrir.
