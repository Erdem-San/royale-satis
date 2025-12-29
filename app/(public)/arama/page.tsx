import { createClient } from '@/lib/supabase/server'
import ItemCard from '@/components/item/ItemCard'
import Link from 'next/link'

interface SearchPageProps {
    searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q } = await searchParams
    const supabase = await createClient()

    if (!q || q.trim() === '') {
        return (
            <div className="min-h-screen bg-[#1a1b1e] py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-800/50 mb-6">
                            <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-3">Arama</h1>
                        <p className="text-gray-400 text-lg mb-8">Lütfen bir arama terimi girin.</p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Ana Sayfaya Dön
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    const { data: items, error } = await supabase
        .from('items')
        .select(`
      *,
      categories(*)
    `)
        .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen bg-[#1a1b1e] py-8">
            <div className="container mx-auto px-4">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
                    <Link href="/" className="hover:text-green-500 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </Link>
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-white font-medium">Arama Sonuçları</span>
                </nav>

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <h1 className="text-3xl font-bold text-white">
                            Arama Sonuçları
                        </h1>
                        {items && items.length > 0 && (
                            <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm font-semibold border border-green-600/30">
                                {items.length} sonuç
                            </span>
                        )}
                    </div>
                    <p className="text-gray-400 text-lg">
                        <span className="text-gray-500">Aranan:</span>{' '}
                        <span className="text-white font-medium">"{q}"</span>
                    </p>
                </div>

                {/* Results */}
                {error ? (
                    <div className="rounded-xl bg-red-900/20 border border-red-700/50 p-6">
                        <div className="flex items-start gap-3">
                            <svg className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <h3 className="text-red-300 font-semibold mb-1">Bir hata oluştu</h3>
                                <p className="text-red-200/80">{error.message}</p>
                            </div>
                        </div>
                    </div>
                ) : !items || items.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-800/50 mb-6">
                            <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">
                            Sonuç Bulunamadı
                        </h2>
                        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                            <span className="text-white font-medium">"{q}"</span> için herhangi bir ürün bulunamadı. Farklı bir arama terimi deneyin.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Ana Sayfaya Dön
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {items.map((item) => (
                            <ItemCard key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
