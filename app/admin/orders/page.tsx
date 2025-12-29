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

const ITEMS_PER_PAGE = 20

export default function AdminOrdersPage() {
  const router = useRouter()
  const supabase = createClient()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchQuery, statusFilter])

  useEffect(() => {
    setCurrentPage(1) // Reset to page 1 when filters change
  }, [searchQuery, statusFilter])

  const fetchOrders = async () => {
    try {
      setLoading(true)

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

      if (ordersData && ordersData.length > 0) {
        setOrders(ordersData)
        setLoading(false)

        const userIds = [...new Set(ordersData.map((order: any) => order.user_id).filter(Boolean))]

        if (userIds.length > 0) {
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
              const emailMap: Record<string, string> = {}
              if (emailsResult.data && Array.isArray(emailsResult.data)) {
                emailsResult.data.forEach((user: any) => {
                  if (user.user_id && user.email) {
                    emailMap[user.user_id] = user.email
                  }
                })
              }

              const userMap: Record<string, any> = {}
              userProfiles?.forEach((profile: any) => {
                userMap[profile.user_id] = {
                  phone: profile.phone || null,
                  email: emailMap[profile.user_id] || null
                }
              })

              setOrders(prevOrders =>
                prevOrders.map(order => ({
                  ...order,
                  user: userMap[order.user_id] || { email: null, phone: null }
                }))
              )
            })
            .catch(err => {
              console.error('Error fetching user data:', err)
            })
        }
      } else {
        setOrders([])
        setLoading(false)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = orders

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(order => {
        const orderId = order.id.toLowerCase()
        const userId = order.user_id.toLowerCase()
        const email = (order.user?.email || '').toLowerCase()
        const phone = (order.user?.phone || '').toLowerCase()
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
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status } : order
        )
      )

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

      await fetchOrders()
      console.log(`Sipariş durumu "${status}" olarak güncellendi`)
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Sipariş durumu güncellenirken bir hata oluştu: ' + (error as any)?.message)
      await fetchOrders()
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-900/20 text-yellow-300 border-yellow-800',
      processing: 'bg-blue-900/20 text-blue-300 border-blue-800',
      completed: 'bg-green-900/20 text-green-300 border-green-800',
      cancelled: 'bg-red-900/20 text-red-300 border-red-800',
    }
    const labels: Record<string, string> = {
      pending: 'Beklemede',
      processing: 'İşleniyor',
      completed: 'Tamamlandı',
      cancelled: 'İptal Edildi',
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    )
  }

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push('...')
        pages.push(currentPage - 1)
        pages.push(currentPage)
        pages.push(currentPage + 1)
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <div>
      <h2 className="text-xl font-semibold leading-tight text-gray-200 mb-6">
        Sipariş Yönetimi
      </h2>

      <div className="overflow-hidden bg-[#1F2125] shadow-sm sm:rounded-lg border border-gray-700/50">
        <div className="p-6">
          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            {/* Search Input */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Sipariş ID, Email, Telefon veya Tutar ile ara..."
                className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#1F2125] text-white placeholder-gray-500"
              />
            </div>

            {/* Status Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'Tümü', count: orders.length },
                { key: 'pending', label: 'Beklemede', count: orders.filter(o => o.status === 'pending').length },
                { key: 'processing', label: 'İşleniyor', count: orders.filter(o => o.status === 'processing').length },
                { key: 'completed', label: 'Tamamlandı', count: orders.filter(o => o.status === 'completed').length },
                { key: 'cancelled', label: 'İptal Edildi', count: orders.filter(o => o.status === 'cancelled').length },
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setStatusFilter(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                  {label} ({count})
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center py-12">
              <div className="bg-[#1F2125] flex items-center justify-center">
                <div className="flex items-center justify-center py-12">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-700"></div>
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-blue-500 absolute top-0 left-0"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-4">Sipariş bulunamadı.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Sipariş Bilgileri
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Kullanıcı
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
                  <tbody className="bg-[#1F2125] divide-y divide-gray-700">
                    {paginatedOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-[#252830] cursor-pointer"
                        onClick={() => router.push(`/admin/orders/${order.id}`)}
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-100">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </div>
                          <div className="text-sm text-gray-400 mt-1">
                            {new Date(order.created_at).toLocaleDateString('tr-TR', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-100">
                            {order.user?.email || 'Bilinmiyor'}
                          </div>
                          {order.user?.phone && (
                            <div className="text-sm text-gray-400 mt-1">
                              {order.user.phone}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-blue-400">
                            {order.total_amount.toFixed(2)} ₺
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            Detay
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between border-t border-gray-800 pt-4">
                  <div className="text-sm text-gray-400">
                    {startIndex + 1}-{Math.min(endIndex, filteredOrders.length)} / {filteredOrders.length} sipariş
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Önceki
                    </button>
                    {getPageNumbers().map((page, idx) => (
                      page === '...' ? (
                        <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">...</span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => goToPage(page as number)}
                          className={`px-3 py-1 rounded-lg ${currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                          {page}
                        </button>
                      )
                    ))}
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sonraki
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
