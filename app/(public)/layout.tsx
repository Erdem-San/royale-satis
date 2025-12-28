import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Suspense } from 'react'

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
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
