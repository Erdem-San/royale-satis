'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Category } from '@/types/item'
import Link from 'next/link'

interface ItemFormProps {
  categories: Category[]
  item?: any
}

export default function ItemForm({ categories, item }: ItemFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: item?.name || '',
    slug: item?.slug || '',
    description: item?.description || '',
    category_id: item?.category_id || categories[0]?.id || '',
    price: item?.price || '',
    stock: item?.stock || '',
    image_url: item?.image_url || '',
    stats: item?.stats ? JSON.stringify(item.stats, null, 2) : '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let stats = null
      if (formData.stats.trim()) {
        try {
          stats = JSON.parse(formData.stats)
        } catch {
          alert('Stats JSON formatında olmalıdır')
          setLoading(false)
          return
        }
      }

      const url = item ? `/api/admin/items/${item.id}` : '/api/admin/items'
      const method = item ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          stats,
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      router.push('/admin/items')
      router.refresh()
    } catch (error: any) {
      alert('Bir hata oluştu: ' + error.message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6 space-y-4">
      <div>
        <label className="block text-gray-400 mb-2">Ürün Adı *</label>
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
          placeholder="urun-adi"
        />
      </div>

      <div>
        <label className="block text-gray-400 mb-2">Kategori *</label>
        <select
          required
          value={formData.category_id}
          onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-green-500"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-400 mb-2">Fiyat (₺) *</label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Stok *</label>
          <input
            type="number"
            required
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-green-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-400 mb-2">Görsel URL</label>
        <input
          type="url"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-green-500"
        />
      </div>

      <div>
        <label className="block text-gray-400 mb-2">Stats (JSON)</label>
        <textarea
          value={formData.stats}
          onChange={(e) => setFormData({ ...formData, stats: e.target.value })}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-green-500 font-mono text-sm"
          rows={6}
          placeholder='{"strength": 10, "defense": 5}'
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Kaydediliyor...' : item ? 'Güncelle' : 'Kaydet'}
        </button>
        <Link
          href="/admin/items"
          className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
        >
          İptal
        </Link>
      </div>
    </form>
  )
}

