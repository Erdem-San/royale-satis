'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import NProgress from 'nprogress'

// NProgress konfigürasyonu
NProgress.configure({
    showSpinner: false,
    trickleSpeed: 100,
    minimum: 0.08,
    easing: 'ease',
    speed: 200
})

function ProgressBarContent() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        // Sayfa yüklendiğinde progress bar'ı bitir
        NProgress.done()
    }, [pathname, searchParams])

    useEffect(() => {
        // Tüm link tıklamalarını dinle
        const handleAnchorClick = (event: MouseEvent) => {
            const target = event.currentTarget as HTMLAnchorElement
            const targetUrl = new URL(target.href)
            const currentUrl = new URL(window.location.href)

            // Eğer farklı bir sayfaya gidiyorsa progress bar'ı başlat
            if (targetUrl.pathname !== currentUrl.pathname) {
                NProgress.start()
            }
        }

        // Tüm linklere event listener ekle
        const links = document.querySelectorAll('a[href^="/"]')
        links.forEach(link => {
            link.addEventListener('click', handleAnchorClick as EventListener)
        })

        // Cleanup
        return () => {
            links.forEach(link => {
                link.removeEventListener('click', handleAnchorClick as EventListener)
            })
        }
    }, [pathname])

    return null
}

export default function ProgressBar() {
    return (
        <Suspense fallback={null}>
            <ProgressBarContent />
        </Suspense>
    )
}
