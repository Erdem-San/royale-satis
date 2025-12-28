import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/utils/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopBar from '@/components/admin/AdminTopBar'
import { Suspense } from 'react'

async function AdminCheck() {
    const admin = await isAdmin()
    if (!admin) {
        redirect('/auth/login')
    }
    return null
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <Suspense fallback={<div className="min-h-screen bg-[#1a1b1e] flex items-center justify-center"><p className="text-white">Loading...</p></div>}>
                <AdminCheck />
            </Suspense>
            <div className="min-h-screen bg-[#1a1b1e]">
                <Suspense fallback={<div className="w-64 h-screen bg-[#1F2125]"></div>}>
                    <AdminSidebar />
                </Suspense>
                <div className="lg:pl-64">
                    <Suspense fallback={<div className="h-16 bg-[#1F2125]"></div>}>
                        <AdminTopBar />
                    </Suspense>
                    <main className="py-6">
                        <div className="px-4 sm:px-6 lg:px-8">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}
