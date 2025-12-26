import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    const adminClient = createAdminClient()

    // Get user profile
    const { data: userProfile, error: profileError } = await adminClient
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (profileError || !userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update auth user if email or password provided
    if (email || password) {
      const updateData: any = {}
      if (email) updateData.email = email
      if (password) updateData.password = password

      const { error: authError } = await adminClient.auth.admin.updateUserById(
        userProfile.user_id,
        updateData
      )

      if (authError) {
        return NextResponse.json({ error: authError.message }, { status: 400 })
      }
    }

    // Update user profile role if provided
    if (role) {
      const { error: updateError } = await adminClient
        .from('user_profiles')
        .update({ role })
        .eq('id', id)

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 400 })
      }
    }

    // Get updated user
    const { data: { user: authUser } } = await adminClient.auth.admin.getUserById(userProfile.user_id)
    const { data: updatedProfile } = await adminClient
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .single()

    return NextResponse.json({ 
      data: {
        id: updatedProfile.id,
        user_id: updatedProfile.user_id,
        email: authUser?.email || updatedProfile.user_id,
        role: updatedProfile.role,
        created_at: updatedProfile.created_at,
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    const adminClient = createAdminClient()

    // Get user profile
    const { data: userProfile, error: profileError } = await adminClient
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (profileError || !userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if this is the last admin
    const { data: adminProfiles } = await adminClient
      .from('user_profiles')
      .select('*')
      .eq('role', 'admin')

    if (userProfile.role === 'admin' && adminProfiles?.length === 1) {
      return NextResponse.json({ error: 'Cannot delete last admin' }, { status: 400 })
    }

    // Delete auth user (this will cascade delete profile due to foreign key)
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(userProfile.user_id)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

