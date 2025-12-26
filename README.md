# Royale Satış - Epin Sitesi

Metin2 ve Royale Online için item ve yang satış platformu. Next.js, Supabase ve Tailwind CSS ile geliştirilmiştir.

## Özellikler

- ✅ Kullanıcı giriş/kayıt sistemi
- ✅ Kategori bazlı ürün listeleme (Metin2, Royale Online)
- ✅ Ürün detay sayfaları
- ✅ Sepet sistemi
- ✅ Ödeme akışı (İyzico dummy entegrasyonu)
- ✅ Kullanıcı paneli (Siparişlerim, Profil)
- ✅ Admin paneli (Ürün, Sipariş, Kullanıcı yönetimi)

## Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Environment Variables

`.env.local` dosyası oluşturun:

```env
NEXT_PUBLIC_SUPABASE_URL=https://gloccxayifghbiilgzbo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
SUPABASE_SERVICE_ROLE_KEY=sb_secret_C7k0gYjrxdUgcu-u0STS9A_QvzZwb5V

# İyzico Dummy Keys
IYZICO_API_KEY=YOUR_IYZICO_API_KEY
IYZICO_SECRET_KEY=YOUR_IYZICO_SECRET_KEY
IYZICO_BASE_URL=https://sandbox-api.iyzipay.com
```

### 3. Supabase Database Kurulumu

Supabase dashboard'da SQL Editor'ü açın ve `supabase/schema.sql` dosyasındaki SQL'i çalıştırın.

### 4. Development Server'ı Başlatın

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## Proje Yapısı

```
/app
  /(auth)          # Giriş/Kayıt sayfaları
  /(public)        # Public sayfalar
  /(protected)    # Kullanıcı sayfaları
  /admin           # Admin paneli
  /api             # API routes
/components        # React componentleri
/contexts          # Context providers
/lib               # Utility fonksiyonları
/types             # TypeScript type tanımları
/supabase          # Database şeması
```

## Kullanım

### Admin Kullanıcı Oluşturma

Supabase SQL Editor'de:

```sql
-- Kullanıcı ID'sini değiştirin
UPDATE user_profiles 
SET role = 'admin' 
WHERE user_id = 'USER_ID_HERE';
```

### İlk Kategoriler

Database şeması çalıştırıldığında Metin2 ve Royale Online kategorileri otomatik olarak oluşturulur.

## Teknolojiler

- **Next.js 16** - React framework
- **Supabase** - Backend (Auth + Database)
- **Tailwind CSS** - Styling
- **İyzico** - Ödeme entegrasyonu (Dummy)

## Notlar

- İyzico entegrasyonu şu an dummy modda çalışmaktadır
- Gerçek ödeme için İyzico API key'lerini `.env.local` dosyasına eklemeniz gerekmektedir
- Supabase Anon Key'i `.env.local` dosyasına eklemeyi unutmayın
