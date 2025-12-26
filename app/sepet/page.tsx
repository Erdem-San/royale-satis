'use client'

import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getTotal, clearCart } = useCart()
  const router = useRouter()

  const handleCheckout = () => {
    if (items.length === 0) return
    router.push('/odeme')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Sepetiniz Boş</h1>
            <p className="text-gray-400 mb-8">
              Sepetinize henüz ürün eklenmemiş.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Alışverişe Başla
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Sepetim</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((cartItem) => (
              <div
                key={cartItem.item.id}
                className="bg-gray-800 rounded-lg p-6 flex items-center gap-6"
              >
                <div className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  {cartItem.item.image_url ? (
                    <img
                      src={cartItem.item.image_url}
                      alt={cartItem.item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-gray-500 text-2xl">📦</div>
                  )}
                </div>

                <div className="flex-grow">
                  <Link
                    href={`/item/${cartItem.item.slug}`}
                    className="text-xl font-semibold text-white hover:text-green-400 mb-2 block"
                  >
                    {cartItem.item.name}
                  </Link>
                  <p className="text-gray-400 text-sm mb-2">
                    Birim Fiyat: {cartItem.item.price.toFixed(2)} ₺
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                      className="w-8 h-8 bg-gray-700 text-white rounded hover:bg-gray-600"
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-white">{cartItem.quantity}</span>
                    <button
                      onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                      className="w-8 h-8 bg-gray-700 text-white rounded hover:bg-gray-600"
                      disabled={cartItem.quantity >= cartItem.item.stock}
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right min-w-[100px]">
                    <p className="text-lg font-bold text-green-400">
                      {(cartItem.item.price * cartItem.quantity).toFixed(2)} ₺
                    </p>
                  </div>

                  <button
                    onClick={() => removeFromCart(cartItem.item.id)}
                    className="text-red-400 hover:text-red-300 px-2"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-white mb-4">Sipariş Özeti</h2>
              
              <div className="space-y-2 mb-4">
                {items.map((cartItem) => (
                  <div key={cartItem.item.id} className="flex justify-between text-gray-400 text-sm">
                    <span>{cartItem.item.name} x {cartItem.quantity}</span>
                    <span>{(cartItem.item.price * cartItem.quantity).toFixed(2)} ₺</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-700 pt-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-white">Toplam:</span>
                  <span className="text-2xl font-bold text-green-400">
                    {getTotal().toFixed(2)} ₺
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold mb-2"
              >
                Ödemeye Geç
              </button>

              <button
                onClick={clearCart}
                className="w-full py-2 px-6 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                Sepeti Temizle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

