/**
 * Müşteri Teslimat Videosu Component'i
 * Müşteri sipariş detay sayfasında teslimat videosunu gösterir
 * Dropdown/Collapsible olarak çalışır
 */

'use client'

import { useState } from 'react'
import { getYouTubeEmbedUrl } from '@/lib/utils/youtube'

interface CustomerDeliveryVideoProps {
    videoUrl: string
}

export default function CustomerDeliveryVideo({ videoUrl }: CustomerDeliveryVideoProps) {
    const [isOpen, setIsOpen] = useState(false)
    const embedUrl = getYouTubeEmbedUrl(videoUrl)

    if (!embedUrl) {
        return null
    }

    return (
        <div className="bg-[#252830] rounded-lg border border-gray-800 overflow-hidden">
            {/* Header - Tıklanabilir */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 md:px-6 py-4 flex items-center justify-between hover:bg-[#2a2d35] transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="text-2xl">📹</span>
                    <div className="text-left">
                        <h3 className="text-base md:text-lg font-semibold text-white">
                            Teslimat Videosu
                        </h3>
                        <p className="text-xs md:text-sm text-gray-400">
                            {isOpen ? 'Videoyu gizlemek için tıklayın' : 'Videoyu izlemek için tıklayın'}
                        </p>
                    </div>
                </div>

                {/* Chevron Icon */}
                <svg
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Content - Açılır/Kapanır */}
            <div
                className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                    } overflow-hidden`}
            >
                <div className="px-4 md:px-6 pb-4 md:pb-6">
                    <p className="text-sm text-gray-400 mb-4">
                        Siparişinizin teslimat sürecini aşağıdaki videodan izleyebilirsiniz.
                    </p>

                    {/* YouTube Embed Player - Sadece açıksa yükle */}
                    {isOpen && (
                        <div className="aspect-video rounded-lg overflow-hidden bg-black mb-4">
                            <iframe
                                src={embedUrl}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="Teslimat Videosu"
                            />
                        </div>
                    )}

                    {/* YouTube'da Aç Linki */}
                    <div className="flex justify-end">
                        <a
                            href={videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                            </svg>
                            YouTube'da Aç
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
