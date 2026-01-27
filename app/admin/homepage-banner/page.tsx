import { createClient } from '@/lib/supabase/server'
import HomepageBannerForm from '@/components/admin/HomepageBannerForm'
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default async function AdminHomepageBannerPage() {
  const supabase = await createClient()

  const { data: banners, error } = await supabase
    .from('homepage_banner')
    .select('*')
    .order('created_at', { ascending: false })
    .returns<any[]>()

  const activeBanner = banners?.find(b => b.is_active)

  return (
    <div className="py-6">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">
            Anasayfa Banner Yönetimi
          </h2>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4">
            Bir hata oluştu: {error.message}
          </div>
        )}

        <HomepageBannerForm banner={activeBanner} />
      </div>
    </div>
  )
}

