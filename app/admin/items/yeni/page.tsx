import { createClient } from '@/lib/supabase/server'
import ItemForm from '@/components/admin/ItemForm'

export default async function NewItemPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-8">Yeni Ürün Ekle</h1>
      <ItemForm categories={categories || []} />
    </div>
  )
}

