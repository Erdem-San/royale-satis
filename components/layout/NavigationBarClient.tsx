'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavigationBarClientProps {
    initialCategories: any[]
}

export default function NavigationBarClient({ initialCategories }: NavigationBarClientProps) {
    const pathname = usePathname()

    const isActive = (href: string) => {
        if (href === '/') {
            return pathname === '/'
        }
        return pathname?.startsWith(href)
    }

    return (
        <div className="bg-[#252830] border-b border-[#1a1b1e] shadow-lg relative z-30">
            <div className="container mx-auto px-4">
                <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                    <Link
                        href="/"
                        className={`px-4 py-3 text-sm font-bold uppercase transition-colors tracking-wide ${isActive('/') ? 'text-white bg-gray-700' : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                            }`}
                    >
                        OYUNLAR
                    </Link>
                    {initialCategories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/kategori/${category.slug}`}
                            className={`px-4 py-3 text-sm font-bold uppercase transition-colors tracking-wide whitespace-nowrap ${isActive(`/kategori/${category.slug}`) ? 'text-white bg-gray-700' : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                                }`}
                        >
                            {category.name}
                        </Link>
                    ))}
                    <Link
                        href="/"
                        className={`px-4 py-3 text-sm font-bold uppercase transition-colors tracking-wide relative ${isActive('/kampanyalar') ? 'text-green-500 bg-gray-700' : 'text-green-400 hover:text-white hover:bg-gray-700/50'
                            }`}
                    >
                        KAMPANYALAR
                        <span className="absolute -top-0 right-1 bg-red-600 text-white text-[9px] font-bold px-1 rounded-lg animate-pulse">
                            YENİ
                        </span>
                    </Link>
                    <Link
                        href="/"
                        className={`ml-auto px-4 py-3 text-sm font-bold uppercase transition-colors tracking-wide text-green-500 hover:text-green-400`}
                    >
                        +BAKİYE YÜKLE
                    </Link>
                </nav>
            </div>
        </div>
    )
}
