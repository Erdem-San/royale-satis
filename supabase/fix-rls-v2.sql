-- RLS politikası hatasını düzelt (infinite recursion sorunu)
-- Önce mevcut problemli politikaları kaldır
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;

-- Basitleştirilmiş politikalar (infinite recursion'ı önlemek için)
-- Admin kontrolü için service_role kullanılacak, RLS bypass edilecek
-- Normal kullanıcılar sadece kendi verilerini görebilir

-- User profiles: Sadece kendi profilini görebilir
-- (Admin işlemleri için service_role key kullanılacak)

-- Orders: Sadece kendi siparişlerini görebilir ve oluşturabilir
-- (Admin işlemleri için service_role key kullanılacak)

-- Order items: Sadece kendi siparişlerinin item'larını görebilir
-- (Admin işlemleri için service_role key kullanılacak)

