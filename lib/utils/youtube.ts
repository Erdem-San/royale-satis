/**
 * YouTube URL işleme yardımcı fonksiyonları
 */

/**
 * YouTube URL'sinden video ID'sini çıkarır
 * Desteklenen formatlar:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 */
export function extractYouTubeVideoId(url: string): string | null {
    if (!url) return null

    try {
        const urlObj = new URL(url)

        // youtube.com/watch?v=VIDEO_ID
        if (urlObj.hostname.includes('youtube.com') && urlObj.pathname === '/watch') {
            return urlObj.searchParams.get('v')
        }

        // youtu.be/VIDEO_ID
        if (urlObj.hostname === 'youtu.be') {
            return urlObj.pathname.slice(1)
        }

        // youtube.com/embed/VIDEO_ID
        if (urlObj.hostname.includes('youtube.com') && urlObj.pathname.startsWith('/embed/')) {
            return urlObj.pathname.split('/')[2]
        }

        return null
    } catch (error) {
        return null
    }
}

/**
 * YouTube URL'sini embed URL'sine dönüştürür
 */
export function getYouTubeEmbedUrl(url: string): string | null {
    const videoId = extractYouTubeVideoId(url)
    if (!videoId) return null

    return `https://www.youtube.com/embed/${videoId}`
}

/**
 * YouTube URL'sinin geçerli olup olmadığını kontrol eder
 */
export function isValidYouTubeUrl(url: string): boolean {
    return extractYouTubeVideoId(url) !== null
}

/**
 * YouTube video thumbnail URL'sini döndürür
 */
export function getYouTubeThumbnail(url: string, quality: 'default' | 'hq' | 'mq' | 'sd' | 'maxres' = 'hq'): string | null {
    const videoId = extractYouTubeVideoId(url)
    if (!videoId) return null

    const qualityMap = {
        default: 'default',
        mq: 'mqdefault',
        hq: 'hqdefault',
        sd: 'sddefault',
        maxres: 'maxresdefault'
    }

    return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`
}
