# 🚀 Activation du Système de Messaging dans Supabase

## Instructions

1. Ouvrir votre **Supabase Dashboard**
2. Aller dans **SQL Editor** (dans le menu de gauche)
3. Créer une **New Query**
4. Copier-coller les scripts ci-dessous **dans l'ordre**
5. Cliquer sur **Run** après chaque script

---

## ✅ Script 1 : Enhancements Messaging (OBLIGATOIRE)

**Ce que ça fait** : Crée la table typing_indicators, ajoute les colonnes pour images, crée les fonctions RPC

```sql
-- ============================================================================
-- MESSAGING ENHANCEMENTS ONLY
-- Run this directly via Supabase dashboard SQL editor
-- ============================================================================

-- ============================================================================
-- 1. CREATE TYPING INDICATORS TABLE (if not exists)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.typing_indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(conversation_id, user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_typing_indicators_conversation ON public.typing_indicators(conversation_id);
CREATE INDEX IF NOT EXISTS idx_typing_indicators_expires ON public.typing_indicators(expires_at);

-- Enable RLS
ALTER TABLE public.typing_indicators ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view typing indicators in own conversations" ON public.typing_indicators;
DROP POLICY IF EXISTS "Users can set own typing indicators" ON public.typing_indicators;
DROP POLICY IF EXISTS "Users can update own typing indicators" ON public.typing_indicators;
DROP POLICY IF EXISTS "Users can delete own typing indicators" ON public.typing_indicators;

-- RLS Policies
CREATE POLICY "Users can view typing indicators in own conversations"
  ON public.typing_indicators
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
      AND (c.participant1_id = auth.uid() OR c.participant2_id = auth.uid())
    )
  );

CREATE POLICY "Users can set own typing indicators"
  ON public.typing_indicators
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own typing indicators"
  ON public.typing_indicators
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own typing indicators"
  ON public.typing_indicators
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 2. ADD IMAGE SUPPORT TO MESSAGES (if not exists)
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'messages'
    AND column_name = 'image_url'
  ) THEN
    ALTER TABLE public.messages ADD COLUMN image_url TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'messages'
    AND column_name = 'image_width'
  ) THEN
    ALTER TABLE public.messages ADD COLUMN image_width INTEGER;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'messages'
    AND column_name = 'image_height'
  ) THEN
    ALTER TABLE public.messages ADD COLUMN image_height INTEGER;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'messages'
    AND column_name = 'message_type'
  ) THEN
    ALTER TABLE public.messages ADD COLUMN message_type TEXT DEFAULT 'text';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'messages'
    AND column_name = 'metadata'
  ) THEN
    ALTER TABLE public.messages ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'messages'
    AND column_name = 'read_by_recipient'
  ) THEN
    ALTER TABLE public.messages ADD COLUMN read_by_recipient BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- ============================================================================
-- 3. RPC FUNCTIONS FOR MESSAGING
-- ============================================================================

-- Drop existing functions if they exist (to avoid conflicts)
DROP FUNCTION IF EXISTS get_or_create_conversation(UUID, UUID, TEXT, UUID);
DROP FUNCTION IF EXISTS get_user_conversations(UUID);
DROP FUNCTION IF EXISTS send_message(UUID, UUID, TEXT, TEXT, JSONB, TEXT);
DROP FUNCTION IF EXISTS mark_conversation_read(UUID, UUID);
DROP FUNCTION IF EXISTS clean_expired_typing_indicators();

-- Function: Get or create conversation between two users
CREATE OR REPLACE FUNCTION get_or_create_conversation(
  p_user1_id UUID,
  p_user2_id UUID,
  p_context_type TEXT DEFAULT 'general',
  p_context_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_conversation_id UUID;
  v_participant1_id UUID;
  v_participant2_id UUID;
BEGIN
  -- Ensure participant1_id < participant2_id for consistency
  IF p_user1_id < p_user2_id THEN
    v_participant1_id := p_user1_id;
    v_participant2_id := p_user2_id;
  ELSE
    v_participant1_id := p_user2_id;
    v_participant2_id := p_user1_id;
  END IF;

  -- Try to find existing conversation
  SELECT id INTO v_conversation_id
  FROM public.conversations
  WHERE participant1_id = v_participant1_id
    AND participant2_id = v_participant2_id;

  -- If not found, create new conversation
  IF v_conversation_id IS NULL THEN
    INSERT INTO public.conversations (participant1_id, participant2_id)
    VALUES (v_participant1_id, v_participant2_id)
    RETURNING id INTO v_conversation_id;
  END IF;

  RETURN v_conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get user's conversations with details
CREATE OR REPLACE FUNCTION get_user_conversations(p_user_id UUID)
RETURNS TABLE (
  conversation_id UUID,
  other_user_id UUID,
  other_user_name TEXT,
  other_user_photo TEXT,
  last_message TEXT,
  last_message_at TIMESTAMPTZ,
  unread_count INTEGER,
  is_archived BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id AS conversation_id,
    CASE
      WHEN c.participant1_id = p_user_id THEN c.participant2_id
      ELSE c.participant1_id
    END AS other_user_id,
    CASE
      WHEN c.participant1_id = p_user_id THEN COALESCE(us2.full_name, 'User')
      ELSE COALESCE(us1.full_name, 'User')
    END AS other_user_name,
    CASE
      WHEN c.participant1_id = p_user_id THEN up2.profile_photo_url
      ELSE up1.profile_photo_url
    END AS other_user_photo,
    c.last_message_text AS last_message,
    c.last_message_at,
    (
      SELECT COUNT(*)::INTEGER
      FROM public.messages m
      WHERE m.conversation_id = c.id
        AND m.sender_id != p_user_id
        AND COALESCE(m.read_by_recipient, FALSE) = FALSE
    ) AS unread_count,
    FALSE AS is_archived
  FROM public.conversations c
  LEFT JOIN public.users us1 ON us1.id = c.participant1_id
  LEFT JOIN public.users us2 ON us2.id = c.participant2_id
  LEFT JOIN public.user_profiles up1 ON up1.user_id = c.participant1_id
  LEFT JOIN public.user_profiles up2 ON up2.user_id = c.participant2_id
  WHERE c.participant1_id = p_user_id OR c.participant2_id = p_user_id
  ORDER BY c.last_message_at DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Send message
CREATE OR REPLACE FUNCTION send_message(
  p_conversation_id UUID,
  p_sender_id UUID,
  p_content TEXT,
  p_message_type TEXT DEFAULT 'text',
  p_metadata JSONB DEFAULT '{}'::jsonb,
  p_image_url TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_message_id UUID;
BEGIN
  -- Insert message
  INSERT INTO public.messages (
    conversation_id,
    sender_id,
    content,
    message_type,
    metadata,
    image_url,
    read_by_recipient,
    created_at
  )
  VALUES (
    p_conversation_id,
    p_sender_id,
    p_content,
    p_message_type,
    p_metadata,
    p_image_url,
    FALSE,
    now()
  )
  RETURNING id INTO v_message_id;

  RETURN v_message_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Mark conversation as read
CREATE OR REPLACE FUNCTION mark_conversation_read(
  p_conversation_id UUID,
  p_user_id UUID
)
RETURNS void AS $$
BEGIN
  -- Mark all messages from other user as read
  UPDATE public.messages
  SET read_by_recipient = TRUE,
      read_at = now()
  WHERE conversation_id = p_conversation_id
    AND sender_id != p_user_id
    AND COALESCE(read_by_recipient, FALSE) = FALSE;

  -- Update or insert read status
  INSERT INTO public.conversation_read_status (conversation_id, user_id, last_read_at)
  VALUES (p_conversation_id, p_user_id, now())
  ON CONFLICT (conversation_id, user_id)
  DO UPDATE SET last_read_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean expired typing indicators
CREATE OR REPLACE FUNCTION clean_expired_typing_indicators()
RETURNS void AS $$
BEGIN
  DELETE FROM public.typing_indicators
  WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 4. GRANT PERMISSIONS
-- ============================================================================

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_or_create_conversation TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_conversations TO authenticated;
GRANT EXECUTE ON FUNCTION send_message TO authenticated;
GRANT EXECUTE ON FUNCTION mark_conversation_read TO authenticated;

SELECT 'Messaging enhancements applied successfully!' AS status;
```

