'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface CategoryFormProps {
  category?: any
}

export default function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const bannerFileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    image_url: category?.image_url || '',
    banner_url: category?.banner_url || '',
  })

  const handleFileUpload = async (file: File, type: 'image' | 'banner') => {
    if (type === 'image') {
      setUploading(true)
    } else {
      setUploadingBanner(true)
    }
    
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)

      const response = await fetch('/api/upload/category', {
        method: 'POST',
        body: formDataUpload,
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      if (type === 'image') {
        setFormData(prev => ({ ...prev, image_url: data.url }))
        setUploading(false)
      } else {
        setFormData(prev => ({ ...prev, banner_url: data.url }))
        setUploadingBanner(false)
      }
    } catch (error: any) {
      alert('Resim yükleme hatası: ' + error.message)
      if (type === 'image') {
        setUploading(false)
      } else {
        setUploadingBanner(false)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'banner') => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file, type)
    }
  }

  const handleDeleteImage = (type: 'image' | 'banner') => {
    if (type === 'image') {
      setFormData(prev => ({ ...prev, image_url: '' }))
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } else {
      setFormData(prev => ({ ...prev, banner_url: '' }))
      if (bannerFileInputRef.current) {
        bannerFileInputRef.current.value = ''
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = category ? `/api/admin/categories/${category.id}` : '/api/admin/categories'
      const method = category ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      router.push('/admin/categories')
      router.refresh()
    } catch (error: any) {
      alert('Bir hata oluştu: ' + error.message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6 space-y-4">
      <div>
        <label className="block text-gray-400 mb-2">Kategori Adı *</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-green-500"
        />
      </div>

      <div>
        <label className="block text-gray-400 mb-2">Slug *</label>
        <input
          type="text"
          required
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-green-500"
          placeholder="metin2"
        />
      </div>

      <div>
        <label className="block text-gray-400 mb-2">Açıklama</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-green-500"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-gray-400 mb-2">Kategori Kart Görseli</label>
        <p className="text-gray-500 text-sm mb-2">
          Anasayfadaki kategori kartında gösterilecek görsel
        </p>
        
        {/* Dosya Yükleme */}
        <div className="mb-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'image')}
            className="hidden"
            id="image-upload"
            disabled={uploading}
          />
          <label
            htmlFor="image-upload"
            className={`inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {uploading ? 'Yükleniyor...' : formData.image_url ? 'Resmi Değiştir' : 'Resim Yükle'}
          </label>
          {formData.image_url && (
            <button
              type="button"
              onClick={() => handleDeleteImage('image')}
              className="ml-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Resmi Sil
            </button>
          )}
        </div>

        {/* Manuel URL Girişi (Alternatif) */}
        <div className="mb-2">
          <input
            type="url"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-green-500"
            placeholder="Veya resim URL'si yapıştırın"
          />
        </div>

        {/* Önizleme */}
        {formData.image_url && (
          <div className="mt-4">
            <p className="text-gray-400 text-sm mb-2">Önizleme:</p>
            <div className="relative">
              <img
                src={formData.image_url}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg border border-gray-600"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-gray-400 mb-2">Kategori Banner Görseli</label>
        <p className="text-gray-500 text-sm mb-2">
          Kategori sayfasındaki hero banner için kullanılacak görsel (kart görselinden farklı olabilir)
        </p>
        
        {/* Banner Dosya Yükleme */}
        <div className="mb-4">
          <input
            ref={bannerFileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'banner')}
            className="hidden"
            id="banner-upload"
            disabled={uploadingBanner}
          />
          <label
            htmlFor="banner-upload"
            className={`inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer ${uploadingBanner ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {uploadingBanner ? 'Yükleniyor...' : formData.banner_url ? 'Banner Değiştir' : 'Banner Yükle'}
          </label>
          {formData.banner_url && (
            <button
              type="button"
              onClick={() => handleDeleteImage('banner')}
              className="ml-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Banner Sil
            </button>
          )}
        </div>

        {/* Banner URL Girişi */}
        <div className="mb-2">
          <input
            type="url"
            value={formData.banner_url}
            onChange={(e) => setFormData({ ...formData, banner_url: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-green-500"
            placeholder="Veya banner görsel URL'si yapıştırın"
          />
        </div>

        {/* Banner Önizleme */}
        {formData.banner_url && (
          <div className="mt-4">
            <p className="text-gray-400 text-sm mb-2">Banner Önizleme:</p>
            <div className="relative">
              <img
                src={formData.banner_url}
                alt="Banner Preview"
                className="w-full h-32 object-cover rounded-lg border border-gray-600"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Kaydediliyor...' : category ? 'Güncelle' : 'Kaydet'}
        </button>
        <Link
          href="/admin/categories"
          className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
        >
          İptal
        </Link>
      </div>
    </form>
  )
}

