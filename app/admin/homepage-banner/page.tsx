import { createClient } from '@/lib/supabase/server'
import HomepageBannerForm from '@/components/admin/HomepageBannerForm'

export default async function AdminHomepageBannerPage() {
  const supabase = await createClient()

  const { data: banners, error } = await supabase
    .from('homepage_banner')
    .select('*')
    .order('created_at', { ascending: false })

  const activeBanner = banners?.find(b => b.is_active)

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Anasayfa Banner Yönetimi</h1>
        <p className="text-gray-400 mt-2">
          Anasayfanın hero banner'ını yönetin
        </p>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4">
          Bir hata oluştu: {error.message}
        </div>
      )}

      <HomepageBannerForm banner={activeBanner} />
    </div>
  )
}

