'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Order {
  id: string
  user_id: string
  total_amount: number
  status: string
  payment_status: string
  iyzico_payment_id: string | null
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
  user?: {
    email?: string
    phone?: string
  }
}

interface OrderItem {
  id: string
  item_id: string
  quantity: number
  price: number
  item?: {
    id: string
    name: string
    slug: string
    image_url: string | null
  }
}

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string
  const supabase = createClient()

  const [order, setOrder] = useState<Order | null>(null)
  const [userOrders, setUserOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails()
    }
  }, [orderId])

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)

      // Sipariş detaylarını çek
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            item:items (
              id,
              name,
              slug,
              image_url
            )
          )
        `)
        .eq('id', orderId)
        .single()

      if (orderError) throw orderError
      if (!orderData) {
        router.push('/admin/orders')
        return
      }

      // Kullanıcı bilgilerini çek
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', orderData.user_id)
        .single()

      // Email bilgisini API'den çek
      let userEmail: string | null = null
      try {
        const response = await fetch('/api/admin/users')
        if (response.ok) {
          const data = await response.json()
          if (data.data && Array.isArray(data.data)) {
            const user = data.data.find((u: any) => u.user_id === orderData.user_id)
            if (user && user.email) {
              userEmail = user.email
            }
          }
        }
      } catch (error) {
        console.warn('Could not fetch user email:', error)
      }

      const orderWithUser = {
        ...orderData,
        user: {
          email: userEmail,
          phone: userProfile?.phone || null,
        }
      }

      setOrder(orderWithUser)

      // Kullanıcının tüm siparişlerini çek
      const { data: allUserOrders, error: userOrdersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', orderData.user_id)
        .order('created_at', { ascending: false })

      if (!userOrdersError && allUserOrders) {
        setUserOrders(allUserOrders)
      }
    } catch (error) {
      console.error('Error fetching order details:', error)
      router.push('/admin/orders')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (status: string) => {
    if (!order) return

    try {
      setUpdating(true)

      // State'i anında güncelle (optimistic update)
      setOrder(prevOrder => prevOrder ? { ...prevOrder, status } : null)
      setUserOrders(prevOrders =>
        prevOrders.map(o => o.id === order.id ? { ...o, status } : o)
      )

      // API route üzerinden güncelle
      const response = await fetch(`/api/admin/orders/${order.id}`, {
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

      // Siparişi yeniden yükle (veritabanından güncel veriyi al)
      await fetchOrderDetails()
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Sipariş durumu güncellenirken bir hata oluştu: ' + (error as any)?.message)
      // Hata durumunda yeniden yükle
      await fetchOrderDetails()
    } finally {
      setUpdating(false)
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
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    )
  }

  const getPaymentStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-900 text-yellow-300',
      paid: 'bg-green-900 text-green-300',
      failed: 'bg-red-900 text-red-300',
      refunded: 'bg-gray-900 text-gray-300',
    }
    const labels: Record<string, string> = {
      pending: 'Beklemede',
      paid: 'Ödendi',
      failed: 'Başarısız',
      refunded: 'İade Edildi',
    }
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-400">Yükleniyor...</p>
      </div>
    )
  }

  if (!order) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h2 className="text-2xl font-semibold text-gray-200">
              Sipariş Detayı
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Sipariş ID: #{order.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Durum Güncelleme Butonları */}
        <div className="flex items-center gap-2">
          {order.status !== 'processing' && (
            <button
              onClick={() => updateOrderStatus('processing')}
              disabled={updating}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm font-medium transition-colors disabled:opacity-50"
            >
              İşleme Al
            </button>
          )}
          {order.status !== 'completed' && (
            <button
              onClick={() => updateOrderStatus('completed')}
              disabled={updating}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors disabled:opacity-50"
            >
              Tamamla
            </button>
          )}
          {order.status !== 'cancelled' && (
            <button
              onClick={() => updateOrderStatus('cancelled')}
              disabled={updating}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors disabled:opacity-50"
            >
              İptal Et
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol Kolon - Sipariş Detayları */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sipariş Bilgileri */}
          <div className="bg-[#1F2125] rounded-lg border border-gray-700/50 p-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Sipariş Bilgileri</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Sipariş Durumu</p>
                  <div className="mt-1">
                    {getStatusBadge(order.status)}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Ödeme Durumu</p>
                  <div className="mt-1">
                    {getPaymentStatusBadge(order.payment_status)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Toplam Tutar</p>
                  <p className="text-xl font-bold text-blue-400 mt-1">
                    {order.total_amount.toFixed(2)} ₺
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Sipariş Tarihi</p>
                  <p className="text-sm text-gray-300 mt-1">
                    {new Date(order.created_at).toLocaleString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              {order.iyzico_payment_id && (
                <div>
                  <p className="text-sm text-gray-400">Ödeme ID</p>
                  <p className="text-sm text-gray-300 mt-1 font-mono">
                    {order.iyzico_payment_id}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sipariş Öğeleri */}
          <div className="bg-[#1F2125] rounded-lg border border-gray-700/50 p-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Sipariş Öğeleri</h3>
            {order.order_items && order.order_items.length > 0 ? (
              <div className="space-y-4">
                {order.order_items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 bg-[#1a1b1e] rounded-lg border border-gray-700"
                  >
                    {item.item?.image_url && (
                      <img
                        src={item.item.image_url}
                        alt={item.item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-200">
                        {item.item?.name || 'Bilinmeyen Ürün'}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">
                        Adet: {item.quantity} × {item.price.toFixed(2)} ₺
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-blue-400">
                        {(item.price * item.quantity).toFixed(2)} ₺
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">Sipariş öğesi bulunamadı.</p>
            )}
          </div>
        </div>

        {/* Sağ Kolon - Kullanıcı Bilgileri ve Geçmiş */}
        <div className="space-y-6">
          {/* Kullanıcı Bilgileri */}
          <div className="bg-[#1F2125] rounded-lg border border-gray-700/50 p-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Kullanıcı Bilgileri</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-sm text-gray-200 mt-1">
                  {order.user?.email || 'Bilinmiyor'}
                </p>
              </div>
              {order.user?.phone && (
                <div>
                  <p className="text-sm text-gray-400">Telefon</p>
                  <p className="text-sm text-gray-200 mt-1">
                    {order.user.phone}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-400">Kullanıcı ID</p>
                <p className="text-xs text-gray-400 mt-1 font-mono">
                  {order.user_id}
                </p>
              </div>
            </div>
          </div>

          {/* Kullanıcının Diğer Siparişleri */}
          <div className="bg-[#1F2125] rounded-lg border border-gray-700/50 p-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">
              Kullanıcının Diğer Siparişleri
            </h3>
            {userOrders.length > 1 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {userOrders
                  .filter(o => o.id !== order.id)
                  .map((userOrder) => (
                    <Link
                      key={userOrder.id}
                      href={`/admin/orders/${userOrder.id}`}
                      className="block p-3 bg-[#1a1b1e] rounded-lg border border-gray-700 hover:border-blue-500 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-gray-400">
                          #{userOrder.id.slice(0, 8).toUpperCase()}
                        </span>
                        {getStatusBadge(userOrder.status)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">
                          {new Date(userOrder.created_at).toLocaleDateString('tr-TR')}
                        </span>
                        <span className="text-sm font-semibold text-blue-400">
                          {userOrder.total_amount.toFixed(2)} ₺
                        </span>
                      </div>
                    </Link>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Bu kullanıcının başka siparişi bulunmamaktadır.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

