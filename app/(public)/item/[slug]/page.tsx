import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ItemActions from '@/components/item/ItemActions'

interface ItemPageProps {
    params: Promise<{ slug: string }>
}

export default async function ItemPage({ params }: ItemPageProps) {
    const { slug } = await params
    const supabase = await createClient()

    const { data: itemData } = await supabase
        .from('items')
        .select(`
      *,
      categories(*)
    `)
        .eq('slug', slug)
        .single()

    if (!itemData) {
        notFound()
    }

    const item = itemData as any
    const stats = item.stats as Record<string, any> | null

    return (
        <div className="min-h-screen bg-[#1a1b1e]">
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center gap-2 mb-4 text-[11px] font-bold text-gray-400">
                    <Link href="/" className="px-3 py-1 bg-[#252830] rounded-lg hover:bg-gray-700 hover:text-white transition-colors">
                        Anasayfa
                    </Link>
                    <span className="text-gray-600">&gt;</span>
                    {item.categories?.slug ? (
                        <>
                            <Link
                                href={`/kategori/${item.categories.slug}`}
                                className="px-3 py-1 bg-[#252830] rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
                            >
                                {item.categories.name}
                            </Link>
                            <span className="text-gray-600">&gt;</span>
                        </>
                    ) : null}
                    <div className="px-3 py-1 bg-[#252830] rounded-lg text-gray-300">
                        {item.name}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                    <div className="bg-[#252830] rounded-lg p-6 border border-gray-800">
                        <div className="aspect-[4/3.75] bg-gradient-to-br from-[#252830] to-[#1a1b1e] rounded-lg flex items-center justify-center overflow-hidden">
                            {item.image_url ? (
                                <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-gray-500 text-8xl">📦</div>
                            )}
                        </div>
                    </div>

                    <div className="bg-[#252830] rounded-lg p-6 border border-gray-800 flex flex-col h-full">
                        <h1 className="text-3xl font-bold text-white mb-4">{item.name}</h1>

                        {item.description && (
                            <p className="text-gray-400 mb-6">{item.description}</p>
                        )}

                        {stats && Object.keys(stats).length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-white mb-4">Item Özellikleri</h2>
                                <div className="space-y-2">
                                    {Object.entries(stats).map(([key, value]) => (
                                        <div key={key} className="flex justify-between text-gray-300">
                                            <span>{key}:</span>
                                            <span className="text-green-400">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="border-t border-gray-700 pt-6 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-gray-400">Fiyat:</span>
                                <span className="text-3xl font-bold text-green-400">
                                    {item.price.toFixed(2)} ₺
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">Stok:</span>
                                <span className={`text-lg font-semibold ${item.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {item.stock > 0 ? `${item.stock} Adet` : 'Stokta Yok'}
                                </span>
                            </div>
                        </div>

                        <ItemActions item={item} />
                    </div>
                </div>
            </div>
        </div>
    )
}
