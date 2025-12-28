'use client'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'

export default function MainHeader() {
    const [user, setUser] = useState<any>(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const supabase = createClient()
    const router = useRouter()
    const { getItemCount } = useCart()

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data: { user }, error: authError } = await supabase.auth.getUser()

                if (authError) {
                    console.warn('Auth error:', authError)
                    setUser(null)
                    setIsAdmin(false)
                    setLoading(false)
                    return
                }

                setUser(user)

                if (user) {
                    try {
                        const { data: profile, error: profileError } = await supabase
                            .from('user_profiles')
                            .select('role')
                            .eq('user_id', user.id)
                            .single()

                        if (profileError) {
                            console.warn('Profile fetch error:', profileError)
                            setIsAdmin(false)
                        } else {
                            setIsAdmin((profile as any)?.role === 'admin')
                        }
                    } catch (profileError) {
                        console.warn('Could not fetch user profile:', profileError)
                        setIsAdmin(false)
                    }
                } else {
                    setIsAdmin(false)
                }
            } catch (error) {
                console.warn('Could not fetch user:', error)
                setUser(null)
                setIsAdmin(false)
            } finally {
                setLoading(false)
            }
        }

        getUser()

        // Auth state değişikliklerini dinle (login/logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                setUser(session.user)
                try {
                    const { data: profile } = await supabase
                        .from('user_profiles')
                        .select('role')
                        .eq('user_id', session.user.id)
                        .single()
                    setIsAdmin((profile as any)?.role === 'admin')
                } catch (error) {
                    console.warn('Could not fetch profile on sign in:', error)
                    setIsAdmin(false)
                }
                setLoading(false)
            } else if (event === 'SIGNED_OUT') {
                setUser(null)
                setIsAdmin(false)
                setLoading(false)
            }
        })

        return () => {
            subscription?.unsubscribe()
        }
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
        <div className="bg-[#252830] border-b border-[#1a1b1e] py-4">
            {/* Main Header - Logo, Arama, Butonlar */}
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between gap-8 h-12">

                    {/* Logo Area */}
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

                    {/* Search Bar */}
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

                    {/* Right Actions */}
                    <div className="flex items-center gap-3 shrink-0">

                        {/* User / Login Actions */}
                        {loading ? (
                            <div className="w-24 h-10 bg-gray-800 rounded-lg animate-pulse"></div>
                        ) : user ? (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/sepet"
                                    className="relative p-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    {(() => {
                                        try {
                                            const count = getItemCount()
                                            return count > 0 ? (
                                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                                    {count}
                                                </span>
                                            ) : null
                                        } catch (e) {
                                            console.warn('Error getting cart count:', e)
                                            return null
                                        }
                                    })()}
                                </Link>

                                {/* siparişlerim butonu */}
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
                                    href="/giris"
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
