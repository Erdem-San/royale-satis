import Link from 'next/link'
import { Item } from '@/types/item'

interface ItemCardProps {
  item: Item
}

export default function ItemCard({ item }: ItemCardProps) {
  return (
    <Link
      href={`/item/${item.slug}`}
      className="group block bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-green-500 transition-all duration-300"
    >
      <div className="aspect-square bg-gray-700 flex items-center justify-center overflow-hidden">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="text-gray-500 text-4xl">📦</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-400 transition-colors">
          {item.name}
        </h3>
        {item.description && (
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {item.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-green-400">
            {item.price.toFixed(2)} ₺
          </span>
          <span className="text-sm text-gray-400">
            Stok: {item.stock}
          </span>
        </div>
      </div>
    </Link>
  )
}

