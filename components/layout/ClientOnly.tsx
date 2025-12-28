'use client'

import { useEffect, useState } from 'react'

interface ClientOnlyProps {
    children: React.ReactNode
    fallback?: React.ReactNode
}

/**
 * ClientOnly component that prevents hydration mismatches
 * by ensuring content only renders after client-side mount
 */
export default function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // During SSR and initial hydration, always return fallback
    // This ensures server HTML matches initial client HTML
    if (!mounted) {
        return <>{fallback}</>
    }

    // After hydration, render actual content
    return <>{children}</>
}
