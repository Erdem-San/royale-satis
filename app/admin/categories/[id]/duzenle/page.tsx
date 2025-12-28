import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import CategoryForm from '@/components/admin/CategoryForm'
import { Suspense } from 'react'

interface EditCategoryPageProps {
  params: Promise<{ id: string }>
}

async function CategoryData({ id }: { id: string }) {
  const supabase = await createClient()

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (!category) {
    notFound()
  }

  return <CategoryForm category={category} />
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Kategori Düzenle</h1>
      </div>
      <Suspense fallback={<div className="bg-gray-800 rounded-lg p-6"><p className="text-gray-400">Yükleniyor...</p></div>}>
        <CategoryData id={id} />
      </Suspense>
    </div>
  )
}
