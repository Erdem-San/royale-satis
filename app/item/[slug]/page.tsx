import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import AddToCartButton from '@/components/item/AddToCartButton'

interface ItemPageProps {
  params: Promise<{ slug: string }>
}

export default async function ItemPage({ params }: ItemPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: item } = await supabase
    .from('items')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('slug', slug)
    .single()

  if (!item) {
    notFound()
  }

  const stats = item.stats as Record<string, any> | null

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-4">
          <nav className="text-sm text-gray-400">
            <a href="/" className="hover:text-white">Anasayfa</a>
            {' > '}
            <a href={`/kategori/${item.category?.slug}`} className="hover:text-white">
              {item.category?.name}
            </a>
            {' > '}
            <span className="text-white">{item.name}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sol Panel - Item Görseli */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="aspect-square bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden mb-4">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-500 text-8xl">📦</div>
              )}
            </div>
          </div>

          {/* Sağ Panel - Item Bilgileri */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h1 className="text-3xl font-bold text-white mb-4">{item.name}</h1>
            
            {item.description && (
              <p className="text-gray-400 mb-6">{item.description}</p>
            )}

            {/* Item Stats */}
            {stats && Object.keys(stats).length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-4">Item Özellikleri</h2>
                <div className="space-y-2">
                  {Object.entries(stats).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-gray-300">
                      <span>{key}:</span>
                      <span className="text-green-400">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fiyat ve Stok */}
            <div className="border-t border-gray-700 pt-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400">Fiyat:</span>
                <span className="text-3xl font-bold text-green-400">
                  {item.price.toFixed(2)} ₺
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Stok:</span>
                <span className={`text-lg font-semibold ${item.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {item.stock > 0 ? `${item.stock} Adet` : 'Stokta Yok'}
                </span>
              </div>
            </div>

            {/* Sepete Ekle Butonu */}
            <AddToCartButton item={item} />
          </div>
        </div>
      </div>
    </div>
  )
}

