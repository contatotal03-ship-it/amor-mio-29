-- ============================================================================
-- 29 CAPÍTULOS · ESQUEMA SEGURO DE SUPABASE (ANTI-SPOILERS & CONTROL TOTAL)
-- Pega y ejecuta todo este archivo en: Supabase -> SQL Editor -> Run
-- ============================================================================

-- 1. Tabla principal de las 30 cápsulas / cajas
CREATE TABLE IF NOT EXISTS public.capsules (
  day_number integer PRIMARY KEY CHECK (day_number >= 1 AND day_number <= 30),
  is_authorized boolean NOT NULL DEFAULT false,
  is_opened_by_her boolean NOT NULL DEFAULT false,
  is_favorite boolean NOT NULL DEFAULT false,
  teaser_title text NOT NULL DEFAULT '',
  unlocked_title text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  dynamic_type text NOT NULL DEFAULT 'classic',
  dynamic_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  dynamic_done boolean NOT NULL DEFAULT false,
  dynamic_answer text NOT NULL DEFAULT '',
  media_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  her_reply text NOT NULL DEFAULT '',
  opened_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Tabla de configuración pública de la experiencia (nombre, fecha, música, gran final)
CREATE TABLE IF NOT EXISTS public.app_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  her_name text NOT NULL DEFAULT 'Amor Mío',
  birthday_iso text NOT NULL DEFAULT '2026-12-12T00:00:00',
  app_title text NOT NULL DEFAULT '29 Capítulos',
  app_subtitle text NOT NULL DEFAULT 'Treinta días para recordarte por qué eres mi princesa y lo más hermoso de mi vida.',
  music_url text NOT NULL DEFAULT '',
  finale_enabled boolean NOT NULL DEFAULT false,
  finale_title text NOT NULL DEFAULT 'Nuestro Viaje Hacia tus 29',
  finale_dedication text NOT NULL DEFAULT 'Cada día contigo ha sido mi capítulo favorito. ¡Feliz cumpleaños, mi princesa!',
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Configuración privada (solo visible para ti cuando inicias sesión en Admin)
CREATE TABLE IF NOT EXISTS public.private_admin_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  telegram_bot_token text NOT NULL DEFAULT '',
  telegram_chat_id text NOT NULL DEFAULT '',
  whatsapp_phone text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Sembrar valores iniciales
INSERT INTO public.app_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.private_admin_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.capsules (day_number, teaser_title)
SELECT d, 'Un secreto espera tu momento...'
FROM generate_series(1, 30) AS d
ON CONFLICT (day_number) DO NOTHING;

-- 4. Habilitar Row Level Security (RLS)
ALTER TABLE public.capsules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.private_admin_settings ENABLE ROW LEVEL SECURITY;

-- Limpiar políticas previas si se re-ejecuta
DROP POLICY IF EXISTS "Admin full access capsules" ON public.capsules;
DROP POLICY IF EXISTS "Public read app_settings" ON public.app_settings;
DROP POLICY IF EXISTS "Admin write app_settings" ON public.app_settings;
DROP POLICY IF EXISTS "Admin full access private_settings" ON public.private_admin_settings;

-- IMPORTANTE: La plataforma pública (anon) NO tiene SELECT directo a capsules.
-- Solo el usuario autenticado (tú en Admin) puede leer/editar todas las cápsulas.
CREATE POLICY "Admin full access capsules"
  ON public.capsules
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public read app_settings"
  ON public.app_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin write app_settings"
  ON public.app_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin full access private_settings"
  ON public.private_admin_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 5. RPC Segura para la plataforma de ELLA:
--    Solo devuelve contenido real si is_authorized = true.
--    Si is_authorized = false, devuelve NULL en todo el contenido secreto.
CREATE OR REPLACE FUNCTION public.get_her_capsules()
RETURNS TABLE (
  day_number integer,
  is_authorized boolean,
  is_opened_by_her boolean,
  is_favorite boolean,
  teaser_title text,
  unlocked_title text,
  message text,
  dynamic_type text,
  dynamic_payload jsonb,
  dynamic_done boolean,
  dynamic_answer text,
  media_items jsonb,
  her_reply text,
  opened_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    c.day_number,
    c.is_authorized,
    CASE WHEN c.is_authorized THEN c.is_opened_by_her ELSE false END,
    CASE WHEN c.is_authorized THEN c.is_favorite ELSE false END,
    c.teaser_title,
    CASE WHEN c.is_authorized THEN c.unlocked_title ELSE NULL END,
    CASE WHEN c.is_authorized THEN c.message ELSE NULL END,
    CASE WHEN c.is_authorized THEN c.dynamic_type ELSE NULL END,
    CASE WHEN c.is_authorized THEN c.dynamic_payload ELSE NULL END,
    CASE WHEN c.is_authorized THEN c.dynamic_done ELSE false END,
    CASE WHEN c.is_authorized THEN c.dynamic_answer ELSE NULL END,
    CASE WHEN c.is_authorized THEN c.media_items ELSE '[]'::jsonb END,
    CASE WHEN c.is_authorized THEN c.her_reply ELSE NULL END,
    CASE WHEN c.is_authorized THEN c.opened_at ELSE NULL END
  FROM public.capsules c
  ORDER BY c.day_number ASC;
$$;

GRANT EXECUTE ON FUNCTION public.get_her_capsules() TO anon, authenticated;

-- 6. RPC Segura para que ELLA interactúe con una cápsula YA autorizada
--    (abrir sello, guardar favorito, responder dinámica, dejar mensaje)
CREATE OR REPLACE FUNCTION public.her_interact_capsule(
  p_day integer,
  p_opened boolean DEFAULT NULL,
  p_favorite boolean DEFAULT NULL,
  p_dynamic_done boolean DEFAULT NULL,
  p_dynamic_answer text DEFAULT NULL,
  p_her_reply text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.capsules
  SET
    is_opened_by_her = COALESCE(p_opened, is_opened_by_her),
    opened_at = CASE WHEN p_opened = true AND opened_at IS NULL THEN now() ELSE opened_at END,
    is_favorite = COALESCE(p_favorite, is_favorite),
    dynamic_done = COALESCE(p_dynamic_done, dynamic_done),
    dynamic_answer = COALESCE(p_dynamic_answer, dynamic_answer),
    her_reply = COALESCE(p_her_reply, her_reply),
    updated_at = now()
  WHERE day_number = p_day
    AND is_authorized = true;

  RETURN FOUND;
END;
$$;

GRANT EXECUTE ON FUNCTION public.her_interact_capsule(integer, boolean, boolean, boolean, text, text) TO anon, authenticated;

-- 7. Realtime para que cuando tú autorices un día desde tu celular,
--    la pantalla de ella brille y se actualice al instante
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'capsules'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.capsules;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'app_settings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.app_settings;
  END IF;
END $$;

-- 8. Bucket de Storage para Fotos, Videos y Audios ("memories")
INSERT INTO storage.buckets (id, name, public)
VALUES ('memories', 'memories', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read memories" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload memories" ON storage.objects;
DROP POLICY IF EXISTS "Admin update memories" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete memories" ON storage.objects;

CREATE POLICY "Public read memories"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'memories');

CREATE POLICY "Admin upload memories"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'memories');

CREATE POLICY "Admin update memories"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'memories');

CREATE POLICY "Admin delete memories"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'memories');

