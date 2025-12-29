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
      <Suspense fallback={
        <div className="bg-[#1F2125] rounded-lg border border-gray-700/50 p-6">
          <div className="flex items-center justify-center py-12">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-700"></div>
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-blue-500 absolute top-0 left-0"></div>
            </div>
          </div>
        </div>
      }>
        <CategoryData id={id} />
      </Suspense>
    </div>
  )
}
