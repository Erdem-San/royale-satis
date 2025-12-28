import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import TopBar from './TopBar'
import MainHeaderClient from './MainHeaderClient'
import NavigationBarClient from './NavigationBarClient'

export default async function Header() {
    const supabase = await createClient()

    // Fetch categories for navigation
    const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .order('name')

    const categories = categoriesData || []

    // Fetch user data
    const { data: { user } } = await supabase.auth.getUser()

    let isAdmin = false
    if (user) {
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('user_id', user.id)
            .single()
        const userProfile = profile as any
        isAdmin = userProfile?.role === 'admin'
    }

    return (
        <header className="sticky top-0 z-50">
            <TopBar />
            <Suspense fallback={<div className="bg-[#252830] h-16"></div>}>
                <MainHeaderClient
                    key={user?.id || 'guest'}
                    initialUser={user}
                    initialIsAdmin={isAdmin}
                />
            </Suspense>
            <Suspense fallback={<div className="bg-[#252830] h-12"></div>}>
                <NavigationBarClient initialCategories={categories} />
            </Suspense>
        </header>
    )
}
