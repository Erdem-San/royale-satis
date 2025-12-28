'use client'

import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'
import { useEffect } from 'react'

interface MiniCartProps {
    isOpen: boolean
    onClose: () => void
}

export default function MiniCart({ isOpen, onClose }: MiniCartProps) {
    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }
        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    const { items, removeFromCart, updateQuantity, getTotal } = useCart()

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Slide-over panel */}
            <div
                className={`fixed right-0 top-0 h-full w-full sm:w-[400px] bg-[#1F2228] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                    <h2 className="text-xl font-bold text-white">Sepetim ({items.length})</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-2"
                        aria-label="Kapat"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ maxHeight: 'calc(100vh - 240px)' }}>
                    {items.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <p className="text-gray-400">Sepetiniz boş</p>
                        </div>
                    ) : (
                        items.map((cartItem) => (
                            <div key={cartItem.item.id} className="flex gap-4 bg-[#252830] p-4 rounded-lg border border-gray-800">
                                {/* Image */}
                                <div className="w-20 h-20 bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden">
                                    {cartItem.item.image_url ? (
                                        <img
                                            src={cartItem.item.image_url}
                                            alt={cartItem.item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-white font-semibold text-sm mb-1 truncate">{cartItem.item.name}</h3>
                                    <p className="text-green-400 font-bold text-sm mb-2">
                                        {cartItem.item.price.toFixed(2)} ₺
                                    </p>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                                            className="w-6 h-6 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="text-white text-sm w-8 text-center">{cartItem.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                                            className="w-6 h-6 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center transition-colors"
                                        >
                                            +
                                        </button>
                                        <button
                                            onClick={() => removeFromCart(cartItem.item.id)}
                                            className="ml-auto text-red-400 hover:text-red-300 transition-colors"
                                            aria-label="Sil"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-gray-800 p-6 space-y-4">
                        {/* Total */}
                        <div className="flex items-center justify-between text-lg">
                            <span className="text-gray-400 font-semibold">Toplam:</span>
                            <span className="text-green-400 font-bold text-2xl">{getTotal().toFixed(2)} ₺</span>
                        </div>

                        {/* Buttons */}
                        <div className="space-y-3">
                            <Link
                                href="/sepet"
                                onClick={onClose}
                                className="block w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-center transition-colors"
                            >
                                Sepete Git
                            </Link>
                            <Link
                                href="/odeme"
                                onClick={onClose}
                                className="block w-full py-3 px-6 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-center transition-colors"
                            >
                                Ödemeye Geç
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
