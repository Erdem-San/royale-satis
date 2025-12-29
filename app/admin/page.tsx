import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Suspense } from 'react'
import DashboardHeader from '@/components/admin/DashboardHeader'

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
                        className="rounded-xl p-5 bg-gradient-to-br from-emerald-600/10 to-teal-600/10 border border-emerald-700/30 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20"
                    >
                        <h2 className="text-lg font-semibold text-gray-300 mb-2">Ürünler</h2>
                        <p className="text-3xl font-bold text-emerald-400">{itemsCount.count || 0}</p>
                    </Link>

                    <Link
                        href="/admin/orders"
                        className="rounded-xl p-5 bg-gradient-to-br from-blue-600/10 to-sky-600/10 border border-blue-700/30 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                    >
                        <h2 className="text-lg font-semibold text-gray-300 mb-2">Siparişler</h2>
                        <p className="text-3xl font-bold text-blue-400">{ordersCount.count || 0}</p>
                    </Link>

                    <Link
                        href="/admin/users"
                        className="rounded-xl p-5 bg-gradient-to-br from-orange-600/10 to-amber-600/10 border border-orange-700/30 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20"
                    >
                        <h2 className="text-lg font-semibold text-gray-300 mb-2">Kullanıcılar</h2>
                        <p className="text-3xl font-bold text-orange-400">{usersCount.count || 0}</p>
                    </Link>
                </div>

                {/* Quick Actions */}
                <div className="rounded-lg p-6 border border-gray-700/50 bg-[#252830]">
                    <h2 className="text-xl font-semibold text-gray-100 mb-6 flex items-center gap-2">
                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Hızlı İşlemler
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Link
                            href="/admin/items/yeni"
                            className="group relative overflow-hidden rounded-xl p-5 bg-gradient-to-br from-emerald-600/10 to-teal-600/10 border border-emerald-700/30 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-emerald-600/20 group-hover:bg-emerald-600/30 transition-colors">
                                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-100 mb-1">Yeni Ürün Ekle</h3>
                                    <p className="text-sm text-gray-400">Kataloga yeni ürün ekle</p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href="/admin/orders"
                            className="group relative overflow-hidden rounded-xl p-5 bg-gradient-to-br from-blue-600/10 to-sky-600/10 border border-blue-700/30 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-blue-600/20 group-hover:bg-blue-600/30 transition-colors">
                                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-100 mb-1">Siparişleri Yönet</h3>
                                    <p className="text-sm text-gray-400">Tüm siparişleri görüntüle</p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href="/admin/users"
                            className="group relative overflow-hidden rounded-xl p-5 bg-gradient-to-br from-purple-600/10 to-pink-600/10 border border-purple-700/30 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-purple-600/20 group-hover:bg-purple-600/30 transition-colors">
                                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-100 mb-1">Kullanıcıları Yönet</h3>
                                    <p className="text-sm text-gray-400">Kullanıcı listesini görüntüle</p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href="/admin/categories"
                            className="group relative overflow-hidden rounded-xl p-5 bg-gradient-to-br from-orange-600/10 to-amber-600/10 border border-orange-700/30 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-orange-600/20 group-hover:bg-orange-600/30 transition-colors">
                                    <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-100 mb-1">Kategorileri Yönet</h3>
                                    <p className="text-sm text-gray-400">Kategori ekle veya düzenle</p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href="/admin/homepage-banner"
                            className="group relative overflow-hidden rounded-xl p-5 bg-gradient-to-br from-indigo-600/10 to-violet-600/10 border border-indigo-700/30 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-indigo-600/20 group-hover:bg-indigo-600/30 transition-colors">
                                    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-100 mb-1">Anasayfa Banner</h3>
                                    <p className="text-sm text-gray-400">Banner görselini güncelle</p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href="/admin/items"
                            className="group relative overflow-hidden rounded-xl p-5 bg-gradient-to-br from-cyan-600/10 to-teal-600/10 border border-cyan-700/30 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-cyan-600/20 group-hover:bg-cyan-600/30 transition-colors">
                                    <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-100 mb-1">Tüm Ürünler</h3>
                                    <p className="text-sm text-gray-400">Ürün listesini görüntüle</p>
                                </div>
                            </div>
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
            <DashboardHeader />

            <Suspense fallback={
                <div className="bg-[#1a1b1e] flex items-center justify-center">
                    <div className="flex items-center justify-center py-12">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-700"></div>
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-blue-500 absolute top-0 left-0"></div>
                        </div>
                    </div>
                </div>
            }>
                <DashboardStats />
            </Suspense>
        </div>
    )
}
