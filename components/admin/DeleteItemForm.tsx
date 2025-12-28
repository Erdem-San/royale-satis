'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface DeleteItemFormProps {
  item: any
}

export default function DeleteItemForm({ item }: DeleteItemFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`"${item.name}" ürününü silmek istediğinize emin misiniz?`)) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/admin/items/${item.id}`, {
        method: 'DELETE',
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
    <div className="bg-gray-800 rounded-lg p-6">
      <p className="text-white mb-4">
        <strong>{item.name}</strong> ürününü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
      </p>
      <div className="flex gap-4">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? 'Siliniyor...' : 'Evet, Sil'}
        </button>
        <Link
          href="/admin/items"
          className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
        >
          İptal
        </Link>
      </div>
    </div>
  )
}

