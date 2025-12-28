'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'

interface PaymentFormProps {
    user: any
}

export default function PaymentForm({ user }: PaymentFormProps) {
    const { items, getTotal, clearCart } = useCart()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: user.user_metadata?.name || '',
        email: user.email || '',
        phone: '',
        address: '',
        city: '',
    })
    const router = useRouter()

    // Sepet boşsa sepet sayfasına yönlendir
    useEffect(() => {
        if (items.length === 0) {
            router.push('/sepet')
        }
    }, [items.length, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (items.length === 0) return

        setLoading(true)

        try {
            // Initialize İyzico payment (dummy for now as strictly per existing logic, but we need to create order first)
            // Replicating logic from original page.tsx
            // We need createClient for client-side DB operations or pass a server action. 
            // The original code used client-side supabase. Let's keep using it (Client Component).

            // Note: We need supabase client here.
            const { createClient } = await import('@/lib/supabase/client')
            const supabase = createClient()

            // Create order in database
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    user_id: user.id,
                    total_amount: getTotal(),
                    status: 'pending',
                    payment_status: 'pending',
                })
                .select()
                .single()

            if (orderError) throw orderError

            // Create order items
            const orderItems = items.map((cartItem) => ({
                order_id: order.id,
                item_id: cartItem.item.id,
                quantity: cartItem.quantity,
                price: cartItem.item.price,
            }))

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems)

            if (itemsError) throw itemsError

            // Initialize İyzico payment (dummy)
            const response = await fetch('/api/payment/initialize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId: order.id,
                    amount: getTotal(),
                    buyer: {
                        id: user.id,
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                    },
                }),
            })

            const paymentData = await response.json()

            if (paymentData.success) {
                // Redirect to payment page or show success
                clearCart()
                router.push(`/odeme/basarili?orderId=${order.id}`)
            } else {
                throw new Error(paymentData.error || 'Ödeme başlatılamadı')
            }
        } catch (error: any) {
            alert('Bir hata oluştu: ' + error.message)
            setLoading(false)
        }
    }

    if (items.length === 0) {
        return null // Will redirect via useEffect
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#252830] rounded-lg p-6 border border-gray-800">
                <h2 className="text-xl font-semibold text-white mb-4">Sipariş Bilgileri</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 mb-2">Ad Soyad</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 bg-[#1a1b1e] text-white rounded-lg border border-gray-600 focus:outline-none focus:border-green-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-2">E-posta</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2 bg-[#1a1b1e] text-white rounded-lg border border-gray-600 focus:outline-none focus:border-green-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-2">Telefon</label>
                        <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-2 bg-[#1a1b1e] text-white rounded-lg border border-gray-600 focus:outline-none focus:border-green-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-2">Adres</label>
                        <textarea
                            required
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full px-4 py-2 bg-[#1a1b1e] text-white rounded-lg border border-gray-600 focus:outline-none focus:border-green-500"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-2">Şehir</label>
                        <input
                            type="text"
                            required
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="w-full px-4 py-2 bg-[#1a1b1e] text-white rounded-lg border border-gray-600 focus:outline-none focus:border-green-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50"
                    >
                        {loading ? 'İşleniyor...' : 'Ödemeyi Tamamla'}
                    </button>
                </form>
            </div>

            <div className="bg-[#252830] rounded-lg p-6 border border-gray-800">
                <h2 className="text-xl font-semibold text-white mb-4">Sipariş Özeti</h2>
                <div className="space-y-2 mb-4">
                    {items.map((cartItem) => (
                        <div key={cartItem.item.id} className="flex justify-between text-gray-400 text-sm">
                            <span>{cartItem.item.name} x {cartItem.quantity}</span>
                            <span>{(cartItem.item.price * cartItem.quantity).toFixed(2)} ₺</span>
                        </div>
                    ))}
                </div>
                <div className="border-t border-gray-700 pt-4">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-white">Toplam:</span>
                        <span className="text-2xl font-bold text-green-400">
                            {getTotal().toFixed(2)} ₺
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
