'use client'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CartBadge from '@/components/cart/CartBadge'
import type { User } from '@supabase/supabase-js'

interface MainHeaderClientProps {
    initialUser: User | null
    initialIsAdmin: boolean
}

export default function MainHeaderClient({ initialUser, initialIsAdmin }: MainHeaderClientProps) {
    const [user, setUser] = useState<User | null>(initialUser)
    const [isAdmin, setIsAdmin] = useState(initialIsAdmin)
    const [searchQuery, setSearchQuery] = useState('')
    const [supabase] = useState(() => createClient())
    const router = useRouter()

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                setUser(session.user)
                const { data: profile } = await supabase
                    .from('user_profiles')
                    .select('role')
                    .eq('user_id', session.user.id)
                    .single()
                const userProfile = profile as any
                setIsAdmin(userProfile?.role === 'admin')
            } else {
                setUser(null)
                setIsAdmin(false)
            }
            router.refresh()
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [supabase, router])

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/signout', { method: 'POST' })
            setUser(null)
            setIsAdmin(false)
            router.push('/')
            router.refresh()
        } catch (error) {
            console.error('Logout error:', error)
            // Force logout state even if error
            setUser(null)
            setIsAdmin(false)
            router.push('/')
            router.refresh()
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/arama?q=${encodeURIComponent(searchQuery.trim())}`)
        }
    }

    return (
        <div className="bg-[#252830] border-b border-[#1a1b1e] py-4">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between gap-8 h-12">

                    <div className="flex items-center gap-6 shrink-0">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="relative flex items-center">
                                <span className="text-3xl font-black tracking-tighter text-white" style={{ fontFamily: 'Arial Black, sans-serif' }}>
                                    <span className="text-green-500 italic">Dio</span>
                                    <span className="text-white italic">pazar</span>
                                </span>
                            </div>
                        </Link>
                        <span className="hidden xl:block text-xs text-gray-400 max-w-[120px] leading-tight opacity-70 border-l border-gray-600 pl-4">
                            Türkiye'nin En Büyük Oyuncu Pazarı
                        </span>
                    </div>

                    <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-2xl">
                        <div className="relative w-full group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-gray-500 group-focus-within:text-[#3b82f6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Oyun Ara..."
                                className="w-full h-11 pl-12 pr-4 bg-[#1a1b1e] text-gray-200 text-sm rounded-lg border border-gray-700 focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] focus:outline-none transition-all placeholder-gray-600"
                            />
                        </div>
                    </form>

                    <div className="flex items-center gap-3 shrink-0">
                        {user ? (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/sepet"
                                    className="relative p-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <CartBadge />
                                </Link>

                                <Link
                                    href="/siparislerim"
                                    className="flex items-center gap-2 px-4 h-10 bg-green-600 hover:bg-green-700 text-white rounded-sm font-medium text-sm transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                    Siparişlerim
                                </Link>

                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        className="px-4 h-10 flex items-center justify-center bg-yellow-600 text-white rounded-lg font-bold hover:bg-yellow-700 text-sm transition-colors"
                                    >
                                        Admin
                                    </Link>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="px-4 h-10 bg-gray-700 cursor-pointer text-white rounded-lg font-bold hover:bg-red-600 text-sm transition-colors"
                                >
                                    Çıkış
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/auth/login"
                                    className="flex items-center gap-2 px-6 h-10 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-lg font-bold text-sm transition-colors shadow-lg shadow-black-900/20"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Giriş/Kayıt
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
