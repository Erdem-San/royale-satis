-- Supabase Storage bucket oluştur
-- Bu SQL'i Supabase SQL Editor'de çalıştırın

-- Categories için storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('category-images', 'category-images', true)
ON CONFLICT (id) DO NOTHING;

-- Items için storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('item-images', 'item-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies - Herkes okuyabilir, sadece admin yazabilir
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id IN ('category-images', 'item-images'));

-- Admin yazma yetkisi (service_role key ile yapılacak, burada sadece public read)



