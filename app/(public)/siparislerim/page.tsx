import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function OrdersPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/giris?redirect=/siparislerim')
  }

  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        item:items (*)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400'
      case 'processing':
        return 'text-orange-400'
      case 'cancelled':
        return 'text-red-400'
      default:
        return 'text-yellow-400'
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1b1e] py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-white mb-8">Siparişlerim</h1>

        {error ? (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded">
            Bir hata oluştu: {error.message}
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="bg-[#252830] rounded-lg p-8 text-center">
            <p className="text-gray-400 text-lg mb-4">Henüz siparişiniz bulunmamaktadır.</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <div key={order.id} className="bg-[#252830] rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    {order.order_items?.map((orderItem: any) => (
                      <img
                        key={orderItem.id}
                        src={orderItem.item.image_url}
                        alt={orderItem.item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ))}
                    <div className="flex flex-col">
                      <h3 className="text-lg font-semibold text-white">
                        Sipariş #{order.id.slice(0, 8).toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {new Date(order.created_at).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-semibold ${getStatusColor(order.status)}`}>
                      {order.status === 'completed' ? 'Tamamlandı' :
                        order.status === 'processing' ? 'İşleniyor' :
                          order.status === 'cancelled' ? 'İptal Edildi' :
                            'Beklemede'}
                    </p>
                    <p className="text-2xl font-bold text-green-400 mt-1">
                      {order.total_amount.toFixed(2)} ₺
                    </p>
                  </div>
                </div>

                {order.order_items && order.order_items.length > 0 && (
                  <div className="border-t border-gray-700 pt-4">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Sipariş İçeriği:</h4>
                    <div className="space-y-2">
                      {order.order_items.map((orderItem: any) => (
                        <div key={orderItem.id} className="flex justify-between text-sm text-gray-300">
                          <span>
                            {orderItem.item?.name || 'Bilinmeyen Ürün'} x {orderItem.quantity}
                          </span>
                          <span>{(orderItem.price * orderItem.quantity).toFixed(2)} ₺</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
