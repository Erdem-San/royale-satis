import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import CategoryForm from '@/components/admin/CategoryForm'
import { Suspense } from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

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
    <div className="py-6">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">
            Kategori Düzenle
          </h2>
          <Link
            href="/admin/categories"
            className="inline-flex items-center rounded-md bg-[#252830] px-4 py-2 text-sm font-semibold text-gray-200 shadow-sm hover:bg-[#2a2d35] border border-gray-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri
          </Link>
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
    </div>
  )
}
