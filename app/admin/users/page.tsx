'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const ITEMS_PER_PAGE = 20

interface User {
  id: string
  user_id: string
  email: string
  role: 'admin' | 'user'
  created_at: string
}

export default function AdminUsersPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [currentPage, setCurrentPage] = useState(1)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [flashMessage, setFlashMessage] = useState<string | null>(null)

  const [createForm, setCreateForm] = useState({
    email: '',
    password: '',
    password_confirmation: '',
    role: 'user' as 'admin' | 'user',
  })

  const [editForm, setEditForm] = useState({
    email: '',
    password: '',
    password_confirmation: '',
    role: 'user' as 'admin' | 'user',
  })

  useEffect(() => {
    fetchUsers()
  }, [searchParams])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const searchQuery = searchParams.get('search')
      let url = '/api/admin/users'
      if (searchQuery) {
        url += `?search=${encodeURIComponent(searchQuery)}`
      }

      const response = await fetch(url)
      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setUsers(data.data || [])
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search.trim()) {
      params.set('search', search.trim())
    }
    router.push(`/admin/users${params.toString() ? '?' + params.toString() : ''}`)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (createForm.password !== createForm.password_confirmation) {
      setError('Şifreler eşleşmiyor')
      return
    }

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setCreateForm({ email: '', password: '', password_confirmation: '', role: 'user' })
        setIsCreating(false)
        setFlashMessage('Kullanıcı başarıyla oluşturuldu')
        fetchUsers()
        setTimeout(() => setFlashMessage(null), 3000)
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  const startEdit = (user: User) => {
    setEditingId(user.id)
    setEditForm({
      email: user.email,
      password: '',
      password_confirmation: '',
      role: user.role,
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({ email: '', password: '', password_confirmation: '', role: 'user' })
  }

  const handleUpdate = async (userId: string) => {
    if (editForm.password && editForm.password !== editForm.password_confirmation) {
      setError('Şifreler eşleşmiyor')
      return
    }

    try {
      const updateData: any = {
        email: editForm.email,
        role: editForm.role,
      }
      if (editForm.password) {
        updateData.password = editForm.password
      }

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setEditingId(null)
        setEditForm({ email: '', password: '', password_confirmation: '', role: 'user' })
        setFlashMessage('Kullanıcı başarıyla güncellendi')
        fetchUsers()
        setTimeout(() => setFlashMessage(null), 3000)
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleDelete = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setDeleteConfirmId(null)
        setFlashMessage('Kullanıcı başarıyla silindi')
        fetchUsers()
        setTimeout(() => setFlashMessage(null), 3000)
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  const getRoleBadge = (role: string) => {
    if (role === 'admin') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900 text-purple-300">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Admin
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-300">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Kullanıcı
      </span>
    )
  }

  const adminCount = users.filter(u => u.role === 'admin').length
  const isLastAdmin = (user: User) => user.role === 'admin' && adminCount === 1

  return (
    <div>
      <h2 className="text-xl font-semibold leading-tight text-gray-200 mb-6">
        Kullanıcı Yönetimi
      </h2>

      <div className="overflow-hidden bg-[#1F2125] shadow-sm sm:rounded-lg border border-gray-700/50">
        <div className="p-6">
          {/* Flash Messages */}
          {flashMessage && (
            <div className="mb-4 p-4 bg-green-900/20 border border-green-800 rounded-lg text-sm text-green-300">
              {flashMessage}
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-900/20 border border-red-800 rounded-lg text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Search and Create Button */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="E-posta ile ara..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#1F2125] text-white"
                />
              </div>
            </form>
            <button
              onClick={() => setIsCreating(!isCreating)}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-sky-600 text-white rounded-lg hover:from-blue-600 hover:to-sky-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {isCreating ? 'İptal' : 'Kullanıcı Ekle'}
            </button>
          </div>

          {/* Create Form */}
          {isCreating && (
            <div className="mb-6 p-4 bg-[#252830] rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold mb-4 text-gray-100">Yeni Kullanıcı Oluştur</h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      E-posta
                    </label>
                    <input
                      type="email"
                      value={createForm.email}
                      onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#1F2125] text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Rol
                    </label>
                    <select
                      value={createForm.role}
                      onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as 'admin' | 'user' })}
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#1F2125] text-white"
                      required
                    >
                      <option value="user">Kullanıcı</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Şifre
                    </label>
                    <input
                      type="password"
                      value={createForm.password}
                      onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#1F2125] text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Şifre Tekrar
                    </label>
                    <input
                      type="password"
                      value={createForm.password_confirmation}
                      onChange={(e) => setCreateForm({ ...createForm, password_confirmation: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#1F2125] text-white"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false)
                      setCreateForm({ email: '', password: '', password_confirmation: '', role: 'user' })
                    }}
                    className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-sky-600 text-white rounded-lg hover:from-blue-600 hover:to-sky-700 transition-all shadow-md hover:shadow-lg"
                  >
                    Kullanıcı Oluştur
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Users Table */}
          {loading ? (
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
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      E-posta
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Oluşturulma Tarihi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#1F2125] divide-y divide-gray-700">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-gray-400">
                        Kullanıcı bulunamadı
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-[#252830]">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-100">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {new Date(user.created_at).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => startEdit(user)}
                              className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Düzenle"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(user.id)}
                              disabled={isLastAdmin(user)}
                              className={`p-2 ${isLastAdmin(user) ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300'}`}
                              title={isLastAdmin(user) ? 'Son admin silinemez' : 'Sil'}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Edit Modal */}
          {editingId && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-[#252830] rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-100">
                    Kullanıcı Düzenle
                  </h3>
                  <button
                    onClick={cancelEdit}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleUpdate(editingId); }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      E-posta
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#1F2125] text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Şifre (değiştirmek istemiyorsanız boş bırakın)
                    </label>
                    <input
                      type="password"
                      value={editForm.password}
                      onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#1F2125] text-white"
                    />
                  </div>
                  {editForm.password && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Şifre Tekrar
                      </label>
                      <input
                        type="password"
                        value={editForm.password_confirmation}
                        onChange={(e) => setEditForm({ ...editForm, password_confirmation: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#1F2125] text-white"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Rol
                    </label>
                    <select
                      value={editForm.role}
                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value as 'admin' | 'user' })}
                      disabled={(() => {
                        const user = users.find(u => u.id === editingId)
                        return user ? isLastAdmin(user) : false
                      })()}
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#1F2125] text-white disabled:opacity-50"
                      required
                    >
                      <option value="user">Kullanıcı</option>
                      <option value="admin">Admin</option>
                    </select>
                    {(() => {
                      const user = users.find(u => u.id === editingId)
                      return user && isLastAdmin(user) && (
                        <p className="mt-1 text-sm text-red-400">
                          Son adminin rolü değiştirilemez
                        </p>
                      )
                    })()}
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-sky-600 text-white rounded-lg hover:from-blue-600 hover:to-sky-700 transition-all shadow-md hover:shadow-lg"
                    >
                      Değişiklikleri Kaydet
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {deleteConfirmId && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-[#252830] rounded-lg p-6 max-w-md w-full mx-4 border border-gray-800">
                <h3 className="text-lg font-semibold mb-4 text-gray-100">
                  Silmeyi Onayla
                </h3>
                <p className="text-gray-300 mb-6">
                  Bu kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700"
                  >
                    İptal
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirmId)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
