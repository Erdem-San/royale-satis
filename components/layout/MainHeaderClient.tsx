'use client'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CartBadge from '@/components/cart/CartBadge'
import type { User } from '@supabase/supabase-js'
import { Menu, X } from 'lucide-react'

interface MainHeaderClientProps {
    initialUser: User | null
    initialIsAdmin: boolean
    categories: any[]
}

export default function MainHeaderClient({ initialUser, initialIsAdmin, categories }: MainHeaderClientProps) {
    const [user, setUser] = useState<User | null>(initialUser)
    const [isAdmin, setIsAdmin] = useState(initialIsAdmin)
    const [searchQuery, setSearchQuery] = useState('')
    const [supabase] = useState(() => createClient())
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
            setMobileMenuOpen(false)
            router.push('/')
            router.refresh()
        } catch (error) {
            console.error('Logout error:', error)
            setUser(null)
            setIsAdmin(false)
            setMobileMenuOpen(false)
            router.push('/')
            router.refresh()
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/arama?q=${encodeURIComponent(searchQuery.trim())}`)
            setMobileMenuOpen(false)
        }
    }

    return (
        <>
            <div className="bg-[#252830] border-b border-[#1a1b1e] py-3 md:py-4">
                <div className="container mx-auto px-3 md:px-4">
                    <div className="flex items-center justify-between gap-4 min-h-[48px]">

                        <div className="flex items-center gap-3 shrink-0">
                            {/* Mobile Menu Button - Only on mobile */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <Menu className="w-6 h-6" />
                            </button>

                            <Link href="/" className="flex items-center gap-2">
                                <div className="relative flex items-center">
                                    <span className="text-2xl md:text-3xl font-black tracking-tighter text-white" style={{ fontFamily: 'Arial Black, sans-serif' }}>
                                        <span className="text-green-500 italic">Dio</span>
                                        <span className="text-white italic">pazar</span>
                                    </span>
                                </div>
                            </Link>

                            {/* Tagline - Desktop only */}
                            <span className="hidden xl:block text-xs text-gray-400 max-w-[120px] leading-tight opacity-70 border-l border-gray-600 pl-4">
                                Türkiye'nin En Büyük Oyuncu Pazarı
                            </span>                        </div>

                        {/* Desktop User Menu */}
                        <div className="hidden lg:flex items-center gap-3">
                            {user ? (
                                <>
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
                                        className="flex items-center gap-2 px-4 h-10 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition-colors"
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
                                </>
                            ) : (
                                <Link
                                    href="/auth/login"
                                    className="flex items-center gap-2 px-6 h-10 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-lg font-bold text-sm transition-colors shadow-lg shadow-black-900/20"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Giriş/Kayıt
                                </Link>
                            )}
                        </div>

                        {/* Mobile Cart Icon */}
                        {user && (
                            <Link
                                href="/sepet"
                                className="lg:hidden relative p-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <CartBadge />
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            {mobileMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    {/* Drawer */}
                    <div className="fixed top-0 right-0 bottom-0 w-80 bg-[#1a1b1e] z-50 overflow-y-auto">
                        <div className="p-6">
                            {/* Close Button */}
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* Logo */}
                            <div className="mb-8">
                                <span className="text-2xl font-black tracking-tighter text-white" style={{ fontFamily: 'Arial Black, sans-serif' }}>
                                    <span className="text-green-500 italic">Dio</span>
                                    <span className="text-white italic">pazar</span>
                                </span>
                            </div>

                            {/* Search */}
                            <form onSubmit={handleSearch} className="mb-6">
                                <div className="relative w-full group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-500 group-focus-within:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Oyun Ara..."
                                        className="w-full h-11 pl-12 pr-4 bg-[#252830] text-gray-200 text-sm rounded-lg border border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none transition-all placeholder-gray-600"
                                    />
                                </div>
                            </form>

                            {/* Categories Section */}
                            <div className="mb-6">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Kategoriler</h3>
                                <div className="space-y-2">
                                    {categories?.map((category) => (
                                        <Link
                                            key={category.id}
                                            href={`/kategori/${category.slug}`}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 bg-[#252830] hover:bg-[#2a2d35] text-white rounded-lg transition-colors"
                                        >
                                            <span className="font-medium">{category.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Other Links */}
                            <div className="mb-6">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Diğer</h3>
                                <div className="space-y-2">
                                    <Link
                                        href="/blog"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 bg-[#252830] hover:bg-[#2a2d35] text-white rounded-lg transition-colors"
                                    >
                                        <span className="font-medium">Blog</span>
                                    </Link>
                                    <Link
                                        href="/"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 bg-[#252830] hover:bg-[#2a2d35] text-white rounded-lg transition-colors"
                                    >
                                        <span className="font-medium">Yardım & Destek</span>
                                    </Link>
                                </div>
                            </div>

                            {/* User Menu Items */}
                            <div className="space-y-2">
                                {user ? (
                                    <>
                                        {/* <Link
                                            href="/sepet"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 bg-[#252830] hover:bg-[#2a2d35] text-white rounded-lg transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <span className="font-medium">Sepetim</span>
                                        </Link>
                                        */}
                                        <Link
                                            href="/siparislerim"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                            <span className="font-medium">Siparişlerim</span>
                                        </Link>

                                        {isAdmin && (
                                            <Link
                                                href="/admin"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="font-bold">Admin Panel</span>
                                            </Link>
                                        )}

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            <span className="font-bold">Çıkış Yap</span>
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        href="/auth/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-lg transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span className="font-bold">Giriş / Kayıt Ol</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
