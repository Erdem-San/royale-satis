// @ts-nocheck
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
    const { status, delivery_video_url } = body

    // En az bir alan gerekli
    if (!status && delivery_video_url === undefined) {
      return NextResponse.json({ error: 'Status or delivery_video_url is required' }, { status: 400 })
    }

    // Güncelleme verilerini hazırla
    const updateData: any = {}

    // Status güncellemesi
    if (status) {
      const validStatuses = ['pending', 'processing', 'completed', 'cancelled']
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
      }
      updateData.status = status
    }

    // Video URL güncellemesi
    if (delivery_video_url !== undefined) {
      updateData.delivery_video_url = delivery_video_url
    }

    // Admin client kullan (RLS bypass)
    const adminClient = createAdminClient()

    const { data, error } = await adminClient
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
