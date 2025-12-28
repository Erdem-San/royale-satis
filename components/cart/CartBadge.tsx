'use client'

import { useCart } from '@/contexts/CartContext'
import { useEffect, useState } from 'react'

export default function CartBadge() {
    const [mounted, setMounted] = useState(false)
    const { getItemCount } = useCart()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    const count = getItemCount()

    if (count === 0) {
        return null
    }

    return (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {count}
        </span>
    )
}
