'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Notification {
  id: string
  type: string
  title: string
  message: string | null
  order_id: string | null
  read_at: string | null
  created_at: string
}

export default function AdminTopBar() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [loadingNotifications, setLoadingNotifications] = useState(false)
  // State'i localStorage'dan veya true olarak başlat
  const [tableExists, setTableExists] = useState(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('notifications_table_exists')
      return cached !== 'false'
    }
    return true
  })
  const notifRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const fetchNotifications = useCallback(async () => {
    if (loadingNotifications || !tableExists) return false
    setLoadingNotifications(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) {
        const errorMessage = error.message?.toLowerCase() || ''
        const isTableNotFound =
          error.code === 'PGRST116' ||
          error.code === '42P01' ||
          errorMessage.includes('could not find the table') ||
          errorMessage.includes('table') && errorMessage.includes('not found') ||
          errorMessage.includes('does not exist') ||
          error.code === '404'

        if (isTableNotFound) {
          setTableExists(false)
          localStorage.setItem('notifications_table_exists', 'false')
          setNotifications([])
          return false
        }
        throw error
      }
      setNotifications(data || [])
      return true
    } catch (error: any) {
      const errorMessage = error?.message?.toLowerCase() || ''
      const isTableNotFound =
        errorMessage.includes('could not find the table') ||
        errorMessage.includes('table') && errorMessage.includes('not found') ||
        errorMessage.includes('does not exist') ||
        (error?.status === 404)

      if (isTableNotFound) {
        setTableExists(false)
        localStorage.setItem('notifications_table_exists', 'false')
        setNotifications([])
        return false
      }

      if (!isTableNotFound) {
        console.error('Failed to fetch notifications:', error?.message || error)
      }
      setNotifications([])
      return false
    } finally {
      setLoadingNotifications(false)
    }
  }, [loadingNotifications, tableExists])

  const fetchUnreadCount = useCallback(async () => {
    if (!tableExists) return
    try {
      const supabase = createClient()
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .is('read_at', null)

      if (error) {
        const errorMessage = error.message?.toLowerCase() || ''
        const isTableNotFound =
          error.code === 'PGRST116' ||
          error.code === '42P01' ||
          errorMessage.includes('could not find the table') ||
          errorMessage.includes('table') && errorMessage.includes('not found') ||
          errorMessage.includes('does not exist') ||
          error.code === '404'

        if (isTableNotFound) {
          setTableExists(false)
          localStorage.setItem('notifications_table_exists', 'false')
          setUnreadCount(0)
          return
        }
        throw error
      }
      setUnreadCount(count || 0)
    } catch (error: any) {
      const errorMessage = error?.message?.toLowerCase() || ''
      const isTableNotFound =
        errorMessage.includes('could not find the table') ||
        errorMessage.includes('table') && errorMessage.includes('not found') ||
        errorMessage.includes('does not exist') ||
        (error?.status === 404)

      if (isTableNotFound) {
        setTableExists(false)
        localStorage.setItem('notifications_table_exists', 'false')
        setUnreadCount(0)
        return
      }

      if (!isTableNotFound) {
        console.error('Failed to fetch unread count:', error?.message || error)
      }
      setUnreadCount(0)
    }
  }, [tableExists])

  useEffect(() => {
    let mounted = true
    const supabase = createClient()
    let channel: any = null

    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (mounted) {
          setUser(user)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }
    getUser()

    // Initialize notifications and subscription sequentially
    const initNotifications = async () => {
      if (!tableExists) return

      // Try fetching notifications first
      const exists = await fetchNotifications()

      // Only proceed if table exists
      if (exists && mounted) {
        await fetchUnreadCount()

        // Setup subscription
        channel = supabase
          .channel('notifications')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'notifications',
            },
            () => {
              fetchNotifications()
              fetchUnreadCount()
            }
          )
          .subscribe()
      }
    }

    initNotifications()

    // Close dropdowns when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      mounted = false
      document.removeEventListener('mousedown', handleClickOutside)
      if (channel) {
        channel.unsubscribe()
      }
    }
  }, [fetchNotifications, fetchUnreadCount])

  const handleMarkAsRead = async (id: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', id)

      if (error) {
        const errorMessage = error.message?.toLowerCase() || ''
        const isTableNotFound =
          error.code === 'PGRST116' ||
          error.code === '42P01' ||
          errorMessage.includes('could not find the table') ||
          errorMessage.includes('table') && errorMessage.includes('not found') ||
          errorMessage.includes('does not exist')

        if (isTableNotFound) {
          return
        }
        throw error
      }
      fetchNotifications()
      fetchUnreadCount()
    } catch (error: any) {
      const errorMessage = error?.message?.toLowerCase() || ''
      const isTableNotFound =
        errorMessage.includes('could not find the table') ||
        errorMessage.includes('table') && errorMessage.includes('not found') ||
        errorMessage.includes('does not exist')

      if (!isTableNotFound) {
        console.error('Failed to mark notification as read:', error?.message || error)
      }
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .is('read_at', null)

      if (error) {
        const errorMessage = error.message?.toLowerCase() || ''
        const isTableNotFound =
          error.code === 'PGRST116' ||
          error.code === '42P01' ||
          errorMessage.includes('could not find the table') ||
          errorMessage.includes('table') && errorMessage.includes('not found') ||
          errorMessage.includes('does not exist')

        if (isTableNotFound) {
          return
        }
        throw error
      }
      fetchNotifications()
      fetchUnreadCount()
    } catch (error: any) {
      const errorMessage = error?.message?.toLowerCase() || ''
      const isTableNotFound =
        errorMessage.includes('could not find the table') ||
        errorMessage.includes('table') && errorMessage.includes('not found') ||
        errorMessage.includes('does not exist')

      if (!isTableNotFound) {
        console.error('Failed to mark all as read:', error?.message || error)
      }
    }
  }

  const handleNotificationClick = async (notification: Notification) => {
    if (notification.order_id) {
      router.push(`/admin/orders`)
      setNotificationsOpen(false)
    }
    if (!notification.read_at) {
      await handleMarkAsRead(notification.id)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-700/50 bg-[#1F2125] px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1"></div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => {
                setNotificationsOpen(!notificationsOpen)
                if (!notificationsOpen) {
                  fetchNotifications()
                }
              }}
              className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-300 relative"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 z-50 mt-2 w-80 rounded-md shadow-lg bg-[#252830] ring-1 ring-black ring-opacity-5 border border-gray-700/50">
                <div className="p-4 border-b border-gray-700/50 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-100">
                    Bildirimler
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-sm text-blue-400 hover:text-blue-300"
                    >
                      Tümünü Okundu İşaretle
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {loadingNotifications ? (
                    <div className="bg-[#1F2125] flex items-center justify-center">
                      <div className="flex items-center justify-center py-12">
                        <div className="relative">
                          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-700"></div>
                          <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-blue-500 absolute top-0 left-0"></div>
                        </div>
                      </div>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-400">
                      Bildirim yok
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-700/50 hover:bg-gray-700 cursor-pointer ${!notification.read_at ? 'bg-blue-900/20' : ''
                          }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-100">
                              {notification.title}
                            </p>
                            {notification.message && (
                              <p className="text-sm text-gray-400 mt-1">
                                {notification.message}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(notification.created_at).toLocaleString('tr-TR')}
                            </p>
                          </div>
                          {!notification.read_at && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMarkAsRead(notification.id)
                              }}
                              className="ml-2 p-1 text-gray-400 hover:text-gray-300"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-800" />

          {/* User Menu Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-x-2 rounded-lg px-3 py-2 text-sm font-semibold text-gray-100 hover:bg-gray-700"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-900 to-sky-900 flex items-center justify-center">
                <span className="text-blue-300 font-semibold text-xs">
                  {user?.email?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <span className="hidden lg:block">{user?.email?.split('@')[0] || 'Admin'}</span>
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 z-50 mt-2 w-48 rounded-md shadow-lg bg-[#252830] ring-1 ring-black ring-opacity-5 border border-gray-700/50">
                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Çıkış Yap
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

