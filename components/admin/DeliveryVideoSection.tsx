/**
 * Teslimat Video Yönetimi Component'i
 * Admin sipariş detay sayfasında YouTube teslimat videosu ekleme/düzenleme
 */

'use client'

import { useState } from 'react'
import { getYouTubeEmbedUrl, isValidYouTubeUrl } from '@/lib/utils/youtube'

interface DeliveryVideoSectionProps {
    orderId: string
    currentVideoUrl: string | null
    onVideoUpdated: (newUrl: string | null) => void
}

export default function DeliveryVideoSection({
    orderId,
    currentVideoUrl,
    onVideoUpdated
}: DeliveryVideoSectionProps) {
    const [showVideoInput, setShowVideoInput] = useState(false)
    const [deliveryVideoUrl, setDeliveryVideoUrl] = useState(currentVideoUrl || '')
    const [videoError, setVideoError] = useState('')
    const [savingVideo, setSavingVideo] = useState(false)

    const handleSaveVideo = async () => {
        setVideoError('')

        // URL boşsa (silme işlemi)
        if (!deliveryVideoUrl.trim()) {
            if (!confirm('Teslimat videosunu silmek istediğinizden emin misiniz?')) {
                return
            }
        } else {
            // URL validasyonu
            if (!isValidYouTubeUrl(deliveryVideoUrl)) {
                setVideoError('Geçerli bir YouTube URL\'si giriniz.')
                return
            }
        }

        try {
            setSavingVideo(true)

            const response = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    delivery_video_url: deliveryVideoUrl.trim() || null
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Video kaydedilemedi')
            }

            // Başarılı
            onVideoUpdated(deliveryVideoUrl.trim() || null)
            setShowVideoInput(false)
            alert('Teslimat videosu başarıyla kaydedildi!')
        } catch (error: any) {
            console.error('Error saving video:', error)
            setVideoError(error.message || 'Video kaydedilirken bir hata oluştu')
        } finally {
            setSavingVideo(false)
        }
    }

    const handleRemoveVideo = async () => {
        if (!confirm('Teslimat videosunu silmek istediğinizden emin misiniz?')) {
            return
        }

        try {
            setSavingVideo(true)

            const response = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    delivery_video_url: null
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Video silinemedi')
            }

            onVideoUpdated(null)
            setDeliveryVideoUrl('')
            alert('Teslimat videosu başarıyla silindi!')
        } catch (error: any) {
            console.error('Error removing video:', error)
            alert(error.message || 'Video silinirken bir hata oluştu')
        } finally {
            setSavingVideo(false)
        }
    }

    return (
        <div className="bg-[#1F2125] rounded-lg border border-gray-700/50 p-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">
                📹 Teslimat Videosu
            </h3>

            {currentVideoUrl && !showVideoInput ? (
                <div className="space-y-4">
                    {/* YouTube Embed Player */}
                    <div className="aspect-video rounded-lg overflow-hidden bg-black">
                        <iframe
                            src={getYouTubeEmbedUrl(currentVideoUrl) || ''}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>

                    {/* Video URL ve Aksiyonlar */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <a
                            href={currentVideoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                            </svg>
                            YouTube'da Aç
                        </a>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setDeliveryVideoUrl(currentVideoUrl)
                                    setShowVideoInput(true)
                                }}
                                className="text-sm px-3 py-1.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Videoyu Değiştir
                            </button>
                            <button
                                onClick={handleRemoveVideo}
                                disabled={savingVideo}
                                className="text-sm px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {savingVideo ? 'Siliniyor...' : 'Videoyu Sil'}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {!showVideoInput ? (
                        <>
                            <p className="text-sm text-gray-400">
                                Teslimat videosu henüz eklenmedi.
                            </p>
                            <button
                                onClick={() => setShowVideoInput(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Video Ekle
                            </button>
                        </>
                    ) : (
                        <div className="p-4 bg-[#1a1b1e] rounded-lg border border-gray-700">
                            <label className="block text-sm text-gray-400 mb-2">
                                YouTube Video URL
                            </label>
                            <input
                                type="text"
                                value={deliveryVideoUrl}
                                onChange={(e) => {
                                    setDeliveryVideoUrl(e.target.value)
                                    setVideoError('')
                                }}
                                placeholder="https://www.youtube.com/watch?v=..."
                                className="w-full px-4 py-2 bg-[#252830] text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
                            />
                            {videoError && (
                                <p className="text-sm text-red-400 mt-2">{videoError}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                                Desteklenen formatlar: youtube.com/watch?v=..., youtu.be/...
                            </p>
                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={handleSaveVideo}
                                    disabled={savingVideo}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                                >
                                    {savingVideo ? 'Kaydediliyor...' : 'Kaydet'}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowVideoInput(false)
                                        setDeliveryVideoUrl(currentVideoUrl || '')
                                        setVideoError('')
                                    }}
                                    disabled={savingVideo}
                                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                                >
                                    İptal
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
