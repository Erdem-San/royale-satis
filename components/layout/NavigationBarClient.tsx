'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function NavigationBarClient() {
  const pathname = usePathname()
  const [categories, setCategories] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name')

        if (error) {
          console.warn('Could not fetch categories:', error)
          setCategories([])
        } else if (data) {
          setCategories(data)
        }
      } catch (error) {
        console.warn('Error fetching categories:', error)
        setCategories([])
      }
    }
    fetchCategories()
  }, [supabase])

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname?.startsWith(href)
  }

  return (
    <div className="bg-[#252830] border-b border-[#1a1b1e] shadow-lg relative z-30">
      <div className="container mx-auto px-4">
        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          <Link
            href="/"
            className={`px-4 py-3 text-sm font-bold uppercase transition-colors tracking-wide ${isActive('/') ? 'text-white bg-gray-700' : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
          >
            OYUNLAR
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/kategori/${category.slug}`}
              className={`px-4 py-3 text-sm font-bold uppercase transition-colors tracking-wide whitespace-nowrap ${isActive(`/kategori/${category.slug}`) ? 'text-white bg-gray-700' : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
            >
              {category.name}
            </Link>
          ))}
          <Link
            href="/kampanyalar"
            className={`px-4 py-3 text-sm font-bold uppercase transition-colors tracking-wide relative ${isActive('/kampanyalar') ? 'text-green-500 bg-gray-700' : 'text-green-400 hover:text-white hover:bg-gray-700/50'
              }`}
          >
            KAMPANYALAR
            <span className="absolute -top-0 right-1 bg-red-600 text-white text-[9px] font-bold px-1 rounded animate-pulse">
              YENİ
            </span>
          </Link>
          <Link
            href="/bakiye-yukle"
            className={`ml-auto px-4 py-3 text-sm font-bold uppercase transition-colors tracking-wide text-green-500 hover:text-green-400`}
          >
            +BAKİYE YÜKLE
          </Link>
        </nav>
      </div>
    </div>
  )
}
