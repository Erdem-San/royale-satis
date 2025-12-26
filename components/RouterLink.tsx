'use client'

import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/navigation'
import NProgress from 'nprogress'
import { MouseEvent, ReactNode } from 'react'

interface RouterLinkProps extends LinkProps {
    children: ReactNode
    className?: string
    onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
}

export default function RouterLink({
    href,
    children,
    className,
    onClick,
    ...props
}: RouterLinkProps) {
    const router = useRouter()

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        // Eğer onClick prop'u varsa çalıştır
        if (onClick) {
            onClick(e)
        }

        // Eğer event.preventDefault() çağrılmadıysa devam et
        if (!e.defaultPrevented) {
            e.preventDefault()
            NProgress.start()

            // Küçük bir gecikme ile sayfayı değiştir (progress bar görünsün diye)
            setTimeout(() => {
                router.push(href.toString())
            }, 100)
        }
    }

    return (
        <Link
            href={href}
            className={className}
            onClick={handleClick}
            {...props}
        >
            {children}
        </Link>
    )
}
