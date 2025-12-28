'use client'

import Link from 'next/link'

export default function TopBar() {
    return (
        <div className="flex flex-col w-full">
            {/* Top Strip - Üst ince şerit */}
            <div className="bg-[#252830] border-b border-[#1a1b1e] py-1.5">
                <div className="container mx-auto px-4">
                    <div className="flex justify-end text-[11px] font-medium text-gray-400 gap-4 tracking-wide">
                        <Link href="/" className="hover:text-white transition-colors">Blog</Link>
                        <span className="text-gray-700">|</span>
                        <Link href="/" className="hover:text-white transition-colors">Yardım & Destek</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
