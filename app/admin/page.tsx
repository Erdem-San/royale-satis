import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/utils/auth'
import Link from 'next/link'

export default async function AdminDashboard() {
  const admin = await isAdmin()
  
  if (!admin) {
    redirect('/')
  }

  const supabase = await createClient()

  const [itemsCount, ordersCount, usersCount] = await Promise.all([
    supabase.from('items').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('id', { count: 'exact', head: true }),
    supabase.from('user_profiles').select('id', { count: 'exact', head: true }),
  ])

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/admin/items" className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
            <h2 className="text-xl font-semibold text-white mb-2">Ürünler</h2>
            <p className="text-3xl font-bold text-green-400">{itemsCount.count || 0}</p>
          </Link>

          <Link href="/admin/orders" className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
            <h2 className="text-xl font-semibold text-white mb-2">Siparişler</h2>
            <p className="text-3xl font-bold text-yellow-400">{ordersCount.count || 0}</p>
          </Link>

          <Link href="/admin/users" className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
            <h2 className="text-xl font-semibold text-white mb-2">Kullanıcılar</h2>
            <p className="text-3xl font-bold text-blue-400">{usersCount.count || 0}</p>
          </Link>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Hızlı İşlemler</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/admin/items/yeni"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Yeni Ürün Ekle
            </Link>
            <Link
              href="/admin/orders"
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            >
              Siparişleri Yönet
            </Link>
            <Link
              href="/admin/users"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Kullanıcıları Yönet
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

