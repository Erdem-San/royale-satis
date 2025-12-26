import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ItemCard from '@/components/item/ItemCard'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: categoryData } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  const category = categoryData as any

  if (!category) {
    notFound()
  }

  const { data: itemsData } = await supabase
    .from('items')
    .select('*')
    .eq('category_id', category.id)
    .order('created_at', { ascending: false })

  const items = itemsData as any[]

  // Banner gradient renkleri kategoriye göre
  const bannerGradient = slug === 'metin2'
    ? 'from-purple-900 via-purple-800 to-gray-900'
    : 'from-blue-900 via-blue-800 to-gray-900'

  // Banner URL varsa onu kullan, yoksa image_url, yoksa gradient
  const bannerImage = category.banner_url || category.image_url

  return (
    <div className="min-h-screen bg-[#1a1b1e]">

      {/* Container to center content */}
      <div className="container mx-auto px-4 py-4">

        {/* Breadcrumb - Badges style matching screenshot */}
        <div className="flex items-center gap-2 mb-4 text-[11px] font-bold text-gray-400">
          <Link href="/" className="px-3 py-1 bg-[#252830] rounded hover:bg-gray-700 hover:text-white transition-colors">
            Anasayfa
          </Link>
          <span className="text-gray-600">&gt;</span>
          <Link href="/" className="px-3 py-1 bg-[#252830] rounded hover:bg-gray-700 hover:text-white transition-colors">
            Oyunlar
          </Link>
          <span className="text-gray-600">&gt;</span>
          <div className="px-3 py-1 bg-[#252830] rounded text-gray-300">
            {category.name}
          </div>
        </div>

        {/* Hero Banner - Constrained Width & Rounded */}
        <div className="relative w-full h-[200px] md:h-[240px] rounded-lg overflow-hidden mb-6 shadow-2xl">
          {/* Background Image - banner_url öncelikli */}
          {bannerImage ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${bannerImage})` }}
            />
          ) : null}
          <div className={`absolute inset-0 bg-gradient-to-r ${bannerGradient} ${bannerImage ? 'opacity-80' : 'opacity-100'}`}></div>
          <div className="absolute inset-0 bg-black/40"></div>

          {/* Banner Text (Only if no image, or centered title needed inside banner? Screenshot shows title BELOW banner usually) 
              Actually, GameSatış internal pages often have the Title INSIDE the banner if it's a game page. 
              But user requested "same way" as homepage. Homepage has Title BELOW banner. 
              I will put Title BELOW banner to be consistent with Homepage request.
          */}
          <div className="relative h-full flex items-center justify-center z-10">
            {/* Optional: We can put a big stylistic logo text inside if we want, like the homepage */}
            <h1 className="text-4xl font-black text-white tracking-[0.2em] opacity-20 select-none uppercase">
              {category.name}
            </h1>
          </div>
        </div>

        {/* Page Title - Below Banner */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-gray-400 text-sm mt-1">
              {category.description}
            </p>
          )}
        </div>

        {/* Products Grid */}
        <div className="pb-16">
          {items && items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">
                Bu kategoride henüz ürün bulunmamaktadır.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

