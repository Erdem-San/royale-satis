'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Order {
  id: string
  user_id: string
  total_amount: number
  status: string
  payment_status: string
  created_at: string
  order_items?: any[]
  user?: {
    email?: string
    phone?: string
  }
}

export default function AdminOrdersPage() {
  const router = useRouter()
  const supabase = createClient()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchQuery, statusFilter])

  const fetchOrders = async () => {
    try {
      setLoading(true)

      // Siparişleri çek
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            item:items (*)
          )
        `)
        .order('created_at', { ascending: false })

      if (ordersError) {
        console.error('Orders error:', ordersError)
        throw ordersError
      }

      // ✅ ÖNCE SİPARİŞLERİ GÖSTER (user bilgileri olmadan)
      if (ordersData && ordersData.length > 0) {
        setOrders(ordersData)
        setLoading(false) // Loading'i hemen kapat!

        // ✅ SONRA USER BİLGİLERİNİ ARKA PLANDA YÜKLE
        const userIds = [...new Set(ordersData.map((order: any) => order.user_id).filter(Boolean))]

        if (userIds.length > 0) {
          // User bilgilerini yükle (hata olsa bile sayfa çalışmaya devam eder)
          Promise.all([
            supabase
              .from('user_profiles')
              .select('*')
              .in('user_id', userIds)
              .then(res => res.data || []),
            fetch('/api/admin/users')
              .then(res => res.ok ? res.json() : { data: [] })
              .catch(() => ({ data: [] }))
          ])
            .then(([userProfiles, emailsResult]) => {
              // Email map oluştur
              const emailMap: Record<string, string> = {}
              if (emailsResult.data && Array.isArray(emailsResult.data)) {
                emailsResult.data.forEach((user: any) => {
                  if (user.user_id && user.email) {
                    emailMap[user.user_id] = user.email
                  }
                })
              }

              const userMap: Record<string, any> = {}

              // User profiles'dan telefon bilgilerini ekle
              userProfiles?.forEach((profile: any) => {
                userMap[profile.user_id] = {
                  phone: profile.phone || null,
                  email: emailMap[profile.user_id] || null
                }
              })

              // Email'i olan ama profile'ı olmayan kullanıcılar için
              Object.keys(emailMap).forEach((userId) => {
                if (!userMap[userId]) {
                  userMap[userId] = { email: emailMap[userId], phone: null }
                }
              })

              // Orders'a user bilgilerini ekle ve güncelle
              const ordersWithUsers = ordersData.map((order: any) => ({
                ...order,
                user: userMap[order.user_id] || null
              }))

              setOrders(ordersWithUsers)
            })
            .catch((error) => {
              // User bilgileri yüklenemedi ama siparişler zaten gösteriliyor
              console.warn('Could not load user details:', error)
            })
        }
      } else {
        setOrders([])
        setLoading(false)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrders([])
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = [...orders]

    // Status filtresi
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    // Search filtresi
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(order => {
        const orderId = order.id.toLowerCase()
        const userId = order.user_id?.toLowerCase() || ''
        const email = order.user?.email?.toLowerCase() || ''
        const phone = order.user?.phone?.toLowerCase() || ''
        const totalAmount = order.total_amount.toString()

        return orderId.includes(query) ||
          userId.includes(query) ||
          email.includes(query) ||
          phone.includes(query) ||
          totalAmount.includes(query)
      })
    }

    setFilteredOrders(filtered)
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      // State'i anında güncelle (optimistic update)
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status } : order
        )
      )

      // API route üzerinden güncelle
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Güncelleme başarısız')
      }

      // Siparişleri yeniden yükle (veritabanından güncel veriyi al)
      await fetchOrders()

      // Başarı mesajı (opsiyonel - konsola log)
      console.log(`Sipariş durumu "${status}" olarak güncellendi`)
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Sipariş durumu güncellenirken bir hata oluştu: ' + (error as any)?.message)
      // Hata durumunda yeniden yükle
      await fetchOrders()
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-900 text-yellow-300',
      processing: 'bg-blue-900 text-blue-300',
      completed: 'bg-green-900 text-green-300',
      cancelled: 'bg-red-900 text-red-300',
    }
    const labels: Record<string, string> = {
      pending: 'Beklemede',
      processing: 'İşleniyor',
      completed: 'Tamamlandı',
      cancelled: 'İptal Edildi',
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    )
  }

  const statusButtons = [
    { key: 'all', label: 'Tümü', count: orders.length },
    { key: 'pending', label: 'Beklemede', count: orders.filter(o => o.status === 'pending').length },
    { key: 'processing', label: 'İşleniyor', count: orders.filter(o => o.status === 'processing').length },
    { key: 'completed', label: 'Tamamlandı', count: orders.filter(o => o.status === 'completed').length },
    { key: 'cancelled', label: 'İptal Edildi', count: orders.filter(o => o.status === 'cancelled').length },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold leading-tight text-gray-200">
          Sipariş Yönetimi
        </h2>
      </div>

      {/* Search ve Filtreler */}
      <div className="mb-6 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Sipariş ID, Kullanıcı ID, Email, Telefon veya Tutar ile ara..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-[#1a1b1e] text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Durum Filtre Butonları */}
        <div className="flex flex-wrap gap-2">
          {statusButtons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => setStatusFilter(btn.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === btn.key
                ? 'bg-blue-600 text-white'
                : 'bg-[#252830] text-gray-300 hover:bg-gray-700 border border-gray-700'
                }`}
            >
              {btn.label}
              <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-700 text-xs">
                {btn.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Sipariş Listesi */}
      <div className="overflow-hidden bg-[#252830] shadow-sm sm:rounded-lg border border-gray-800">
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Yükleniyor...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                {searchQuery || statusFilter !== 'all'
                  ? 'Arama kriterlerinize uygun sipariş bulunamadı.'
                  : 'Henüz sipariş bulunmamaktadır.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Sipariş ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Kullanıcı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Tarih
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Tutar
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#252830] divide-y divide-gray-800">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-700 cursor-pointer transition-colors"
                      onClick={() => router.push(`/admin/orders/${order.id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-100">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-100">
                          {order.user?.email || order.user_id.slice(0, 8)}
                        </div>
                        {order.user?.phone && (
                          <div className="text-xs text-gray-400">
                            {order.user.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(order.created_at).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-blue-400">
                          {order.total_amount.toFixed(2)} ₺
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          {order.status !== 'processing' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'processing')}
                              className="px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-xs transition-colors"
                            >
                              İşleme Al
                            </button>
                          )}
                          {order.status !== 'completed' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'completed')}
                              className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs transition-colors"
                            >
                              Tamamla
                            </button>
                          )}
                          {order.status !== 'cancelled' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'cancelled')}
                              className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs transition-colors"
                            >
                              İptal
                            </button>
                          )}
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Detay
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
