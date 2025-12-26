'use client'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'

export default function TopBar() {
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
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

        setIsAdmin((profile as any)?.role === 'admin')
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/arama?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="flex flex-col w-full">
      {/* Top Strip - Üst ince şerit */}
      <div className="bg-[#252830] border-b border-[#1a1b1e] py-1.5">
        <div className="container mx-auto px-4">
          <div className="flex justify-end text-[11px] font-medium text-gray-400 gap-4 tracking-wide">
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <span className="text-gray-700">|</span>
            <Link href="/yardim" className="hover:text-white transition-colors">Yardım & Destek</Link>
          </div>
        </div>
      </div>

    </div>
  )
}

