'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

const ITEMS_PER_PAGE = 20

export default function AdminItemsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true)
        const searchQuery = searchParams.get('search')
        let url = '/api/admin/items'
        if (searchQuery) {
          url += `?search=${encodeURIComponent(searchQuery)}`
        }

        const response = await fetch(url)
        const data = await response.json()

        if (data.error) {
          setError(data.error)
        } else {
          setItems(data.data || [])
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [searchParams])

  useEffect(() => {
    setCurrentPage(1) // Reset to page 1 when search changes
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search.trim()) {
      params.set('search', search.trim())
    }
    router.push(`/admin/items${params.toString() ? '?' + params.toString() : ''}`)
  }

  // Pagination
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedItems = items.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push('...')
        pages.push(currentPage - 1)
        pages.push(currentPage)
        pages.push(currentPage + 1)
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold leading-tight text-gray-200">
          Ürün Yönetimi
        </h2>
        <Link
          href="/admin/items/yeni"
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-sky-600 text-white rounded-lg hover:from-blue-600 hover:to-sky-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Ürün Ekle
        </Link>
      </div>

      <div className="overflow-hidden bg-[#1F2125] shadow-sm sm:rounded-lg border border-gray-700/50">
        <div className="p-6">
          {/* Search Bar */}
          <div className="mb-6">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Ürün adı veya açıklama ile ara..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#1F2125] text-white"
                />
              </div>
            </form>
          </div>

          {error ? (
            <div className="mb-4 p-4 bg-red-900/20 border border-red-800 rounded-lg text-sm text-red-300">
              Bir hata oluştu: {error}
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <div className="bg-[#1F2125] flex items-center justify-center">
                <div className="flex items-center justify-center py-12">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-700"></div>
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-blue-500 absolute top-0 left-0"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : !items || items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-4">Henüz ürün bulunmamaktadır.</p>
              <Link
                href="/admin/items/yeni"
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-sky-600 text-white rounded-lg hover:from-blue-600 hover:to-sky-700 transition-all shadow-md hover:shadow-lg"
              >
                İlk Ürünü Ekle
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Ürün Bilgileri
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Kategori
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Fiyat & Stok
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Durum
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-[#1F2125] divide-y divide-gray-700">
                    {paginatedItems.map((item: any) => (
                      <tr
                        key={item.id}
                        className="hover:bg-[#252830] cursor-pointer"
                        onClick={() => router.push(`/admin/items/${item.id}/duzenle`)}
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-100">
                            {item.name}
                          </div>
                          {item.description && (
                            <div className="text-sm text-gray-400 mt-1 line-clamp-2">
                              {item.description}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-100">
                            {item.category?.name || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-blue-400">
                            {item.price.toFixed(2)} ₺
                          </div>
                          <div className="text-sm text-gray-400 mt-1">
                            Stok: {item.stock}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${item.stock > 0
                            ? 'bg-green-900/20 text-green-300 border-green-800'
                            : 'bg-red-900/20 text-red-300 border-red-800'
                            }`}>
                            {item.stock > 0 ? 'Stokta Var' : 'Stokta Yok'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                          <Link
                            href={`/admin/items/${item.id}/duzenle`}
                            className="text-blue-400 hover:text-blue-300 mr-4"
                          >
                            Düzenle
                          </Link>
                          <Link
                            href={`/admin/items/${item.id}/sil`}
                            className="text-red-400 hover:text-red-300"
                          >
                            Sil
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between border-t border-gray-800 pt-4">
                  <div className="text-sm text-gray-400">
                    {startIndex + 1}-{Math.min(endIndex, items.length)} / {items.length} ürün
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Önceki
                    </button>
                    {getPageNumbers().map((page, idx) => (
                      page === '...' ? (
                        <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">...</span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => goToPage(page as number)}
                          className={`px-3 py-1 rounded-lg ${currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                          {page}
                        </button>
                      )
                    ))}
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sonraki
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
