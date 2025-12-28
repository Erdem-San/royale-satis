'use client'

import { useState } from 'react'
import AddToCartButton from '@/components/item/AddToCartButton'
import MiniCart from '@/components/cart/MiniCart'
import Link from 'next/link'
import { Item } from '@/types/item'

interface ItemActionsProps {
    item: Item
}

export default function ItemActions({ item }: ItemActionsProps) {
    const [isMiniCartOpen, setIsMiniCartOpen] = useState(false)

    return (
        <>
            {/* Sepete Ekle Butonu */}
            <div className="mt-auto">
                <AddToCartButton
                    item={item}
                    onAddToCart={() => setIsMiniCartOpen(true)}
                />
            </div>

            {/* Ödemeye Geç Butonu - Gri */}
            <div className="mt-4">
                <Link
                    href="/odeme"
                    className="w-full block py-3 px-6 rounded-lg font-semibold transition-colors cursor-pointer bg-gray-700 text-white hover:bg-gray-600 text-center"
                >
                    Ödemeye Geç
                </Link>
            </div>

            {/* Mini Cart */}
            <MiniCart isOpen={isMiniCartOpen} onClose={() => setIsMiniCartOpen(false)} />
        </>
    )
}
