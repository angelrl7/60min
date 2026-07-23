-- Ejecutar en el SQL Editor de tu proyecto de Supabase.

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text,
  precio numeric(12, 2) not null,
  categoria text,
  imagen text,
  badge text,
  stock integer,
  oferta boolean not null default false,
  precio_oferta numeric(12, 2),
  talles text[],
  created_at timestamptz not null default now()
);

-- Si la tabla ya existía (proyecto creado antes de agregar talles), esto la actualiza.
alter table products add column if not exists talles text[];

alter table products enable row level security;

-- Cualquiera (incluso sin login) puede ver el catálogo.
create policy "Los productos son públicos para lectura"
  on products for select
  to anon, authenticated
  using (true);

-- Solo un usuario autenticado (el admin) puede crear/editar/borrar productos.
create policy "Solo usuarios autenticados pueden crear productos"
  on products for insert
  to authenticated
  with check (true);

create policy "Solo usuarios autenticados pueden editar productos"
  on products for update
  to authenticated
  using (true)
  with check (true);

create policy "Solo usuarios autenticados pueden borrar productos"
  on products for delete
  to authenticated
  using (true);

-- Categorías cargadas manualmente por el admin desde el panel.
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  created_at timestamptz not null default now()
);

alter table categories enable row level security;

create policy "Las categorías son públicas para lectura"
  on categories for select
  to anon, authenticated
  using (true);

create policy "Solo usuarios autenticados pueden crear categorías"
  on categories for insert
  to authenticated
  with check (true);

create policy "Solo usuarios autenticados pueden borrar categorías"
  on categories for delete
  to authenticated
  using (true);

-- Bucket de almacenamiento para las imágenes subidas desde el panel admin.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Las imágenes de productos son públicas para lectura"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

create policy "Solo usuarios autenticados pueden subir imágenes"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

create policy "Solo usuarios autenticados pueden borrar imágenes"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');

-- Slides del carrusel de la portada, editables desde el panel admin.
create table if not exists slides (
  id uuid primary key default gen_random_uuid(),
  src text not null,
  alt text not null default '',
  orden integer not null default 0,
  created_at timestamptz not null default now()
);

alter table slides enable row level security;

create policy "Los slides son públicos para lectura"
  on slides for select
  to anon, authenticated
  using (true);

create policy "Solo usuarios autenticados pueden crear slides"
  on slides for insert
  to authenticated
  with check (true);

create policy "Solo usuarios autenticados pueden editar slides"
  on slides for update
  to authenticated
  using (true)
  with check (true);

create policy "Solo usuarios autenticados pueden borrar slides"
  on slides for delete
  to authenticated
  using (true);

-- Bucket de almacenamiento para las imágenes del carrusel subidas desde el panel admin.
insert into storage.buckets (id, name, public)
values ('carousel-images', 'carousel-images', true)
on conflict (id) do nothing;

create policy "Las imágenes del carrusel son públicas para lectura"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'carousel-images');

create policy "Solo usuarios autenticados pueden subir imágenes del carrusel"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'carousel-images');

create policy "Solo usuarios autenticados pueden borrar imágenes del carrusel"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'carousel-images');

-- Después de correr este script, creá el usuario admin desde
-- Authentication > Users > Add user (con email + contraseña),
-- así podés iniciar sesión en /pantallas/login desde la app.
