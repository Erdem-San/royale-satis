'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('orderId')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        router.push('/')
        return
      }

      const supabase = createClient()
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            item:items (*)
          )
        `)
        .eq('id', orderId)
        .single()

      if (error || !data) {
        router.push('/')
        return
      }

      setOrder(data)
      setLoading(false)
    }

    fetchOrder()
  }, [orderId, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex items-center justify-center py-12">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-700"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-blue-500 absolute top-0 left-0"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#1a1b1e] py-16">
      <div className="container mx-auto px-4">
        <div className="bg-[#1F2228] rounded-lg p-8 text-center">
          <div className="mb-4">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Ödeme Başarılı!
            </h1>
            <p className="text-gray-400 mb-8 text-lg">
              Siparişiniz başarıyla alındı. Sipariş numaranız: <span className="text-white font-mono font-bold">#{orderId}</span>
            </p>
          </div>

          <div className="bg-[#252830] rounded-lg p-6 mb-6 text-left">
            <h2 className="text-xl font-semibold text-white mb-4">Sipariş Detayları</h2>
            <div className="space-y-2 text-gray-300">
              <div className="flex justify-between">
                <span>Sipariş No:</span>
                <span className="text-white font-mono">{order.id.slice(0, 8)}</span>
              </div>
              <div className="flex justify-between">
                <span>Toplam Tutar:</span>
                <span className="text-green-400 font-bold">
                  {order.total_amount.toFixed(2)} ₺
                </span>
              </div>
              <div className="flex justify-between">
                <span>Durum:</span>
                <span className="text-yellow-400">{order.status}</span>
              </div>
            </div>

            {order.order_items && order.order_items.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-600">
                <h3 className="text-lg font-semibold text-white mb-2">Sipariş İçeriği</h3>
                <div className="space-y-2">
                  {order.order_items.map((orderItem: any) => (
                    <div key={orderItem.id} className="flex justify-between text-sm text-gray-300">
                      <span>
                        {orderItem.item?.name} x {orderItem.quantity}
                      </span>
                      <span>{(orderItem.price * orderItem.quantity).toFixed(2)} ₺</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              href="/siparislerim"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
            >
              Siparişlerimi Görüntüle
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 font-semibold"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

