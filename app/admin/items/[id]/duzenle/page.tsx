import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { isAdmin } from '@/lib/utils/auth'
import ItemForm from '@/components/admin/ItemForm'

interface EditItemPageProps {
  params: Promise<{ id: string }>
}

export default async function EditItemPage({ params }: EditItemPageProps) {
  const admin = await isAdmin()
  
  if (!admin) {
    redirect('/')
  }

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
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-white mb-8">Ürün Düzenle</h1>
        <ItemForm categories={categories || []} item={item} />
      </div>
    </div>
  )
}

