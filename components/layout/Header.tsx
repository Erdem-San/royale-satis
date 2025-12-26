'use client'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()
  const { getItemCount } = useCart()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('user_id', user.id)
          .single()
        
        setIsAdmin(profile?.role === 'admin')
      }
      
      setLoading(false)
    }
    getUser()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-green-500">
            Royale Satış
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-300 hover:text-white">
              Ana Sayfa
            </Link>
            <Link href="/kategori/metin2" className="text-gray-300 hover:text-white">
              Metin2
            </Link>
            <Link href="/kategori/royale-online" className="text-gray-300 hover:text-white">
              Royale Online
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {loading ? (
              <div className="text-gray-400">Yükleniyor...</div>
            ) : user ? (
              <>
                <Link href="/sepet" className="text-gray-300 hover:text-white relative">
                  Sepet
                  {getItemCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getItemCount()}
                    </span>
                  )}
                </Link>
                <Link href="/siparislerim" className="text-gray-300 hover:text-white">
                  Siparişlerim
                </Link>
                {isAdmin && (
                  <Link href="/admin" className="text-yellow-400 hover:text-yellow-300">
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Çıkış
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/giris"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Giriş
                </Link>
                <Link
                  href="/kayit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Kayıt
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

