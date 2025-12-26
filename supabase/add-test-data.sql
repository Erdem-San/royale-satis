-- Test ürünleri ekle
-- Önce kategori ID'lerini alalım
DO $$
DECLARE
  metin2_id UUID;
  royale_id UUID;
BEGIN
  -- Kategori ID'lerini al
  SELECT id INTO metin2_id FROM categories WHERE slug = 'metin2';
  SELECT id INTO royale_id FROM categories WHERE slug = 'royale-online';

  -- Metin2 ürünleri
  INSERT INTO items (category_id, name, slug, description, price, stock, stats) VALUES
    (metin2_id, 'Metin2 Yang 100M', 'metin2-yang-100m', 'Metin2 oyunu için 100 milyon yang', 50.00, 100, '{"amount": "100M", "type": "yang"}'::jsonb),
    (metin2_id, 'Metin2 Yang 500M', 'metin2-yang-500m', 'Metin2 oyunu için 500 milyon yang', 200.00, 50, '{"amount": "500M", "type": "yang"}'::jsonb),
    (metin2_id, 'Metin2 Yang 1B', 'metin2-yang-1b', 'Metin2 oyunu için 1 milyar yang', 350.00, 30, '{"amount": "1B", "type": "yang"}'::jsonb),
    (metin2_id, 'Metin2 Kılıç +9', 'metin2-kilich-9', 'Metin2 oyunu için +9 kılıç', 150.00, 10, '{"level": "+9", "type": "weapon"}'::jsonb),
    (metin2_id, 'Metin2 Zırh Seti', 'metin2-zirh-seti', 'Metin2 oyunu için zırh seti', 250.00, 5, '{"type": "armor", "set": true}'::jsonb)
  ON CONFLICT (slug) DO NOTHING;

  -- Royale Online ürünleri
  INSERT INTO items (category_id, name, slug, description, price, stock, stats) VALUES
    (royale_id, 'Royale Online Yang 50M', 'royale-yang-50m', 'Royale Online oyunu için 50 milyon yang', 40.00, 100, '{"amount": "50M", "type": "yang"}'::jsonb),
    (royale_id, 'Royale Online Yang 200M', 'royale-yang-200m', 'Royale Online oyunu için 200 milyon yang', 150.00, 50, '{"amount": "200M", "type": "yang"}'::jsonb),
    (royale_id, 'Royale Online Yang 500M', 'royale-yang-500m', 'Royale Online oyunu için 500 milyon yang', 300.00, 30, '{"amount": "500M", "type": "yang"}'::jsonb),
    (royale_id, 'Royale Online Silah +8', 'royale-silah-8', 'Royale Online oyunu için +8 silah', 120.00, 15, '{"level": "+8", "type": "weapon"}'::jsonb),
    (royale_id, 'Royale Online Ekipman Seti', 'royale-ekipman-seti', 'Royale Online oyunu için ekipman seti', 200.00, 8, '{"type": "equipment", "set": true}'::jsonb)
  ON CONFLICT (slug) DO NOTHING;
END $$;

