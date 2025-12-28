'use client'

import Link from 'next/link'

export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-[#1a1b1e]">
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center gap-2 mb-4 text-[11px] font-bold text-gray-400">
                    <Link href="/" className="px-3 py-1 bg-[#252830] rounded-lg hover:bg-gray-700 hover:text-white transition-colors">
                        Anasayfa
                    </Link>
                    <span className="text-gray-600">&gt;</span>
                    <div className="px-3 py-1 bg-[#252830] rounded-lg text-gray-300">
                        Ödeme
                    </div>
                </div>

                <div className="max-w-2xl mx-auto">
                    <div className="bg-[#252830] rounded-lg p-8 border border-gray-800 text-center">
                        <h1 className="text-3xl font-bold text-white mb-4">Ödeme Sayfası</h1>
                        <p className="text-gray-400 mb-6">
                            Ödeme entegrasyonu için İyzico API ayarları gereklidir.
                        </p>
                        <p className="text-gray-500 text-sm">
                            Bu sayfa royale-satis'teki ödeme akışı ile tamamlanacaktır.
                        </p>
                        <Link
                            href="/sepet"
                            className="inline-block mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Sepete Dön
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
