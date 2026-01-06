import { createClient } from '@/lib/supabase/server'
import ItemForm from '@/components/admin/ItemForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function NewItemPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  return (
    <div className="py-4">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">Yeni Ürün Ekle</h2>
          <Link
            href="/admin/items"
            className="inline-flex items-center rounded-md bg-[#252830] px-4 py-2 text-sm font-semibold text-gray-200 shadow-sm hover:bg-[#2a2d35] border border-gray-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri
          </Link>
        </div>
        <ItemForm categories={categories || []} />
      </div>
    </div>
  )
}

