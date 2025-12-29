# Blog Sistemi Kurulum Rehberi

## 📋 Kurulum Adımları

### 1. Supabase Migration'ı Çalıştırın

Supabase Dashboard'a gidin ve SQL Editor'de şu dosyayı çalıştırın:
```
supabase/migrations/20250129_create_blog_tables.sql
```

**VEYA** Supabase CLI kullanıyorsanız:
```bash
supabase db push
```

### 2. Supabase Storage Bucket Oluşturun

Supabase Dashboard → Storage bölümüne gidin ve:

1. **"Create a new bucket"** butonuna tıklayın
2. Bucket adı: `images`
3. **Public bucket** olarak işaretleyin (✓)
4. **Create bucket** butonuna tıklayın

#### Storage Policies (Opsiyonel - Daha Güvenli)

Eğer bucket'ı private yapmak isterseniz, şu policy'leri ekleyin:

```sql
-- Public read access
CREATE POLICY "Public can read images" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

-- Authenticated users can upload
CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'images' AND
    auth.role() = 'authenticated'
  );

-- Authenticated users can update their uploads
CREATE POLICY "Authenticated users can update images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'images' AND
    auth.role() = 'authenticated'
  );

-- Authenticated users can delete their uploads
CREATE POLICY "Authenticated users can delete images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'images' AND
    auth.role() = 'authenticated'
  );
```

### 3. Environment Variables

`.env.local` dosyanızda Supabase credentials'larınızın olduğundan emin olun:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Paketleri Yükleyin

```bash
npm install
```

### 5. Development Server'ı Başlatın

```bash
npm run dev
```

## 🎯 Kullanım

### Public Sayfalar
- **Blog Listesi**: `http://localhost:3000/blog`
- **Blog Detay**: `http://localhost:3000/blog/[slug]`

### Admin Sayfalar
- **Blog Yazıları**: `http://localhost:3000/admin/blog/posts`
- **Yeni Yazı**: `http://localhost:3000/admin/blog/posts/create`
- **Yazı Düzenle**: `http://localhost:3000/admin/blog/posts/[id]/edit`
- **Kategoriler**: `http://localhost:3000/admin/blog/categories`

## 🎨 Özellikler

### ✅ Tamamlanan Özellikler

1. **Blog Posts CRUD**
   - ✓ Liste görünümü (filtreleme, arama, pagination)
   - ✓ Oluşturma
   - ✓ Düzenleme
   - ✓ Silme
   - ✓ Yayınlama/Taslak

2. **Categories CRUD**
   - ✓ Liste görünümü
   - ✓ Modal ile oluşturma/düzenleme
   - ✓ Silme

3. **Rich Text Editor**
   - ✓ React Quill entegrasyonu
   - ✓ Image upload desteği
   - ✓ Dark theme uyumlu

4. **Image Upload**
   - ✓ Supabase Storage entegrasyonu
   - ✓ Drag & drop desteği
   - ✓ Preview

5. **SEO**
   - ✓ Meta title, description, keywords
   - ✓ Custom slug
   - ✓ Excerpt

6. **Public Blog**
   - ✓ Blog listesi (pagination)
   - ✓ Blog detay sayfası
   - ✓ Responsive tasarım
   - ✓ Dark theme

## 🚀 Gelecek Özellikler (Opsiyonel)

- [ ] AI Content Generation (OpenRouter)
- [ ] Blog Settings
- [ ] Comments System
- [ ] Blog Analytics
- [ ] Related Posts
- [ ] Tags System
- [ ] Author Management

## 🎨 UI/UX

Tüm sayfalar **yang-satis** projesinin dark theme'ine uygun olarak tasarlanmıştır:
- Ana renk: `#1a1b1e`
- Card rengi: `#1F2228`
- Hover rengi: `#252830`
- Accent rengi: Indigo (`#6366f1`)

## 📝 Notlar

- Tüm admin sayfaları authentication gerektiriyor
- Image upload için Supabase Storage kullanılıyor
- RLS (Row Level Security) politikaları aktif
- Türkçe karakter desteği slug generation'da mevcut
