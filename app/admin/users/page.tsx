import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/utils/auth'

export default async function AdminUsersPage() {
  const admin = await isAdmin()
  
  if (!admin) {
    redirect('/')
  }

  const supabase = await createClient()

  const { data: profiles, error } = await supabase
    .from('user_profiles')
    .select(`
      *,
      user:auth.users!user_profiles_user_id_fkey(email, created_at)
    `)
    .order('created_at', { ascending: false })

  const updateUserRole = async (userId: string, role: string) => {
    'use server'
    const supabase = await createClient()
    await supabase
      .from('user_profiles')
      .update({ role })
      .eq('user_id', userId)
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Kullanıcı Yönetimi</h1>

        {error ? (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded">
            Bir hata oluştu: {error.message}
          </div>
        ) : !profiles || profiles.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400 text-lg">Henüz kullanıcı bulunmamaktadır.</p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-white font-semibold">E-posta</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">Rol</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">Kayıt Tarihi</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((profile: any) => (
                  <tr key={profile.id} className="border-t border-gray-700">
                    <td className="px-4 py-3 text-white">
                      {profile.user?.email || profile.user_id}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded ${
                        profile.role === 'admin' ? 'bg-yellow-600 text-white' : 'bg-gray-600 text-gray-300'
                      }`}>
                        {profile.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {profile.user?.created_at
                        ? new Date(profile.user.created_at).toLocaleDateString('tr-TR')
                        : '-'}
                    </td>
                    <td className="px-4 py-3">
                      {profile.role !== 'admin' && (
                        <form action={updateUserRole.bind(null, profile.user_id, 'admin')} className="inline">
                          <button
                            type="submit"
                            className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm"
                          >
                            Admin Yap
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

