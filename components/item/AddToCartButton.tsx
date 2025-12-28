'use client'

import { useState } from 'react'
import { Item } from '@/types/item'
import { useCart } from '@/contexts/CartContext'

interface AddToCartButtonProps {
  item: Item
  onAddToCart?: () => void
}

export default function AddToCartButton({ item, onAddToCart }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    if (item.stock < quantity) {
      alert('Yeterli stok bulunmamaktadır')
      return
    }
    addToCart(item, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)

    // Trigger callback to open mini cart
    if (onAddToCart) {
      onAddToCart()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-gray-400">Adet:</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 bg-gray-700 text-white rounded-lg hover:bg-gray-600 cursor-pointer"
            disabled={quantity <= 1}
          >
            -
          </button>
          <input
            type="number"
            min="1"
            max={item.stock}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Math.min(item.stock, parseInt(e.target.value) || 1)))}
            className="w-20 h-10 bg-gray-700 text-white text-center rounded-lg border border-gray-600"
          />
          <button
            onClick={() => setQuantity(Math.min(item.stock, quantity + 1))}
            className="w-10 h-10 bg-gray-700 text-white rounded-lg hover:bg-gray-600 cursor-pointer"
            disabled={quantity >= item.stock}
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={item.stock === 0 || added}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors cursor-pointer ${item.stock === 0
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : added
              ? 'bg-green-600 text-white'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
      >
        {added ? 'Sepete Eklendi!' : item.stock === 0 ? 'Stokta Yok' : 'Sepete Ekle'}
      </button>
    </div>
  )
}

