import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ItemCard from '@/components/item/ItemCard'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!category) {
    notFound()
  }

  const { data: items } = await supabase
    .from('items')
    .select('*')
    .eq('category_id', category.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-gray-400">{category.description}</p>
          )}
        </div>

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
  )
}

