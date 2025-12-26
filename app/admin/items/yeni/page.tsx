import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/utils/auth'
import ItemForm from '@/components/admin/ItemForm'

export default async function NewItemPage() {
  const admin = await isAdmin()
  
  if (!admin) {
    redirect('/')
  }

  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-white mb-8">Yeni Ürün Ekle</h1>
        <ItemForm categories={categories || []} />
      </div>
    </div>
  )
}

