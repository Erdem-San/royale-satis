'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface HomepageBannerFormProps {
  banner?: any
}

export default function HomepageBannerForm({ banner }: HomepageBannerFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: banner?.title || 'ROYALE SATIŞ',
    subtitle: banner?.subtitle || 'Metin2 ve Royale Online için güvenilir item ve yang satış platformu',
    banner_url: banner?.banner_url || '',
    is_active: banner?.is_active !== undefined ? banner.is_active : true,
  })

  const handleFileUpload = async (file: File) => {
    setUploading(true)
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

      setFormData(prev => ({ ...prev, banner_url: data.url }))
      setUploading(false)
    } catch (error: any) {
      alert('Resim yükleme hatası: ' + error.message)
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDeleteImage = () => {
    setFormData(prev => ({ ...prev, banner_url: '' }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = banner ? `/api/admin/homepage-banner/${banner.id}` : '/api/admin/homepage-banner'
      const method = banner ? 'PUT' : 'POST'

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

      router.push('/admin')
      router.refresh()
    } catch (error: any) {
      alert('Bir hata oluştu: ' + error.message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#252830] rounded-lg p-6 space-y-4 border border-gray-800">
      <div>
        <label className="block text-gray-400 mb-2">Başlık *</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-green-500"
          placeholder="ROYALE SATIŞ"
        />
      </div>

      <div>
        <label className="block text-gray-400 mb-2">Alt Başlık</label>
        <textarea
          value={formData.subtitle}
          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-green-500"
          rows={2}
          placeholder="Metin2 ve Royale Online için güvenilir item ve yang satış platformu"
        />
      </div>

      <div>
        <label className="block text-gray-400 mb-2">Banner Görseli</label>
        
        {/* Dosya Yükleme */}
        <div className="mb-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="banner-upload"
            disabled={uploading}
          />
          <label
            htmlFor="banner-upload"
            className={`inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {uploading ? 'Yükleniyor...' : formData.banner_url ? 'Resmi Değiştir' : 'Resim Yükle'}
          </label>
          {formData.banner_url && (
            <button
              type="button"
              onClick={handleDeleteImage}
              className="ml-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Resmi Sil
            </button>
          )}
        </div>

        {/* Manuel URL Girişi */}
        <div className="mb-2">
          <input
            type="url"
            value={formData.banner_url}
            onChange={(e) => setFormData({ ...formData, banner_url: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-green-500"
            placeholder="Veya resim URL'si yapıştırın"
          />
        </div>

        {/* Önizleme */}
        {formData.banner_url && (
          <div className="mt-4">
            <p className="text-gray-400 text-sm mb-2">Önizleme:</p>
            <div className="relative h-48 rounded-lg overflow-hidden border border-gray-600">
              <img
                src={formData.banner_url}
                alt="Banner Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">{formData.title}</h3>
                  {formData.subtitle && (
                    <p className="text-gray-300">{formData.subtitle}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_active"
          checked={formData.is_active}
          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
          className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded-lg focus:ring-green-500"
        />
        <label htmlFor="is_active" className="text-gray-400">
          Aktif (Anasayfada göster)
        </label>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Kaydediliyor...' : banner ? 'Güncelle' : 'Kaydet'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
        >
          İptal
        </button>
      </div>
    </form>
  )
}


