-- Pulso BA: esquema inicial de Supabase
-- Favoritos, "voy" (asistencia) y reseñas, todo ligado a auth.users (el
-- sistema de usuarios que ya trae Supabase, no hace falta armar el propio).

-- FAVORITOS ------------------------------------------------------------
create table public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  event_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, event_id)
);

alter table public.favorites enable row level security;

-- Cualquiera puede ver cuántos favoritos tiene un evento (para mostrar el
-- contador), pero solo el dueño puede agregar o sacar sus propios favoritos.
create policy "Favoritos son públicos para leer"
  on public.favorites for select
  using (true);

create policy "Cada usuario administra sus propios favoritos"
  on public.favorites for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ASISTENCIA ("VOY") -----------------------------------------------------
create table public.attendances (
  user_id uuid not null references auth.users(id) on delete cascade,
  event_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, event_id)
);

alter table public.attendances enable row level security;

create policy "Asistencias son públicas para leer"
  on public.attendances for select
  using (true);

create policy "Cada usuario administra su propia asistencia"
  on public.attendances for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- RESEÑAS ----------------------------------------------------------------
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  event_id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  -- La tabla auth.users no es legible desde el cliente (RLS la protege), así
  -- que guardamos acá un nombre a mostrar (nunca el email completo, porque
  -- esta tabla es pública para leer).
  author_name text not null,
  rating smallint not null check (rating between 1 and 5),
  body text not null check (char_length(body) between 1 and 1000),
  created_at timestamptz not null default now(),
  -- una sola reseña por usuario y evento: si quiere cambiar la opinión, edita la que ya hizo
  unique (user_id, event_id)
);

alter table public.reviews enable row level security;

create policy "Reseñas son públicas para leer"
  on public.reviews for select
  using (true);

create policy "Cada usuario crea sus propias reseñas"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "Cada usuario edita sus propias reseñas"
  on public.reviews for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Cada usuario borra sus propias reseñas"
  on public.reviews for delete
  using (auth.uid() = user_id);
