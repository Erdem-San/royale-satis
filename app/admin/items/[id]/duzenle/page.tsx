import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ItemForm from '@/components/admin/ItemForm'

interface EditItemPageProps {
  params: Promise<{ id: string }>
}

export default async function EditItemPage({ params }: EditItemPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: item } = await supabase
    .from('items')
    .select('*')
    .eq('id', id)
    .single()

  if (!item) {
    notFound()
  }

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  return (
    <div className="py-4">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
        <h2 className="text-2xl font-semibold text-white">Ürün Düzenle</h2>
        <ItemForm categories={categories || []} item={item} />
      </div>
    </div>
  )
}

