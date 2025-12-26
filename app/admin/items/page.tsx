import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminItemsPage() {
  const supabase = await createClient()

  const { data: items, error } = await supabase
    .from('items')
    .select(`
      *,
      category:categories(*)
    `)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Ürün Yönetimi</h1>
          <Link
            href="/admin/items/yeni"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Yeni Ürün Ekle
          </Link>
        </div>

        {error ? (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded">
            Bir hata oluştu: {error.message}
          </div>
        ) : !items || items.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400 text-lg mb-4">Henüz ürün bulunmamaktadır.</p>
            <Link
              href="/admin/items/yeni"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              İlk Ürünü Ekle
            </Link>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-white font-semibold">Ürün Adı</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">Kategori</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">Fiyat</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">Stok</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: any) => (
                  <tr key={item.id} className="border-t border-gray-700">
                    <td className="px-4 py-3 text-white">{item.name}</td>
                    <td className="px-4 py-3 text-gray-400">{item.category?.name || '-'}</td>
                    <td className="px-4 py-3 text-green-400">{item.price.toFixed(2)} ₺</td>
                    <td className="px-4 py-3 text-gray-300">{item.stock}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/items/${item.id}/duzenle`}
                        className="text-blue-400 hover:text-blue-300 mr-3"
                      >
                        Düzenle
                      </Link>
                      <Link
                        href={`/admin/items/${item.id}/sil`}
                        className="text-red-400 hover:text-red-300"
                      >
                        Sil
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  )
}

