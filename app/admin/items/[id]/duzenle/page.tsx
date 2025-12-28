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
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-8">Ürün Düzenle</h1>
      <ItemForm categories={categories || []} item={item} />
    </div>
  )
}

