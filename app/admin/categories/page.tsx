import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminCategoriesPage() {
  const supabase = await createClient()

  const { data: categories, error } = await supabase
    .from('categories')
    .select(`
      *,
      items:items(count)
    `)
    .order('name')

  // Her kategorideki ürün sayısını hesapla
  const categoriesWithCount = await Promise.all(
    (categories || []).map(async (cat: any) => {
      const { count } = await supabase
        .from('items')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', cat.id)
      
      return {
        ...cat,
        itemCount: count || 0
      }
    })
  )

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Kategoriler {categoriesWithCount.length > 0 && `(${categoriesWithCount.length})`}
            </h1>
            <p className="text-gray-400">
              Ürünlerinizi düzenleyin ve sergilenme şeklini yönetin.
            </p>
          </div>
        </div>
      </div>

        {error ? (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
            Bir hata oluştu: {error.message}
          </div>
        ) : !categoriesWithCount || categoriesWithCount.length === 0 ? (
          <div className="bg-[#252830] rounded-lg p-8 text-center border border-gray-800">
            <p className="text-gray-400 text-lg mb-4">Henüz kategori bulunmamaktadır.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoriesWithCount.map((category: any) => (
              <div key={category.id} className="bg-[#252830] rounded-lg overflow-hidden border border-gray-800 hover:border-green-500 transition-colors">
                {/* Görsel */}
                <div className="relative aspect-[4/3] bg-gray-700 overflow-hidden">
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-500 text-4xl">📦</span>
                    </div>
                  )}
                  {/* Aktif badge */}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 bg-green-600 text-white text-xs font-semibold rounded-lg">
                      AKTİF
                    </span>
                  </div>
                  {/* Menü ikonu */}
                  <div className="absolute top-2 right-2">
                    <button className="w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* İçerik */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-1">{category.name}</h3>
                  {category.description && (
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{category.description}</p>
                  )}
                  
                  {/* Ürün sayısı */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400 text-sm">
                      {category.itemCount} ürün
                    </span>
                  </div>

                  {/* İşlem butonları */}
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/categories/${category.id}/duzenle`}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm text-center"
                    >
                      Düzenle
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  )
}

