import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/giris?redirect=/profil')
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-white mb-8">Profilim</h1>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2">E-posta</label>
              <p className="text-white">{user.email}</p>
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Kullanıcı ID</label>
              <p className="text-white font-mono text-sm">{user.id}</p>
            </div>

            {profile && (
              <>
                <div>
                  <label className="block text-gray-400 mb-2">Rol</label>
                  <p className="text-white">
                    {profile.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                  </p>
                </div>

                {profile.phone && (
                  <div>
                    <label className="block text-gray-400 mb-2">Telefon</label>
                    <p className="text-white">{profile.phone}</p>
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-gray-400 mb-2">Kayıt Tarihi</label>
              <p className="text-white">
                {new Date(user.created_at).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

