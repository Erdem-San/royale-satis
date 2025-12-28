import { createClient } from '@/lib/supabase/server'

export async function isAdmin(): Promise<boolean> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return false
    }

    const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', user.id)
        .single()

    return profile?.role === 'admin'
}
