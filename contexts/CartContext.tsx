'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Item } from '@/types/item'

interface CartItem {
    item: Item
    quantity: number
}

interface CartContextType {
    items: CartItem[]
    addToCart: (item: Item, quantity: number) => void
    removeFromCart: (itemId: string) => void
    updateQuantity: (itemId: string, quantity: number) => void
    clearCart: () => void
    getTotal: () => number
    getItemCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])

    // Load cart from localStorage on mount
    useEffect(() => {
        // SSR guard: localStorage is only available in browser
        if (typeof window === 'undefined') return

        try {
            const savedCart = localStorage.getItem('cart')
            if (savedCart) {
                setItems(JSON.parse(savedCart))
            }
        } catch (e) {
            console.error('Failed to load cart from localStorage', e)
            // Clear corrupted data
            localStorage.removeItem('cart')
        }
    }, [])

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        // SSR guard: localStorage is only available in browser
        if (typeof window === 'undefined') return

        try {
            localStorage.setItem('cart', JSON.stringify(items))
        } catch (e) {
            console.error('Failed to save cart to localStorage', e)
        }
    }, [items])

    const addToCart = (item: Item, quantity: number) => {
        setItems((prevItems) => {
            const existingItem = prevItems.find((cartItem) => cartItem.item.id === item.id)
            if (existingItem) {
                return prevItems.map((cartItem) =>
                    cartItem.item.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + quantity }
                        : cartItem
                )
            }
            return [...prevItems, { item, quantity }]
        })
    }

    const removeFromCart = (itemId: string) => {
        setItems((prevItems) => prevItems.filter((cartItem) => cartItem.item.id !== itemId))
    }

    const updateQuantity = (itemId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(itemId)
            return
        }
        setItems((prevItems) =>
            prevItems.map((cartItem) =>
                cartItem.item.id === itemId ? { ...cartItem, quantity } : cartItem
            )
        )
    }

    const clearCart = () => {
        setItems([])
    }

    const getTotal = () => {
        return items.reduce((total, cartItem) => total + cartItem.item.price * cartItem.quantity, 0)
    }

    const getItemCount = () => {
        return items.reduce((count, cartItem) => count + cartItem.quantity, 0)
    }

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getTotal,
                getItemCount,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
