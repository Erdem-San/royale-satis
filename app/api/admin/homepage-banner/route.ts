import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { title, subtitle, banner_url, is_active } = body

    // Eğer yeni banner aktifse, diğerlerini pasif yap
    const adminClient = createAdminClient()
    
    if (is_active) {
      await adminClient
        .from('homepage_banner')
        .update({ is_active: false })
        .eq('is_active', true)
    }

    const { data, error } = await adminClient
      .from('homepage_banner')
      .insert({
        title,
        subtitle,
        banner_url,
        is_active,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}





