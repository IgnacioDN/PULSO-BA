-- Reseñas: guardar un nombre para mostrar en vez del email completo.
-- Correr en Supabase → SQL Editor, en este orden.

-- PASO 1 (antes de desplegar el código nuevo)
alter table public.reviews add column if not exists author_name text;
update public.reviews
  set author_name = coalesce(nullif(left(regexp_replace(split_part(author_email, '@', 1), '[^[:alnum:]._-]', '', 'g'), 24), ''), 'Usuario')
  where author_name is null;
alter table public.reviews alter column author_name set not null;
alter table public.reviews alter column author_email drop not null;

-- PASO 2 (después de que el deploy nuevo esté en producción)
alter table public.reviews drop column if exists author_email;
