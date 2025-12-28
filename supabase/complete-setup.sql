-- ============================================
-- ROYALE SATIŞ - COMPLETE DATABASE SETUP
-- ============================================
-- Bu dosyayı Supabase SQL Editor'de çalıştırın
-- Tüm tablolar, politikalar ve test verileri oluşturulacak

-- ============================================
-- 1. TABLOLAR
-- ============================================

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  banner_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Homepage Banner table
CREATE TABLE IF NOT EXISTS homepage_banner (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  banner_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Items table
CREATE TABLE IF NOT EXISTS items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  stats JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  payment_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  iyzico_payment_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_items_category_id ON items(category_id);
CREATE INDEX IF NOT EXISTS idx_items_slug ON items(slug);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_item_id ON order_items(item_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- ============================================
-- 3. FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_items_updated_at ON items;
CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_homepage_banner_updated_at ON homepage_banner;
CREATE TRIGGER update_homepage_banner_updated_at BEFORE UPDATE ON homepage_banner
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_banner ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
DROP POLICY IF EXISTS "Homepage banner viewable by everyone" ON homepage_banner;
DROP POLICY IF EXISTS "Items are viewable by everyone" ON items;
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Users can create own orders" ON orders;
DROP POLICY IF EXISTS "Admins can update orders" ON orders;
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;
DROP POLICY IF EXISTS "Users can create order items for own orders" ON order_items;

-- Categories: Public read access
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

-- Homepage banner: Public read access
CREATE POLICY "Homepage banner viewable by everyone" ON homepage_banner
  FOR SELECT USING (true);

-- Items: Public read access
CREATE POLICY "Items are viewable by everyone" ON items
  FOR SELECT USING (true);

-- User profiles: Users can view their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Orders: Users can view their own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order items: Users can view items of their own orders
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items for own orders" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

-- ============================================
-- 5. INITIAL DATA
-- ============================================

-- Insert initial categories
INSERT INTO categories (name, slug, description) VALUES
  ('Metin2', 'metin2', 'Metin2 oyunu için item ve yang satışı'),
  ('Royale Online', 'royale-online', 'Royale Online oyunu için item ve yang satışı')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 6. TEST DATA (ÜRÜNLER)
-- ============================================

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

-- ============================================
-- TAMAMLANDI!
-- ============================================
-- Artık:
-- ✅ Tüm tablolar oluşturuldu
-- ✅ RLS politikaları ayarlandı
-- ✅ Test ürünleri eklendi
-- ✅ Kategoriler oluşturuldu
