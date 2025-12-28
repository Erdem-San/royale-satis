import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Suspense } from 'react'

async function DashboardStats() {
    const supabase = await createClient()

    const [itemsCount, ordersCount, usersCount] = await Promise.all([
        supabase.from('items').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase.from('user_profiles').select('id', { count: 'exact', head: true }),
    ])

    return (
        <div className="overflow-hidden shadow-sm sm:rounded-lg border border-gray-700/50 bg-[#1F2125]">
            <div className="p-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Link
                        href="/admin/items"
                        className="bg-gradient-to-br from-emerald-600/20 to-teal-500/20 rounded-lg p-6 hover:shadow-lg transition-all border border-emerald-800 hover:border-emerald-500"
                    >
                        <h2 className="text-lg font-semibold text-gray-300 mb-2">Ürünler</h2>
                        <p className="text-3xl font-bold text-emerald-400">{itemsCount.count || 0}</p>
                    </Link>

                    <Link
                        href="/admin/orders"
                        className="bg-gradient-to-br from-blue-600/20 to-sky-500/20 rounded-lg p-6 hover:shadow-lg transition-all border border-blue-800 hover:border-blue-500"
                    >
                        <h2 className="text-lg font-semibold text-gray-300 mb-2">Siparişler</h2>
                        <p className="text-3xl font-bold text-blue-400">{ordersCount.count || 0}</p>
                    </Link>

                    <Link
                        href="/admin/users"
                        className="bg-gradient-to-br from-orange-600/20 to-amber-500/20 rounded-lg p-6 hover:shadow-lg transition-all border border-orange-800 hover:border-orange-500"
                    >
                        <h2 className="text-lg font-semibold text-gray-300 mb-2">Kullanıcılar</h2>
                        <p className="text-3xl font-bold text-orange-400">{usersCount.count || 0}</p>
                    </Link>
                </div>

                {/* Quick Actions */}
                <div className="rounded-lg p-6 border border-gray-700/50 bg-[#1F2125]">
                    <h2 className="text-lg font-semibold text-gray-100 mb-4">Hızlı İşlemler</h2>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/admin/items/yeni"
                            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg"
                        >
                            Yeni Ürün Ekle
                        </Link>
                        <Link
                            href="/admin/orders"
                            className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-lg hover:from-yellow-600 hover:to-amber-700 transition-all shadow-md hover:shadow-lg"
                        >
                            Siparişleri Yönet
                        </Link>
                        <Link
                            href="/admin/users"
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                        >
                            Kullanıcıları Yönet
                        </Link>
                        <Link
                            href="/admin/categories"
                            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg"
                        >
                            Kategorileri Yönet
                        </Link>
                        <Link
                            href="/admin/homepage-banner"
                            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                        >
                            Anasayfa Banner
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function AdminDashboard() {
    return (
        <div>
            <h2 className="text-xl font-semibold leading-tight text-gray-200 mb-6">
                Dashboard
            </h2>

            <Suspense fallback={
                <div className="overflow-hidden shadow-sm sm:rounded-lg border border-gray-700/50 bg-[#1F2125] p-6">
                    <p className="text-gray-400">Yükleniyor...</p>
                </div>
            }>
                <DashboardStats />
            </Suspense>
        </div>
    )
}
