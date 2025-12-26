import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Türkiye'nin En Büyük Oyuncu Pazarı
          </h1>
          <p className="text-gray-400 text-lg">
            Metin2 ve Royale Online için güvenilir item ve yang satış platformu
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {categories?.map((category) => (
            <Link
              key={category.id}
              href={`/kategori/${category.slug}`}
              className="group relative overflow-hidden rounded-lg bg-gray-800 border border-gray-700 hover:border-green-500 transition-all duration-300"
            >
              <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                {category.image_url ? (
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {category.name}
                    </h2>
                    <p className="text-gray-400">
                      {category.description || 'Item ve yang satışı'}
                    </p>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-white mb-2 group-hover:text-green-400 transition-colors">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-gray-400 mb-4">{category.description}</p>
                )}
                <div className="flex items-center text-green-400 font-medium">
                  Ürünleri Görüntüle
                  <svg
                    className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}

          {(!categories || categories.length === 0) && (
            <>
              <Link
                href="/kategori/metin2"
                className="group relative overflow-hidden rounded-lg bg-gray-800 border border-gray-700 hover:border-green-500 transition-all duration-300"
              >
                <div className="aspect-video bg-gradient-to-br from-purple-900 to-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">Metin2</h2>
                    <p className="text-gray-400">Item ve yang satışı</p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-white mb-2 group-hover:text-green-400 transition-colors">
                    Metin2
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Metin2 oyunu için item ve yang satışı
                  </p>
                  <div className="flex items-center text-green-400 font-medium">
                    Ürünleri Görüntüle
                    <svg
                      className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>

              <Link
                href="/kategori/royale-online"
                className="group relative overflow-hidden rounded-lg bg-gray-800 border border-gray-700 hover:border-green-500 transition-all duration-300"
              >
                <div className="aspect-video bg-gradient-to-br from-blue-900 to-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">Royale Online</h2>
                    <p className="text-gray-400">Item ve yang satışı</p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-white mb-2 group-hover:text-green-400 transition-colors">
                    Royale Online
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Royale Online oyunu için item ve yang satışı
                  </p>
                  <div className="flex items-center text-green-400 font-medium">
                    Ürünleri Görüntüle
                    <svg
                      className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
