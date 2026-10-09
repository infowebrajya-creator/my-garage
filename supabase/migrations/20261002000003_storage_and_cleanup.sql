-- ============================================================================
-- MIGRATION 03: PRIVATE SUPABASE STORAGE & OBJECT POLICIES
-- ============================================================================

-- Create Private Storage Bucket for Vehicle Documents (if not existing)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'vehicle-documents',
  'vehicle-documents',
  FALSE, -- Private Bucket!
  10485760, -- 10MB Max File Size
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = FALSE,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']::text[];

-- Enable RLS on Storage Objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 1. STORAGE SELECT POLICY: Account members can view/download document files
CREATE POLICY "Storage SELECT: Account members view documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'vehicle-documents' AND
    public.is_account_member((storage.foldername(name))[1]::uuid, 'viewer')
  );

-- 2. STORAGE INSERT POLICY: Account members can upload document files
CREATE POLICY "Storage INSERT: Account members upload documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'vehicle-documents' AND
    public.is_account_member((storage.foldername(name))[1]::uuid, 'member')
  );

-- 3. STORAGE UPDATE POLICY: Account members can replace document files
CREATE POLICY "Storage UPDATE: Account members update documents"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'vehicle-documents' AND
    public.is_account_member((storage.foldername(name))[1]::uuid, 'member')
  );

-- 4. STORAGE DELETE POLICY: Account members can delete document files
CREATE POLICY "Storage DELETE: Account members delete documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'vehicle-documents' AND
    public.is_account_member((storage.foldername(name))[1]::uuid, 'member')
  );

-- 5. AUDIT LOG TRIGGER FOR DOCUMENT UPLOADS
CREATE OR REPLACE FUNCTION public.log_document_storage_action()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (account_id, user_id, action, entity_type, details)
    VALUES (
      (storage.foldername(NEW.name))[1]::uuid,
      auth.uid(),
      'DOCUMENT_FILE_UPLOADED',
      'storage_object',
      jsonb_build_object('path', NEW.name, 'size', NEW.metadata->>'size')
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_log_storage_upload ON storage.objects;
CREATE TRIGGER trg_log_storage_upload
  AFTER INSERT ON storage.objects
  FOR EACH ROW EXECUTE FUNCTION public.log_document_storage_action();