---

## ✅ Script 2 : Storage Bucket pour Images (OBLIGATOIRE)

**Ce que ça fait** : Crée le bucket pour stocker les images des messages

```sql
-- ============================================================================
-- CREATE STORAGE BUCKET FOR MESSAGE IMAGES
-- Run this in Supabase dashboard SQL editor
-- ============================================================================

-- Create storage bucket for message images
INSERT INTO storage.buckets (id, name, public)
VALUES ('message-images', 'message-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can upload message images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view message images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own message images" ON storage.objects;

-- Policy: Users can upload their own images
CREATE POLICY "Users can upload message images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'message-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Anyone can view images (public bucket)
CREATE POLICY "Anyone can view message images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'message-images');

-- Policy: Users can delete their own images
CREATE POLICY "Users can delete own message images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'message-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

SELECT 'Message images storage bucket created successfully!' AS status;
```

---

## ✅ Vérification

Après avoir exécuté les 2 scripts, vérifiez que tout est OK :

### 1. Vérifier les tables
```sql
SELECT tablename FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('conversations', 'messages', 'typing_indicators');
```

Vous devriez voir 3 tables.

### 2. Vérifier les fonctions
```sql
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN (
  'get_or_create_conversation',
  'get_user_conversations',
  'send_message',
  'mark_conversation_read'
);
```

Vous devriez voir 4 fonctions.

### 3. Vérifier le bucket Storage
Aller dans **Storage** > **Buckets**

Vous devriez voir un bucket nommé `message-images` (public).

---

## 🎉 C'est terminé !

Le système de messaging est maintenant activé ! Vous pouvez :

- ✅ Envoyer des messages en temps réel
- ✅ Voir les typing indicators
- ✅ Uploader des images
- ✅ Recevoir des notifications sonores
- ✅ Voir les read receipts
- ✅ Voir qui est en ligne

---

## 🐛 En cas d'erreur

### Erreur "relation already exists"
C'est normal, le script gère déjà les éléments existants avec `IF NOT EXISTS`.

### Erreur "policy already exists"
Les scripts incluent maintenant des `DROP POLICY IF EXISTS` pour éviter ce problème.

### Erreur avec storage.objects
Assurez-vous que RLS est activé sur storage.objects (c'est fait dans le script 2).

---

## 📚 Documentation complète

Pour plus de détails, voir :
- [MESSAGING_SETUP.md](MESSAGING_SETUP.md) - Guide complet
- [SESSION_MESSAGING_30OCT2025.md](SESSION_MESSAGING_30OCT2025.md) - Résumé de session
