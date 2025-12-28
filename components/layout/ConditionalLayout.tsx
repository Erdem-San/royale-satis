import { headers } from 'next/headers'
import { Suspense } from 'react'
import Header from './Header'
import Footer from './Footer'

export default async function ConditionalLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const headersList = await headers()
    const pathname = headersList.get('x-invoke-path') || headersList.get('x-pathname') || ''

    const isAdminPage = pathname.startsWith('/admin')
    const isAuthPage = pathname.startsWith('/auth')

    if (isAdminPage || isAuthPage) {
        return <>{children}</>
    }

    return (
        <>
            <Suspense fallback={<div className="h-32 bg-[#252830]"></div>}>
                <Header />
            </Suspense>
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </>
    )
}
