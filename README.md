# Nombre de la tienda

Tienda online migrada de HTML/CSS/JS estático a **Vite + React + TypeScript + Tailwind CSS**, con **Supabase** como backend (base de datos Postgres, autenticación y almacenamiento de imágenes).

## Estructura

```
client/       App de Vite + React + TypeScript (todo el frontend)
supabase/     schema.sql para crear las tablas y políticas en tu proyecto de Supabase
legacy/       Sitio original en HTML/CSS/JS, conservado como referencia
```

## 1. Crear el proyecto de Supabase

1. Entrá a [supabase.com](https://supabase.com) y creá un proyecto nuevo (o usá uno existente).
2. Andá a **SQL Editor** y ejecutá el contenido de [`supabase/schema.sql`](supabase/schema.sql). Esto crea:
   - la tabla `products` con Row Level Security (lectura pública, escritura solo para usuarios autenticados),
   - el bucket de Storage `product-images` (público para lectura, subida solo para usuarios autenticados).
3. Andá a **Authentication → Users → Add user** y creá el usuario admin (email + contraseña). Con esas credenciales vas a poder entrar al panel `/admin` de la app.
4. Andá a **Project Settings → API** y copiá la **Project URL** y la **anon public key**.

## 2. Configurar el frontend

```bash
cd client
cp .env.example .env.local
```

Editá `client/.env.local` con los valores de tu proyecto:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anon-publica
VITE_WHATSAPP_NUMERO=542645579914
```

## 3. Correr en desarrollo

```bash
cd client
npm install
npm run dev
```

Abrí `http://localhost:5173`.

## 4. Build de producción

```bash
cd client
npm run build
npm run preview   # para previsualizar el build localmente
```

El resultado queda en `client/dist/`, listo para desplegar en cualquier hosting estático (Vercel, Netlify, Cloudflare Pages, GitHub Pages, etc.). No hace falta hostear ningún servidor aparte: todo el acceso a datos va directo del navegador a Supabase.

## Qué cambió respecto al sitio original

- **Framework**: de HTML estático a React con rutas de cliente (`react-router-dom`): `/`, `/productos`, `/ofertas`, `/carrito`, `/login`, `/admin`.
- **Estilos**: de CSS a mano a Tailwind CSS v4.
- **Datos de productos**: antes vivían en `localStorage` (se perdían por navegador/dispositivo). Ahora viven en una tabla Postgres en Supabase, compartida entre todos los usuarios y persistente.
- **Login de admin**: antes era un usuario/contraseña hardcodeado en el JS (`admin` / `admin123`, visible en el código fuente). Ahora es autenticación real por email/contraseña vía Supabase Auth — creá el usuario admin desde el dashboard de Supabase, no desde la app.
- **Imágenes de productos**: además de pegar una URL, el panel admin puede subir un archivo directo a Supabase Storage (antes se guardaba como base64 en `localStorage`, lo cual era pesado y frágil).
- **Carrito**: sigue siendo por navegador (`localStorage`) — no requiere login, igual que antes.
- **Ofertas**: se corrigió una inconsistencia del sitio original (el código mostraba las ofertas de 20:00 a 22:00 pero el texto decía "17:00 a 18:00"); ahora el texto y la lógica coinciden.
- **Imágenes del carrusel de inicio**: la carpeta `imagenes/` original estaba vacía (las 3 fotos referenciadas no existían), así que el carrusel usa imágenes de relleno (`picsum.photos`) hasta que subas fotos reales.

## Pendiente / a tu criterio

- Reemplazar las imágenes de relleno del carrusel de inicio (`client/src/pages/Home.tsx`) por fotos reales, subiéndolas a `client/public/imagenes/`.
- El mapa de Google Maps embebido en el home ya venía con una URL inválida en el sitio original (parámetro `pb` roto); hay que generar un nuevo embed desde Google Maps con la ubicación real del negocio.
- Ajustar el número de WhatsApp (`VITE_WHATSAPP_NUMERO`) y el nombre real de la tienda (`NOMBRE_TIENDA` en `Home.tsx` y `Nav.tsx`, y el `<title>` en `index.html`).
