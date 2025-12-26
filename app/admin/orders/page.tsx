import { createClient } from '@/lib/supabase/server'

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      *,
      user:user_profiles!orders_user_id_fkey(*),
      order_items (
        *,
        item:items (*)
      )
    `)
    .order('created_at', { ascending: false })

  const updateOrderStatus = async (orderId: string, status: string) => {
    'use server'
    const supabase = await createClient()
    await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Sipariş Yönetimi</h1>

        {error ? (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded">
            Bir hata oluştu: {error.message}
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400 text-lg">Henüz sipariş bulunmamaktadır.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <div key={order.id} className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Sipariş #{order.id.slice(0, 8).toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {new Date(order.created_at).toLocaleDateString('tr-TR')}
                    </p>
                    <p className="text-sm text-gray-400">
                      Kullanıcı: {order.user?.user_id || 'Bilinmeyen'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-400">
                      {order.total_amount.toFixed(2)} ₺
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Durum: {order.status}
                    </p>
                  </div>
                </div>

                {order.order_items && order.order_items.length > 0 && (
                  <div className="border-t border-gray-700 pt-4 mb-4">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Sipariş İçeriği:</h4>
                    <div className="space-y-1">
                      {order.order_items.map((orderItem: any) => (
                        <div key={orderItem.id} className="flex justify-between text-sm text-gray-300">
                          <span>
                            {orderItem.item?.name || 'Bilinmeyen'} x {orderItem.quantity}
                          </span>
                          <span>{(orderItem.price * orderItem.quantity).toFixed(2)} ₺</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <form action={updateOrderStatus.bind(null, order.id, 'processing')}>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 mr-2"
                  >
                    İşleme Al
                  </button>
                </form>
                <form action={updateOrderStatus.bind(null, order.id, 'completed')} className="inline">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 mr-2"
                  >
                    Tamamlandı
                  </button>
                </form>
                <form action={updateOrderStatus.bind(null, order.id, 'cancelled')} className="inline">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    İptal Et
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
    </div>
  )
}

