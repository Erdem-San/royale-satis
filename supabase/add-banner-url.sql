-- Kategorilere banner_url alanı ekle
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS banner_url TEXT;

-- Anasayfa banner için ayrı tablo
CREATE TABLE IF NOT EXISTS homepage_banner (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  banner_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS politikası
ALTER TABLE homepage_banner ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Homepage banner is viewable by everyone" ON homepage_banner
  FOR SELECT USING (is_active = true);

