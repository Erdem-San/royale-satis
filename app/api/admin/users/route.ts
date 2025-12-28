import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    const adminClient = createAdminClient()
    
    // Get all user profiles
    let profilesQuery = adminClient
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false })

    const { data: profiles, error: profilesError } = await profilesQuery

    if (profilesError) {
      return NextResponse.json({ error: profilesError.message }, { status: 400 })
    }

    // Get auth users
    const userIds = profiles?.map(p => p.user_id).filter(Boolean) || []
    const { data: { users: authUsers }, error: authError } = await adminClient.auth.admin.listUsers()

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // Combine profiles with auth users
    const users = profiles?.map(profile => {
      const authUser = authUsers?.find((u: any) => u.id === profile.user_id)
      return {
        id: profile.id,
        user_id: profile.user_id,
        email: authUser?.email || profile.user_id,
        role: profile.role,
        created_at: profile.created_at,
      }
    }).filter(user => {
      if (!search || !search.trim()) return true
      const searchLower = search.toLowerCase()
      return user.email.toLowerCase().includes(searchLower)
    }) || []

    return NextResponse.json({ data: users })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

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
    const { email, password, role } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const adminClient = createAdminClient()

    // Create auth user
    const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // Create user profile
    const { data: userProfile, error: profileError } = await adminClient
      .from('user_profiles')
      .insert({
        user_id: authUser.user.id,
        role: role || 'user',
      })
      .select()
      .single()

    if (profileError) {
      // Rollback: delete auth user if profile creation fails
      await adminClient.auth.admin.deleteUser(authUser.user.id)
      return NextResponse.json({ error: profileError.message }, { status: 400 })
    }

    return NextResponse.json({ 
      data: {
        id: userProfile.id,
        user_id: userProfile.user_id,
        email: authUser.user.email,
        role: userProfile.role,
        created_at: userProfile.created_at,
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

