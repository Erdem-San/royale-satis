import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ItemCard from '@/components/item/ItemCard'
import { Suspense } from 'react'

async function HomePageContent() {
  const supabase = await createClient()

  const { data: categoriesData } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  const categories = categoriesData as any[]

  // Anasayfa banner'ı al
  const { data: bannerData } = await supabase
    .from('homepage_banner')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const homepageBanner = bannerData as any

  // Öne çıkan ürünler - 8 adet rastgele ürün
  const { data: featuredItemsData } = await supabase
    .from('items')
    .select(`
  *,
  categories(
    name,
    slug
  )
    `)
    .limit(100) // İlk 100 ürünü al

  // Rastgele 8 ürün seç
  const allItems = featuredItemsData as any[]
  const shuffled = allItems?.sort(() => 0.5 - Math.random()) || []
  const featuredItems = shuffled.slice(0, 8)

  return (
    <div className="min-h-screen bg-[#1a1b1e]">

      {/* Container to center content */}
      <div className="container mx-auto px-4 py-6">

        {/* Breadcrumb - Badges style matching screenshot */}
        <div className="flex items-center gap-2 mb-4 text-[11px] font-bold text-gray-400">
          <Link href="/" className="px-3 py-1 bg-[#252830] rounded-lg hover:bg-gray-700 hover:text-white transition-colors">
            Anasayfa
          </Link>
          <span className="text-gray-600">&gt;</span>
          <div className="px-3 py-1 bg-[#252830] rounded-lg text-gray-300">
            Oyunlar
          </div>
        </div>

        {/* Hero Banner - Constrained Width & Rounded */}
        <div className="relative w-full h-[200px] md:h-[240px] rounded-lg overflow-hidden mb-6 shadow-2xl">
          {/* Background Image */}
          {homepageBanner?.banner_url ? (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${homepageBanner.banner_url})` }}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/10"></div>
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-[#1F2228] to-gray-900 border border-gray-800"></div>
          )}

          {/* Banner Content (Optional) */}
          {!homepageBanner?.banner_url && (
            <div className="relative h-full flex items-center justify-center z-10">
              <div className="text-center">
                <h1 className="text-4xl font-black text-white tracking-[0.2em] opacity-20 select-none">
                  ROYALE SATIŞ
                </h1>
              </div>
            </div>
          )}
        </div>

        {/* Page Title - Below Banner */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">
            {homepageBanner?.title || 'Royale Satış'}
          </h1>
          {homepageBanner?.subtitle && (
            <p className="text-gray-400 text-sm mt-1">{homepageBanner.subtitle}</p>
          )}
        </div>

        {/* Category Cards Grid - 4 Columns */}
        <div className="pb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories?.map((category) => (
              <Link
                key={category.id}
                href={`/kategori/${category.slug}`}
                className="group relative aspect-[4/4] overflow-hidden rounded-lg bg-gray-800 border border-gray-800 hover:border-gray-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Card Image */}
                {category.image_url ? (
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <span className="text-4xl">🎮</span>
                  </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90 transition-opacity duration-300" />

                {/* Card Content - Bottom Aligned */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-center">

                  {/* Game Icon/Logo Placeholder (if needed, or just text) */}
                  <div className="mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-lg md:text-xl font-bold text-white uppercase tracking-wider text-shadow-lg">
                      {category.name}
                    </h3>
                  </div>

                  {/* Subtitle / Action Line */}
                  <div className="h-0 group-hover:h-6 overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100">
                    <span className="text-xs text-green-400 font-medium">Hemen İncele &rarr;</span>
                  </div>

                </div>
              </Link>
            ))}

            {/* Fallback if no categories (Visualization purpose) */}
            {(!categories || categories.length === 0) && (
              <>
                {['Knight Online', 'Metin2', 'Valorant', 'CS2'].map((name, i) => (
                  <div key={i} className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-800 border border-gray-700">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <span className="text-white text-lg font-bold">{name}</span>
                    </div>
                  </div>
                ))}
              </>
            )}

          </div>
        </div>

        {/* Öne Çıkan Ürünler Section */}
        {featuredItems && featuredItems.length > 0 && (
          <div className="pb-16">
            {/* Section Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Öne Çıkan Ürünler</h2>
              <p className="text-gray-400 text-sm">En popüler ve özel seçilmiş ürünler</p>
            </div>

            {/* Featured Items Grid - Same as Category Page */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#1a1b1e] flex items-center justify-center">
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  )
}
