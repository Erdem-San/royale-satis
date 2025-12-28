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
            <div className="min-h-screen bg-[#1a1b1e] py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-white mb-4">Arama</h1>
                    <p className="text-gray-400">Lütfen bir arama terimi girin.</p>
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
                <nav className="text-sm text-gray-400 mb-6">
                    <Link href="/" className="hover:text-white">Anasayfa</Link>
                    {' > '}
                    <span className="text-white">Arama</span>
                </nav>

                <h1 className="text-3xl font-bold text-white mb-2">
                    Arama Sonuçları
                </h1>
                <p className="text-gray-400 mb-8">
                    "{q}" için {items?.length || 0} sonuç bulundu
                </p>

                {error ? (
                    <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
                        Bir hata oluştu: {error.message}
                    </div>
                ) : !items || items.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-400 text-lg mb-4">
                            "{q}" için sonuç bulunamadı.
                        </p>
                        <Link
                            href="/"
                            className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
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
