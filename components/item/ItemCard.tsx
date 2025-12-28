import Link from 'next/link'
import { Item } from '@/types/item'

interface ItemCardProps {
  item: Item
}

export default function ItemCard({ item }: ItemCardProps) {
  // Stats'tan type'ı al (yang, weapon, armor vb.)
  const stats = item.stats as { type?: string; amount?: string } | null
  const itemType = stats?.type || 'item'

  return (
    <Link
      href={`/item/${item.slug}`}
      className="group block bg-[#1F2228] border border-gray-700 rounded-lg overflow-hidden hover:border-green-500 transition-all duration-300 transform hover:scale-105"
    >
      {/* Image Section */}
      <div className="relative aspect-[4/2.5] bg-gradient-to-br from-[#252830] to-[#1a1b1e] flex items-center justify-center overflow-hidden">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="text-gray-500 text-6xl">📦</div>
        )}
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 bg-green-600 text-white text-xs font-semibold rounded-lg">
            {itemType.toUpperCase()}
          </span>
        </div>
        {stats?.amount && (
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg">
              {stats.amount}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 bg-[#1F2228]">
        <div className="mb-2">
          <h3 className="text-base font-semibold text-white mb-1 group-hover:text-green-400 transition-colors line-clamp-1">
            {item.name}
          </h3>
          {item.description && (
            <p className="text-gray-400 text-xs line-clamp-2 mb-2">
              {item.description}
            </p>
          )}
        </div>

        {/* Price and Icons */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
          <div>
            <span className="text-xl font-bold text-green-400">
              {item.price.toFixed(2)} ₺
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Checkmark Icon */}
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            {/* Crown/Shield Icon */}
            <div className="w-6 h-6 bg-yellow-600 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

