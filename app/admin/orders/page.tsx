import { createClient } from '@/lib/supabase/server'

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        item:items (*)
      )
    `)
    .order('created_at', { ascending: false })

  // User profiles'ı ayrı çek
  let userProfilesMap: Record<string, any> = {}
  if (orders && orders.length > 0) {
    const userIds = orders.map((order: any) => order.user_id).filter(Boolean)
    if (userIds.length > 0) {
      const { data: userProfiles } = await supabase
        .from('user_profiles')
        .select('*')
        .in('user_id', userIds)
      
      if (userProfiles) {
        userProfilesMap = userProfiles.reduce((acc: Record<string, any>, profile: any) => {
          acc[profile.user_id] = profile
          return acc
        }, {})
      }
    }
  }

  // Orders'a user bilgilerini ekle
  const ordersWithUsers = orders?.map((order: any) => ({
    ...order,
    user: userProfilesMap[order.user_id] || null
  })) || []

  const updateOrderStatus = async (orderId: string, status: string) => {
    'use server'
    const supabase = await createClient()
    await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
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

  return (
    <div>
      <h2 className="text-xl font-semibold leading-tight text-gray-200 mb-6">
        Sipariş Yönetimi
      </h2>

      <div className="overflow-hidden bg-[#252830] shadow-sm sm:rounded-lg border border-gray-800">
        <div className="p-6">
          {error ? (
            <div className="mb-4 p-4 bg-red-900/20 border border-red-800 rounded text-sm text-red-300">
              Bir hata oluştu: {error.message}
            </div>
          ) : !ordersWithUsers || ordersWithUsers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Henüz sipariş bulunmamaktadır.</p>
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
                  {ordersWithUsers.map((order: any) => (
                    <tr key={order.id} className="hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-100">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-100">
                          {order.user?.user_id ? order.user.user_id.slice(0, 8) : 'Bilinmeyen'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(order.created_at).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
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
                        <div className="flex items-center gap-2">
                          {order.status !== 'processing' && (
                            <form action={updateOrderStatus.bind(null, order.id, 'processing')} className="inline">
                              <button
                                type="submit"
                                className="px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-xs transition-colors"
                              >
                                İşleme Al
                              </button>
                            </form>
                          )}
                          {order.status !== 'completed' && (
                            <form action={updateOrderStatus.bind(null, order.id, 'completed')} className="inline">
                              <button
                                type="submit"
                                className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs transition-colors"
                              >
                                Tamamla
                              </button>
                            </form>
                          )}
                          {order.status !== 'cancelled' && (
                            <form action={updateOrderStatus.bind(null, order.id, 'cancelled')} className="inline">
                              <button
                                type="submit"
                                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs transition-colors"
                              >
                                İptal
                              </button>
                            </form>
                          )}
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

