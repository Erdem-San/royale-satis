import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import DeleteItemForm from '@/components/admin/DeleteItemForm'

interface DeleteItemPageProps {
  params: Promise<{ id: string }>
}

export default async function DeleteItemPage({ params }: DeleteItemPageProps) {
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

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-8">Ürün Sil</h1>
      <DeleteItemForm item={item} />
    </div>
  )
}

